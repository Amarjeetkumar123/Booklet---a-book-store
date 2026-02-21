import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "../../config/axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { FiBox, FiImage, FiLink, FiPlusCircle, FiUpload } from "react-icons/fi";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageInputMode, setImageInputMode] = useState("url");

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
    try {
      const productData = {
        name,
        description,
        price,
        quantity,
        imageUrl,
        category,
        shipping,
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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be 2MB or less");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout title={"Admin - Add New Product"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start">
          <div>
            <AdminMenu />
          </div>

          <div className="min-w-0">
            <div className="p-1 sm:p-2">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent-100 text-accent-700 flex items-center justify-center border border-accent-200">
                  <FiBox className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary-900">
                    Add New Product
                  </h1>
                  <p className="text-sm text-primary-600">
                    Create a product listing with full details and image.
                  </p>
                </div>
              </div>

              <div className="w-full space-y-4">
                <Select
                  bordered={false}
                  placeholder="Select a category"
                  size="middle"
                  showSearch
                  className="w-full"
                  onChange={(value) => {
                    setCategory(value);
                  }}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>

                <div className="rounded-lg border border-primary-200 bg-primary-50/60 p-3">
                  <label className="mb-2 text-sm font-medium text-primary-700 inline-flex items-center gap-1.5">
                    <FiImage className="h-4 w-4" />
                    Product Image
                  </label>
                  <div className="mb-3 inline-flex rounded-lg border border-primary-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setImageInputMode("url")}
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
                      onClick={() => setImageInputMode("upload")}
                      className={`h-8 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 ${
                        imageInputMode === "upload"
                          ? "bg-accent-100 text-accent-700"
                          : "text-primary-600 hover:bg-primary-50"
                      }`}
                    >
                      <FiUpload className="h-3.5 w-3.5" />
                      Upload Image
                    </button>
                  </div>

                  {imageInputMode === "url" ? (
                    <input
                      type="text"
                      value={imageUrl}
                      placeholder="Paste image URL"
                      className="w-full h-10 rounded-lg border border-primary-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full h-10 rounded-lg border border-primary-200 bg-white px-3 text-sm text-primary-700 file:mr-3 file:h-8 file:border-0 file:rounded-md file:bg-accent-100 file:px-3 file:text-accent-700 file:text-xs file:font-semibold"
                      onChange={handleImageUpload}
                    />
                  )}
                </div>

                {imageUrl && (
                  <div className="rounded-lg border border-primary-200 p-2 bg-primary-50 w-full max-w-[320px]">
                    <img
                      src={imageUrl}
                      alt="product"
                      className="h-[200px] w-full object-cover rounded-md"
                    />
                  </div>
                )}

                <input
                  type="text"
                  value={name}
                  placeholder="Product name"
                  className="w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                  onChange={(e) => setName(e.target.value)}
                />

                <textarea
                  type="text"
                  value={description}
                  placeholder="Product description"
                  className="w-full min-h-[100px] rounded-lg border border-primary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={price}
                    placeholder="Price"
                    className="w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    value={quantity}
                    placeholder="Quantity"
                    className="w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="middle"
                  showSearch
                  className="w-full"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>

                <button
                  className="h-10 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={handleCreate}
                >
                  <FiPlusCircle className="h-4 w-4" />
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
