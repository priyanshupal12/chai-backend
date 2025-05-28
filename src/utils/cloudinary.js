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
        if (!localFilePath) return "File path is required for upload.";

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect the resource type (image, video, etc.)
        });
        console.log("File uploaded successfully:", response.url);
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath); // Delete the file if upload fails
        return null
    }
}

export { uploadOnCloudinary };