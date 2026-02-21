import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "../../config/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiBox } from "react-icons/fi";
const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Someething Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <Layout title={"Admin - Products"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 lg:gap-6 items-start">
          <div>
            <AdminMenu />
          </div>

          <div className="min-w-0">
            <div className="p-1 sm:p-2">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center border border-primary-200">
                  <FiBox className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary-900">
                    All Products
                  </h1>
                  <p className="text-sm text-primary-600">
                    Select any product card to edit details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products?.map((p) => (
                  <Link
                    key={p._id}
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="no-underline"
                  >
                    <div className="h-full bg-white rounded-xl border border-primary-200 hover:border-accent-300 hover:shadow-md transition-all overflow-hidden">
                      <img
                        src={
                          p.imageUrl || "https://placehold.co/300x400?text=No+Image"
                        }
                        className="h-44 w-full object-cover"
                        alt={p.name}
                      />
                      <div className="p-3.5">
                        <h5 className="text-base font-semibold text-primary-900 mb-1">
                          {p.name}
                        </h5>
                        <p className="text-sm text-primary-600 line-clamp-2">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {products?.length === 0 && (
                <div className="text-center py-10 text-primary-600 text-sm">
                  No products found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
