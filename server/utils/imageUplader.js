const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.uploadImageToCloudinary = async (file, folder, height, width) => {
  const options = {
    folder:folder,
    resource_type: "auto",
  };

  if (height) options.height = height;
  if (width) options.width = width;

  try {
    const response = await cloudinary.uploader.upload(file.tempFilePath, options);
    return response;
  } finally {
    fs.unlink(file.tempFilePath, (err) => {
      if (err) {
        console.error("Error deleting temp file:", err);
      } else {
        console.log("Temp file deleted successfully.");
      }
    });
  }
};