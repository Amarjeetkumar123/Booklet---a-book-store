import mongoose from "mongoose";
import { DEFAULT_SERVICE_AREAS } from "../config/serviceAreas.js";
import serviceAreaModel from "../models/serviceAreaModel.js";
import {
  normalizeLocationKey,
  normalizePincode,
  toNumberOrNull,
} from "../utils/locationUtils.js";

const NOIDA_REGION_PINCODE_PREFIXES = ["2013", "201009"];
const NOIDA_REGION_KEYWORDS = ["noida", "greater noida", "greater-noida"];

const getServiceAreaId = (serviceArea) => String(serviceArea?.key || "");

const serializeServiceArea = (serviceArea) => ({
  _id: serviceArea?._id,
  id: getServiceAreaId(serviceArea),
  key: getServiceAreaId(serviceArea),
  label: serviceArea?.label || "",
  pincode: serviceArea?.pincode || "",
  latitude: Number(serviceArea?.latitude) || 0,
  longitude: Number(serviceArea?.longitude) || 0,
  radiusKm: Number(serviceArea?.radiusKm) || 0,
  type: serviceArea?.type || "urban",
  isActive: Boolean(serviceArea?.isActive),
});

const isNoidaOrGreaterNoidaArea = (area = {}) => {
  const key = normalizeLocationKey(area?.key || "");
  const label = String(area?.label || "").trim().toLowerCase();
  const pincode = normalizePincode(area?.pincode);

  const keywordSource = `${key} ${label}`;
  const hasNoidaKeyword = NOIDA_REGION_KEYWORDS.some((keyword) =>
    keywordSource.includes(keyword)
  );
  const hasNoidaPincodePrefix = NOIDA_REGION_PINCODE_PREFIXES.some((prefix) =>
    pincode.startsWith(prefix)
  );

  return hasNoidaKeyword || hasNoidaPincodePrefix;
};

const disableNonNoidaAreas = async () => {
  const activeAreas = await serviceAreaModel
    .find({ isActive: true })
    .select("_id key label pincode");

  const outsideNoidaIds = activeAreas
    .filter((area) => !isNoidaOrGreaterNoidaArea(area))
    .map((area) => area._id);

  if (!outsideNoidaIds.length) return;

  await serviceAreaModel.updateMany(
    { _id: { $in: outsideNoidaIds } },
    { $set: { isActive: false } }
  );
};

const ensureDefaultServiceAreas = async () => {
  const defaultDocs = DEFAULT_SERVICE_AREAS.map((area) => ({
    key: normalizeLocationKey(area.key || area.label),
    label: String(area.label || "").trim(),
    pincode: normalizePincode(area.pincode),
    latitude: Number(area.latitude),
    longitude: Number(area.longitude),
    radiusKm: Number(area.radiusKm) || 8,
    type: String(area.type || "urban").trim().toLowerCase(),
    isActive: true,
  }));

  if (defaultDocs.length) {
    await serviceAreaModel.bulkWrite(
      defaultDocs.map((doc) => ({
        updateOne: {
          filter: { key: doc.key },
          update: {
            $setOnInsert: doc,
          },
          upsert: true,
        },
      }))
    );
  }

  await disableNonNoidaAreas();
};

const parseServiceAreaPayload = (payload = {}) => {
  const label = String(payload?.label || "").trim();
  const pincode = normalizePincode(payload?.pincode);
  const generatedKey = normalizeLocationKey(
    payload?.key || `${label}-${pincode}`
  );
  const latitude = toNumberOrNull(payload?.latitude);
  const longitude = toNumberOrNull(payload?.longitude);
  const radiusKm = toNumberOrNull(payload?.radiusKm) ?? 8;
  const type = String(payload?.type || "urban").trim().toLowerCase() || "urban";

  if (!label) {
    throw new Error("Service area name is required");
  }

  if (!generatedKey) {
    throw new Error("Valid service area key is required");
  }

  if (!pincode || pincode.length !== 6) {
    throw new Error("Valid 6-digit pincode is required");
  }

  if (
    !isNoidaOrGreaterNoidaArea({
      key: generatedKey,
      label,
      pincode,
    })
  ) {
    throw new Error(
      "Only Noida and Greater Noida service areas are allowed"
    );
  }

  if (latitude === null || latitude < -90 || latitude > 90) {
    throw new Error("Valid latitude is required");
  }

  if (longitude === null || longitude < -180 || longitude > 180) {
    throw new Error("Valid longitude is required");
  }

  if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
    throw new Error("Radius should be greater than 0");
  }

  const area = {
    key: generatedKey,
    label,
    pincode,
    latitude,
    longitude,
    radiusKm,
    type,
  };

  if (typeof payload?.isActive === "boolean") {
    area.isActive = payload.isActive;
  }

  return area;
};

const findServiceAreaByIdentifier = async (identifier) => {
  const value = String(identifier || "").trim();
  if (!value) return null;

  if (mongoose.isValidObjectId(value)) {
    const byId = await serviceAreaModel.findById(value);
    if (byId) return byId;
  }

  return serviceAreaModel.findOne({ key: normalizeLocationKey(value) });
};

export const getServiceAreasController = async (req, res) => {
  try {
    await ensureDefaultServiceAreas();

    const serviceAreas = await serviceAreaModel
      .find({ isActive: true })
      .sort({ label: 1 });

    const response = serviceAreas.map(serializeServiceArea);

    return res.status(200).send({
      success: true,
      serviceAreas: response,
      defaultLocation: response[0]?.id || "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to fetch service areas",
    });
  }
};

export const getAdminServiceAreasController = async (req, res) => {
  try {
    await ensureDefaultServiceAreas();

    const serviceAreas = await serviceAreaModel.find({}).sort({ createdAt: -1 });
    const filteredServiceAreas = serviceAreas.filter((area) =>
      isNoidaOrGreaterNoidaArea(area)
    );

    return res.status(200).send({
      success: true,
      serviceAreas: filteredServiceAreas.map(serializeServiceArea),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to fetch admin service areas",
    });
  }
};

export const createServiceAreaController = async (req, res) => {
  try {
    const payload = parseServiceAreaPayload(req.body);

    const exists = await serviceAreaModel.findOne({ key: payload.key });
    if (exists) {
      return res.status(409).send({
        success: false,
        message: "Service area key already exists",
      });
    }

    const serviceArea = await serviceAreaModel.create({
      ...payload,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    });

    return res.status(201).send({
      success: true,
      message: "Service area created",
      serviceArea: serializeServiceArea(serviceArea),
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: error.message || "Unable to create service area",
    });
  }
};

export const updateServiceAreaController = async (req, res) => {
  try {
    const serviceArea = await findServiceAreaByIdentifier(req.params.id);
    if (!serviceArea) {
      return res.status(404).send({
        success: false,
        message: "Service area not found",
      });
    }

    const payload = parseServiceAreaPayload({
      ...serviceArea.toObject(),
      ...req.body,
    });

    const keyChanged = payload.key !== serviceArea.key;
    if (keyChanged) {
      const duplicate = await serviceAreaModel.findOne({ key: payload.key });
      if (duplicate) {
        return res.status(409).send({
          success: false,
          message: "Service area key already exists",
        });
      }
    }

    const updated = await serviceAreaModel.findByIdAndUpdate(
      serviceArea._id,
      {
        ...payload,
        updatedBy: req.user?._id || null,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Service area updated",
      serviceArea: serializeServiceArea(updated),
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: error.message || "Unable to update service area",
    });
  }
};

export const deleteServiceAreaController = async (req, res) => {
  try {
    const serviceArea = await findServiceAreaByIdentifier(req.params.id);
    if (!serviceArea) {
      return res.status(404).send({
        success: false,
        message: "Service area not found",
      });
    }

    const updated = await serviceAreaModel.findByIdAndUpdate(
      serviceArea._id,
      {
        isActive: false,
        updatedBy: req.user?._id || null,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Service area disabled",
      serviceArea: serializeServiceArea(updated),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to delete service area",
    });
  }
};
