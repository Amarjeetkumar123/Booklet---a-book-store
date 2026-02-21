import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "../../config/axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit3, FiImage, FiTrash2, FiSave } from "react-icons/fi";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [id, setId] = useState("");

  //get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
      setImageUrl(data.product.imageUrl || "");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);
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
  const handleUpdate = async (e) => {
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
      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  //delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are You Sure want to delete this product ? ");
      if (!answer) return;
      await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Product DEleted Succfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Admin - Update Product"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start">
          <div>
            <AdminMenu />
          </div>

          <div className="min-w-0">
            <div className="p-1 sm:p-2">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center border border-primary-200">
                  <FiEdit3 className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary-900">
                    Update Product
                  </h1>
                  <p className="text-sm text-primary-600">
                    Edit product details or remove this product.
                  </p>
                </div>
              </div>

              <div className="max-w-3xl space-y-3">
                <Select
                  bordered={false}
                  placeholder="Select a category"
                  size="middle"
                  showSearch
                  className="w-full"
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  value={category}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>

                <div>
                  <label className="mb-1.5 text-sm font-medium text-primary-700 inline-flex items-center gap-1.5">
                    <FiImage className="h-4 w-4" />
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    placeholder="Paste image URL"
                    className="w-full h-10 rounded-lg border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                {imageUrl && (
                  <div className="rounded-lg border border-primary-200 p-2 bg-primary-50 max-w-[220px]">
                    <img
                      src={imageUrl}
                      alt="product"
                      className="h-[180px] w-full object-cover rounded-md"
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
                  value={
                    String(shipping) === "1" || shipping === true ? "1" : "0"
                  }
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    className="h-10 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold inline-flex items-center gap-2"
                    onClick={handleUpdate}
                  >
                    <FiSave className="h-4 w-4" />
                    Update Product
                  </button>
                  <button
                    className="h-10 px-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold inline-flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
