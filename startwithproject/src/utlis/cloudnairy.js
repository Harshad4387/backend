const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

// ✅ Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File uploaded successfully");
        return response.url;

    } catch (error) {
        fs.unlinkSync(localFilePath); // Delete file if upload fails
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

module.exports = { uploadOnCloudinary };
