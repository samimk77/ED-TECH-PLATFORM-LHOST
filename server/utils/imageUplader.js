const cloudinary=require("cloudinary").v2

exports.uploadImageToCloudinary = async (file, folder, height, width) => {
  const options = {
    folder: folder, // ✅ correct
    resource_type: "auto",
  };

  if (height) options.height = height;
  if (width) options.width = width;

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};