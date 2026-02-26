import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import serviceAreaModel from "../models/serviceAreaModel.js";

import slugify from "slugify";
import {
  getLocationFilter,
  isLocationSupportedByProduct,
  normalizeLocationKey,
  sanitizeServiceLocations,
} from "../utils/locationUtils.js";
import {
  deleteImage,
  getCloudinaryPublicIdFromUrl,
} from "../utils/cloudinaryUtils.js";
import { deleteReviewsByProductId } from "../services/reviewService.js";

const normalizeImageUrls = (imageUrls, imageUrl) => {
  const parsedImageUrls = Array.isArray(imageUrls)
    ? imageUrls
        .map((url) => (typeof url === "string" ? url.trim() : ""))
        .filter(Boolean)
    : typeof imageUrls === "string"
      ? imageUrls
          .split(/\n|,/)
          .map((url) => url.trim())
          .filter(Boolean)
      : [];

  const singleImageUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";

  if (singleImageUrl) {
    return Array.from(new Set([singleImageUrl, ...parsedImageUrls]));
  }

  return Array.from(new Set(parsedImageUrls));
};

const getRequestedLocation = (req) =>
  normalizeLocationKey(req?.query?.location || req?.body?.location || "");

const getActiveServiceAreaKeySet = async () => {
  const serviceAreas = await serviceAreaModel
    .find({ isActive: true })
    .select("key");
  return new Set(serviceAreas.map((area) => normalizeLocationKey(area.key)));
};

const collectProductImageUrls = (product) => {
  const urls = [
    ...(Array.isArray(product?.imageUrls) ? product.imageUrls : []),
    product?.imageUrl,
  ];

  return Array.from(
    new Set(
      urls
        .map((url) => (typeof url === "string" ? url.trim() : ""))
        .filter(Boolean)
    )
  );
};

const deleteCloudinaryImagesSafely = async (imageUrls = []) => {
  const failedImageDeletions = [];

  for (const imageUrl of imageUrls) {
    const publicId = getCloudinaryPublicIdFromUrl(imageUrl);
    if (!publicId) continue;

    try {
      await deleteImage(publicId);
    } catch (error) {
      failedImageDeletions.push(imageUrl);
      console.log(
        `Cloudinary delete failed for URL: ${imageUrl}`,
        error?.message || error
      );
    }
  }

  return failedImageDeletions;
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, imageUrl, imageUrls, serviceLocations } = req.body;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
    }

    const normalizedImageUrls = normalizeImageUrls(imageUrls, imageUrl);
    const activeServiceAreaKeys = await getActiveServiceAreaKeySet();
    const requestedServiceLocations =
      typeof serviceLocations === "undefined" ? ["all"] : serviceLocations;
    const normalizedServiceLocations = sanitizeServiceLocations(
      requestedServiceLocations,
      activeServiceAreaKeys,
      { fallbackToAll: false }
    );
    if (!normalizedServiceLocations.length) {
      return res.status(400).send({
        success: false,
        message: "Please select valid service locations",
      });
    }

    const products = new productModel({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      imageUrl: normalizedImageUrls[0] || "",
      imageUrls: normalizedImageUrls,
      serviceLocations: normalizedServiceLocations,
      slug: slugify(name),
    });
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const selectedLocation = getRequestedLocation(req);
    const locationFilter = getLocationFilter(selectedLocation);
    const products = await productModel
      .find(locationFilter)
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      selectedLocation: selectedLocation || "all",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const selectedLocation = getRequestedLocation(req);
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    const isDeliverable = isLocationSupportedByProduct(
      product?.serviceLocations || [],
      selectedLocation
    );

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      selectedLocation: selectedLocation || "all",
      isDeliverable,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    const existingProduct = await productModel
      .findById(req.params.pid)
      .select("imageUrl imageUrls");

    if (!existingProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    const imageUrls = collectProductImageUrls(existingProduct);
    await productModel.findByIdAndDelete(req.params.pid);
    await deleteReviewsByProductId(req.params.pid);
    const failedImageDeletions = await deleteCloudinaryImagesSafely(imageUrls);

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      failedImageDeletions: failedImageDeletions.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      imageUrl,
      imageUrls,
      serviceLocations,
    } = req.body;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
    }

    const normalizedImageUrls = normalizeImageUrls(imageUrls, imageUrl);
    const activeServiceAreaKeys = await getActiveServiceAreaKeySet();
    const requestedServiceLocations =
      typeof serviceLocations === "undefined" ? ["all"] : serviceLocations;
    const normalizedServiceLocations = sanitizeServiceLocations(
      requestedServiceLocations,
      activeServiceAreaKeys,
      { fallbackToAll: false }
    );
    if (!normalizedServiceLocations.length) {
      return res.status(400).send({
        success: false,
        message: "Please select valid service locations",
      });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        imageUrl: normalizedImageUrls[0] || "",
        imageUrls: normalizedImageUrls,
        serviceLocations: normalizedServiceLocations,
        slug: slugify(name),
      },
      { new: true }
    );
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;
    const selectedLocation = getRequestedLocation(req);
    let args = { ...getLocationFilter(selectedLocation) };
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      selectedLocation: selectedLocation || "all",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const selectedLocation = getRequestedLocation(req);
    const total = await productModel.countDocuments(
      getLocationFilter(selectedLocation)
    );
    res.status(200).send({
      success: true,
      selectedLocation: selectedLocation || "all",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const selectedLocation = getRequestedLocation(req);
    const products = await productModel
      .find(getLocationFilter(selectedLocation))
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      selectedLocation: selectedLocation || "all",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const selectedLocation = getRequestedLocation(req);
    const locationFilter = getLocationFilter(selectedLocation);
    const searchFilter = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const query = Object.keys(locationFilter).length
      ? { $and: [searchFilter, locationFilter] }
      : searchFilter;

    const resutls = await productModel.find(query);
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const selectedLocation = getRequestedLocation(req);
    const locationFilter = getLocationFilter(selectedLocation);
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
        ...locationFilter,
      })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const selectedLocation = getRequestedLocation(req);
    const products = await productModel
      .find({
        category,
        ...getLocationFilter(selectedLocation),
      })
      .populate("category");
    res.status(200).send({
      success: true,
      category,
      selectedLocation: selectedLocation || "all",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
