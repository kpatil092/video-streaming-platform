import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = "") => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });
    console.log(folder);

    // console.log("file is uploaded on cloudinary!", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // remove locally save temporary file as upload got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, type) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: type });
    console.log("Previous file deleted successfully.");
  } catch (error) {
    throw new ApiError(401, "Fail to delete file from storage");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
