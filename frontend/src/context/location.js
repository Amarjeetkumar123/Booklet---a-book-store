import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "../config/axios";
import {
  getDistanceInKm,
  matchAreaByCustomerLocation,
  normalizeLocationKey,
  normalizePincode,
  toNumberOrNull,
} from "../utils/locationUtils";

const LocationContext = createContext();
const DEFAULT_LOCATION_STORAGE_KEY = "selectedLocation";
const DEFAULT_CUSTOMER_LOCATION_STORAGE_KEY = "detectedCustomerLocation";

const normalizeLocationId = (value) => normalizeLocationKey(value);

const getCurrentCoordinates = () =>
  new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      reject(new Error("Geolocation is not supported on this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 120000,
      }
    );
  });

const reverseLookupPincode = async (latitude, longitude) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      latitude
    )}&lon=${encodeURIComponent(longitude)}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      return { pincode: "", displayName: "" };
    }
    const data = await response.json();
    return {
      pincode: normalizePincode(data?.address?.postcode || ""),
      displayName: data?.display_name || "",
    };
  } catch (error) {
    return { pincode: "", displayName: "" };
  }
};

export const LocationProvider = ({ children }) => {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [selectedLocation, setSelectedLocationState] = useState("");
  const [customerLocation, setCustomerLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectingCurrentLocation, setDetectingCurrentLocation] = useState(false);
  const [locationDetectionError, setLocationDetectionError] = useState("");

  useEffect(() => {
    const fromStorage = localStorage.getItem(DEFAULT_LOCATION_STORAGE_KEY);
    if (fromStorage) {
      setSelectedLocationState(normalizeLocationId(fromStorage));
    }

    const customerLocationFromStorage = localStorage.getItem(
      DEFAULT_CUSTOMER_LOCATION_STORAGE_KEY
    );
    if (customerLocationFromStorage) {
      try {
        const parsed = JSON.parse(customerLocationFromStorage);
        if (parsed && typeof parsed === "object") {
          setCustomerLocation(parsed);
        }
      } catch (error) {
        localStorage.removeItem(DEFAULT_CUSTOMER_LOCATION_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const loadServiceAreas = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/v1/location/service-areas");
        const options = Array.isArray(data?.serviceAreas) ? data.serviceAreas : [];
        const normalizedOptions = options.map((area) => ({
          id: normalizeLocationId(area?.id),
          key: normalizeLocationId(area?.key || area?.id),
          label: area?.label || area?.id || "",
          pincode: normalizePincode(area?.pincode),
          latitude: toNumberOrNull(area?.latitude),
          longitude: toNumberOrNull(area?.longitude),
          radiusKm: toNumberOrNull(area?.radiusKm) ?? 0,
          type: area?.type || "urban",
          isActive: area?.isActive !== false,
          _id: area?._id,
        }));

        setServiceAreas(normalizedOptions);

        const validIds = new Set(normalizedOptions.map((area) => area.id));
        const defaultLocation = normalizeLocationId(data?.defaultLocation);

        setSelectedLocationState((prev) => {
          if (prev && validIds.has(prev)) return prev;
          const next =
            (defaultLocation && validIds.has(defaultLocation) && defaultLocation) ||
            normalizedOptions[0]?.id ||
            "";
          if (next) {
            localStorage.setItem(DEFAULT_LOCATION_STORAGE_KEY, next);
          }
          return next;
        });
      } catch (error) {
        console.log("Error loading service areas:", error);
        setServiceAreas([]);
      } finally {
        setLoading(false);
      }
    };

    loadServiceAreas();
  }, []);

  const setSelectedLocation = (locationId) => {
    const normalized = normalizeLocationId(locationId);
    setSelectedLocationState(normalized);
    if (normalized) {
      localStorage.setItem(DEFAULT_LOCATION_STORAGE_KEY, normalized);
    } else {
      localStorage.removeItem(DEFAULT_LOCATION_STORAGE_KEY);
    }
  };

  const detectCurrentLocation = async ({ autoSelect = true, silent = false } = {}) => {
    try {
      setDetectingCurrentLocation(true);
      if (!silent) {
        setLocationDetectionError("");
      }

      const coordinates = await getCurrentCoordinates();
      const reverseLookup = await reverseLookupPincode(
        coordinates.latitude,
        coordinates.longitude
      );

      const match = matchAreaByCustomerLocation(serviceAreas, {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        pincode: reverseLookup.pincode,
      });

      const nextCustomerLocation = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        pincode: reverseLookup.pincode,
        displayName: reverseLookup.displayName,
        detectedAt: new Date().toISOString(),
        matchedBy: match?.matchedBy || "",
        matchedAreaKey: match?.area?.id || "",
        matchedDistanceKm:
          typeof match?.distanceKm === "number" ? match.distanceKm : null,
      };

      setCustomerLocation(nextCustomerLocation);
      localStorage.setItem(
        DEFAULT_CUSTOMER_LOCATION_STORAGE_KEY,
        JSON.stringify(nextCustomerLocation)
      );

      if (autoSelect && match?.area?.id) {
        setSelectedLocation(match.area.id);
      }

      if (!silent && !match?.area) {
        setLocationDetectionError(
          "Your current location is outside delivery range. Please choose a service area manually."
        );
      }

      return {
        success: true,
        customerLocation: nextCustomerLocation,
        matchedArea: match?.area || null,
      };
    } catch (error) {
      const fallbackMessage =
        error?.code === 1
          ? "Location access denied. Please allow location permission."
          : "Unable to detect current location.";

      if (!silent) {
        setLocationDetectionError(fallbackMessage);
      }
      return { success: false, error };
    } finally {
      setDetectingCurrentLocation(false);
    }
  };

  useEffect(() => {
    if (!serviceAreas.length || customerLocation) return;

    const hasStoredSelection = Boolean(
      localStorage.getItem(DEFAULT_LOCATION_STORAGE_KEY)
    );
    if (hasStoredSelection) return;

    detectCurrentLocation({ autoSelect: true, silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceAreas.length]);

  const selectedServiceArea = useMemo(
    () => serviceAreas.find((area) => area.id === selectedLocation) || null,
    [serviceAreas, selectedLocation]
  );

  const selectedAreaDistanceKm = useMemo(() => {
    if (!selectedServiceArea) return null;
    const latitude = toNumberOrNull(customerLocation?.latitude);
    const longitude = toNumberOrNull(customerLocation?.longitude);
    if (latitude === null || longitude === null) return null;

    return getDistanceInKm(
      latitude,
      longitude,
      selectedServiceArea.latitude,
      selectedServiceArea.longitude
    );
  }, [customerLocation, selectedServiceArea]);

  const isSelectedAreaInRange = useMemo(() => {
    if (selectedAreaDistanceKm === null) return true;
    const allowedRadius = Number(selectedServiceArea?.radiusKm) || 0;
    return selectedAreaDistanceKm <= allowedRadius;
  }, [selectedAreaDistanceKm, selectedServiceArea?.radiusKm]);

  const selectedLocationLabel = useMemo(
    () => selectedServiceArea?.label || "Select Location",
    [selectedServiceArea]
  );

  const selectedLocationPincode = selectedServiceArea?.pincode || "";

  const clearDetectedCustomerLocation = () => {
    setCustomerLocation(null);
    setLocationDetectionError("");
    localStorage.removeItem(DEFAULT_CUSTOMER_LOCATION_STORAGE_KEY);
  };

  return (
    <LocationContext.Provider
      value={{
        serviceAreas,
        selectedLocation,
        selectedLocationLabel,
        selectedLocationPincode,
        selectedServiceArea,
        selectedAreaDistanceKm,
        isSelectedAreaInRange,
        customerLocation,
        setCustomerLocation,
        detectCurrentLocation,
        detectingCurrentLocation,
        locationDetectionError,
        clearDetectedCustomerLocation,
        setSelectedLocation,
        loading,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
