const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const config = require("../config/config");
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });
    // file has been uploaded successfully
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
module.exports = { uploadOnCloudinary, deleteOnCloudinary };
