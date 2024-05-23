const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const config = require("../config/config");
// Configure Cloudinary with API credentials
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: config.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: config.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if localFilePath is provided
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detect the resource type
    });

    // File has been uploaded successfully
    console.log("file is uploaded on cloudinary ", response.url);

    // Delete the locally saved temporary file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Remove the locally saved temporary file if the upload operation failed
    console.log(error);
    
    fs.unlinkSync(localFilePath);

    // Return null if upload failed
    return null;
  }
};

module.exports = uploadOnCloudinary;
