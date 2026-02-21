import React, { useState, useEffect, useRef, useMemo } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import {
  FiBox,
  FiFileText,
  FiHash,
  FiImage,
  FiLink,
  FiTag,
  FiTruck,
  FiUpload,
} from "react-icons/fi";

const CreateProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("0");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageInputMode, setImageInputMode] = useState("url");

  const activeImageUrls = useMemo(
    () =>
      imageInputMode === "url"
        ? imageUrls
        : uploadedImages.map((item) => item.dataUrl),
    [imageInputMode, imageUrls, uploadedImages]
  );

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    try {
      const productData = {
        name,
        description,
        price,
        quantity,
        imageUrl: activeImageUrls[0] || "",
        imageUrls: activeImageUrls,
        category,
        shipping: shipping === "1",
      };
      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData
      );
      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Unable to create product");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      return;
    }

    const validFiles = [];
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 2MB limit`);
        return;
      }
      validFiles.push(file);
    });

    if (!validFiles.length) {
      e.target.value = "";
      return;
    }

    const readFileAsDataUrl = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(
            typeof reader.result === "string"
              ? {
                  name: file.name,
                  dataUrl: reader.result,
                }
              : null
          );
        };
        reader.readAsDataURL(file);
      });

    const fileData = (await Promise.all(validFiles.map(readFileAsDataUrl)))
      .filter(Boolean)
      .map((item) => item);

    setUploadedImages((prev) => {
      const merged = [...prev, ...fileData];
      return merged.filter(
        (item, index, self) =>
          index === self.findIndex((entry) => entry.dataUrl === item.dataUrl)
      );
    });

    e.target.value = "";
  };

  const clearUploadedImages = () => {
    setUploadedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeUploadedImage = (dataUrl) => {
    setUploadedImages((prev) => prev.filter((item) => item.dataUrl !== dataUrl));
  };

  const addImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      toast.error("Please enter an image URL");
      return;
    }

    const isValidUrl = /^(https?:\/\/|data:image\/)/i.test(trimmed);
    if (!isValidUrl) {
      toast.error("Please enter a valid image URL");
      return;
    }

    setImageUrls((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
    setImageUrlInput("");
  };

  const removeImageUrl = (urlToRemove) => {
    setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const clearImageUrls = () => {
    setImageUrls([]);
    setImageUrlInput("");
  };

  const showImagePreview = activeImageUrls.length > 0;

  return (
    <Layout title={"Admin - Add New Product"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start">
          <div>
            <AdminMenu />
          </div>

          <div className="min-w-0">
            <div className="p-1 sm:p-2 space-y-5">
              <div className="rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-accent-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white text-accent-700 flex items-center justify-center border border-accent-200 shadow-sm">
                    <FiBox className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-primary-900">
                      Add New Product
                    </h1>
                    <p className="text-sm text-primary-600">
                      Create a polished product listing with complete details.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleCreate}
                className="rounded-2xl border border-primary-200 bg-white p-4 sm:p-5 shadow-sm space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary-500 inline-flex items-center gap-1.5">
                      <FiTag className="h-3.5 w-3.5" />
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 rounded-lg border border-primary-200 bg-white px-3 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-300"
                    >
                      <option value="">Select category</option>
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary-500 inline-flex items-center gap-1.5">
                      <FiTruck className="h-3.5 w-3.5" />
                      Shipping Available
                    </label>
                    <select
                      value={shipping}
                      onChange={(e) => setShipping(e.target.value)}
                      className="w-full h-10 rounded-lg border border-primary-200 bg-white px-3 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-300"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary-500">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter product name"
                    className="w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary-500 inline-flex items-center gap-1.5">
                    <FiFileText className="h-3.5 w-3.5" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    placeholder="Enter product description"
                    className="w-full min-h-[110px] rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary-500 inline-flex items-center gap-1.5">
                      <span className="text-sm leading-none">₹</span>
                      Price (INR)
                    </label>
                    <input
                      type="number"
                      value={price}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary-500 inline-flex items-center gap-1.5">
                      <FiHash className="h-3.5 w-3.5" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      placeholder="0"
                      className="w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-primary-200 bg-primary-50/60 p-3">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wide text-primary-500 inline-flex items-center gap-1.5">
                      <FiImage className="h-3.5 w-3.5" />
                      Product Image
                    </label>
                    <div className="inline-flex rounded-lg border border-primary-200 bg-white p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode("url");
                        }}
                        className={`h-8 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 ${
                          imageInputMode === "url"
                            ? "bg-accent-100 text-accent-700"
                            : "text-primary-600 hover:bg-primary-50"
                        }`}
                      >
                        <FiLink className="h-3.5 w-3.5" />
                        Image URL
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode("upload");
                        }}
                        className={`h-8 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 ${
                          imageInputMode === "upload"
                            ? "bg-accent-100 text-accent-700"
                            : "text-primary-600 hover:bg-primary-50"
                        }`}
                      >
                        <FiUpload className="h-3.5 w-3.5" />
                        Upload
                      </button>
                    </div>
                  </div>

                  {imageInputMode === "url" ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageUrlInput}
                          placeholder="Paste image URL and click Add"
                          className="flex-1 h-10 rounded-lg border border-primary-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addImageUrl();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addImageUrl}
                          className="h-10 px-3 rounded-md border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 text-xs font-semibold"
                        >
                          Add URL
                        </button>
                      </div>

                      {imageUrls.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {imageUrls.map((url) => (
                            <span
                              key={url}
                              className="inline-flex items-center gap-1 rounded-md border border-primary-200 bg-white px-2 py-1 text-xs text-primary-700"
                            >
                              <span className="max-w-[220px] truncate">{url}</span>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-700 font-bold"
                                onClick={() => removeImageUrl(url)}
                                aria-label={`Remove ${url}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-primary-500">
                        Added URLs: {imageUrls.length}
                      </p>
                      <input
                        type="text"
                        value={imageUrlInput}
                        readOnly
                        className="hidden"
                      />
                      {imageUrls.length > 0 && (
                        <button
                          type="button"
                          onClick={clearImageUrls}
                          className="h-7 px-2.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
                        >
                          Remove All URLs
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="w-full min-h-[40px] rounded-lg border border-primary-200 bg-white px-3 py-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-7 px-3 rounded-md border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <FiUpload className="h-3.5 w-3.5" />
                          Choose Files
                        </button>
                        <span className="text-sm text-primary-600">
                          {uploadedImages.length
                            ? `${uploadedImages.length} file${
                                uploadedImages.length > 1 ? "s" : ""
                              } selected`
                            : "No file chosen"}
                        </span>
                        {uploadedImages.length > 0 && (
                          <button
                            type="button"
                            onClick={clearUploadedImages}
                            className="ml-auto h-7 px-2.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
                          >
                            Remove All
                          </button>
                        )}
                      </div>
                      {uploadedImages.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {uploadedImages.map((file) => (
                            <span
                              key={file.dataUrl}
                              className="inline-flex items-center gap-1 rounded-md border border-primary-200 bg-white px-2 py-1 text-xs text-primary-700"
                            >
                              <span className="max-w-[180px] truncate">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-700 font-bold"
                                onClick={() => removeUploadedImage(file.dataUrl)}
                                aria-label={`Remove ${file.name}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-primary-500">
                        Supported: JPG, PNG, WEBP. Max size: 2MB.
                      </p>
                    </div>
                  )}
                </div>

                {showImagePreview && (
                  <div className="rounded-lg border border-primary-200 p-2 bg-primary-50">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-500 mb-2">
                      Image Preview ({activeImageUrls.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {activeImageUrls.map((url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="rounded-md border border-primary-200 overflow-hidden bg-white"
                        >
                          <img
                            src={url}
                            alt={`product preview ${index + 1}`}
                            className="h-[120px] w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-1">
                  <input
                    type="submit"
                    value="Add Product"
                    className="h-10 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
