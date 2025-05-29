import { v2 as cloudinary } from "cloudinary";
import fs from "fs";






// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Replace with your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// Upload a file
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log("Uploading file to Cloudinary:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Uncomment this line if you want to delete the local file after upload
        }

        if (!response || !response.url) {
            throw new Error("Cloudinary upload did not return a valid URL.");
        }

        console.log("File uploaded successfully:", response.url);
        return response;

    }
    catch (error) {
        console.error("❌ Cloudinary upload error:", error.message || error);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

export { uploadOnCloudinary };