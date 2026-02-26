import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "../../config/axios";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiEdit3,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";

const DEFAULT_FORM = {
  label: "",
  key: "",
  pincode: "",
  latitude: "",
  longitude: "",
  radiusKm: "8",
  type: "urban",
  isActive: true,
};

const normalizePincode = (value) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 6);

const ServiceLocations = () => {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState("");

  const getServiceAreas = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/location/admin/service-areas");
      setServiceAreas(Array.isArray(data?.serviceAreas) ? data.serviceAreas : []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load service locations");
      setServiceAreas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceAreas();
  }, []);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId("");
  };

  const activeCount = useMemo(
    () => serviceAreas.filter((area) => area.isActive).length,
    [serviceAreas]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);

      const payload = {
        label: form.label.trim(),
        key: form.key.trim(),
        pincode: normalizePincode(form.pincode),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radiusKm: Number(form.radiusKm),
        type: String(form.type || "urban").trim().toLowerCase(),
        isActive: Boolean(form.isActive),
      };

      if (editingId) {
        const { data } = await axios.put(
          `/api/v1/location/admin/service-areas/${editingId}`,
          payload
        );
        if (!data?.success) {
          throw new Error(data?.message || "Unable to update service area");
        }
        toast.success("Service location updated");
      } else {
        const { data } = await axios.post(
          "/api/v1/location/admin/service-areas",
          payload
        );
        if (!data?.success) {
          throw new Error(data?.message || "Unable to create service area");
        }
        toast.success("Service location created");
      }

      resetForm();
      getServiceAreas();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save service location"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (area) => {
    setEditingId(area?._id || area?.id || "");
    setForm({
      label: area?.label || "",
      key: area?.key || area?.id || "",
      pincode: area?.pincode || "",
      latitude:
        typeof area?.latitude === "number" ? String(area.latitude) : "",
      longitude:
        typeof area?.longitude === "number" ? String(area.longitude) : "",
      radiusKm:
        typeof area?.radiusKm === "number" ? String(area.radiusKm) : "8",
      type: area?.type || "urban",
      isActive: area?.isActive !== false,
    });
  };

  const handleToggleActive = async (area) => {
    try {
      const identifier = area?._id || area?.id;
      if (!identifier) return;

      if (area?.isActive) {
        const { data } = await axios.delete(
          `/api/v1/location/admin/service-areas/${identifier}`
        );
        if (!data?.success) {
          throw new Error(data?.message || "Unable to disable location");
        }
        toast.success("Service location disabled");
      } else {
        const { data } = await axios.put(
          `/api/v1/location/admin/service-areas/${identifier}`,
          { isActive: true }
        );
        if (!data?.success) {
          throw new Error(data?.message || "Unable to activate location");
        }
        toast.success("Service location activated");
      }

      getServiceAreas();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to change location status"
      );
    }
  };

  return (
    <Layout title="Admin - Service Locations">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start lg:h-full">
          <div>
            <AdminMenu />
          </div>

          <div className="min-w-0 lg:h-full lg:overflow-y-auto lg:pr-1 space-y-5">
            <div className="rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-accent-50 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white text-accent-700 flex items-center justify-center border border-accent-200 shadow-sm">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-primary-900">
                      Service Locations
                    </h1>
                    <p className="text-sm text-primary-600">
                      Manage delivery zones with pincode and radius.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={getServiceAreas}
                  className="h-9 px-3 rounded-lg border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 text-sm font-semibold inline-flex items-center gap-1.5"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[380px,1fr] gap-5">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-primary-200 bg-white p-4 shadow-sm space-y-3"
              >
                <h2 className="text-sm font-semibold text-primary-900">
                  {editingId ? "Update Service Area" : "Add Service Area"}
                </h2>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                    Area Name
                  </label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, label: e.target.value }))
                    }
                    placeholder="e.g. Sector 62, Noida"
                    className="mt-1 w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                    Key (optional)
                  </label>
                  <input
                    type="text"
                    value={form.key}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, key: e.target.value }))
                    }
                    placeholder="auto generated if empty"
                    className="mt-1 w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pincode: normalizePincode(e.target.value),
                      }))
                    }
                    placeholder="6-digit pincode"
                    className="mt-1 w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.latitude}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, latitude: e.target.value }))
                      }
                      className="mt-1 w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.longitude}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      className="mt-1 w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                      Radius (km)
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={form.radiusKm}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          radiusKm: e.target.value,
                        }))
                      }
                      className="mt-1 w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                      Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, type: e.target.value }))
                      }
                      className="mt-1 w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    >
                      <option value="urban">Urban</option>
                      <option value="town">Town</option>
                      <option value="village">Village</option>
                    </select>
                  </div>
                </div>

                <label className="h-10 px-3 rounded-lg border border-primary-200 bg-primary-50 inline-flex items-center gap-2 text-sm text-primary-700 w-fit">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="accent-accent-600"
                  />
                  Active for customer selection
                </label>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-10 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white text-sm font-semibold inline-flex items-center gap-2"
                  >
                    {editingId ? <FiSave className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
                    {submitting
                      ? "Saving..."
                      : editingId
                        ? "Update Area"
                        : "Add Area"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="h-10 px-3 rounded-lg border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 text-sm font-semibold"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              <div className="rounded-2xl border border-primary-200 bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-primary-100 bg-primary-50/70 flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary-900">
                    Total: {serviceAreas.length} areas
                  </p>
                  <p className="text-sm font-semibold text-green-700 inline-flex items-center gap-1.5">
                    <FiCheckCircle className="h-4 w-4" />
                    Active: {activeCount}
                  </p>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-sm text-primary-600">
                    Loading service areas...
                  </div>
                ) : serviceAreas.length === 0 ? (
                  <div className="py-12 text-center text-sm text-primary-600">
                    No service locations found.
                  </div>
                ) : (
                  <div className="divide-y divide-primary-100">
                    {serviceAreas.map((area) => (
                      <div key={area._id || area.id} className="px-4 py-3.5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-primary-900">
                              {area.label}
                            </p>
                            <p className="text-xs text-primary-600 mt-1">
                              {area.key} • PIN {area.pincode} • Radius{" "}
                              {area.radiusKm} km
                            </p>
                            <p className="text-xs text-primary-500 mt-1">
                              {area.latitude}, {area.longitude}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(area)}
                              className="h-9 px-3 rounded-lg border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 text-xs font-semibold inline-flex items-center gap-1.5"
                            >
                              <FiEdit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(area)}
                              className={`h-9 px-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 ${
                                area.isActive
                                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                  : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                            >
                              {area.isActive ? (
                                <>
                                  <FiToggleRight className="h-3.5 w-3.5" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <FiToggleLeft className="h-3.5 w-3.5" />
                                  Activate
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceLocations;
