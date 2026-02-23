// utils/cloudinary.js

import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import cloudinaryPkg from "cloudinary";
const cloudinary = cloudinaryPkg.v2;
import multer from "multer";
import streamifier from "streamifier";

// ==============================
// 1️⃣ Cloudinary Configuration
// ==============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Default folder from env
const DEFAULT_FOLDER = process.env.CLOUDINARY_FOLDER || "books";

// ==============================
// 2️⃣ Multer Configuration
// ==============================
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter,
});

// ==============================
// 3️⃣ Upload Buffer to Cloudinary
// ==============================
const uploadToCloudinary = (fileBuffer, folder = DEFAULT_FOLDER) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ==============================
// 4️⃣ Single Image Upload
// ==============================
const uploadSingleImage = async (file, folder = DEFAULT_FOLDER) => {
  if (!file) throw new Error("No file provided");

  const result = await uploadToCloudinary(file.buffer, folder);

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

// ==============================
// 5️⃣ Multiple Image Upload
// ==============================
const uploadMultipleImages = async (files, folder = DEFAULT_FOLDER) => {
  if (!files || files.length === 0)
    throw new Error("No files provided");

  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder)
  );

  const results = await Promise.all(uploadPromises);

  return results.map((result) => ({
    url: result.secure_url,
    public_id: result.public_id,
  }));
};

// ==============================
// 6️⃣ Delete Image
// ==============================
const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

// ==============================
// Export Everything
// ==============================
export { upload, uploadSingleImage, uploadMultipleImages, deleteImage };