import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;
    } catch (error) {
        console.log("Cloudinary Error:", error);

        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

const extractPublicIdFromUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    const uploadMarker = "/upload/";
    const idx = url.indexOf(uploadMarker);
    if (idx === -1) return null;

    let pathAfterUpload = url.slice(idx + uploadMarker.length);
    // Strip optional version segment like v1234567890/
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");
    // Strip file extension
    const lastDot = pathAfterUpload.lastIndexOf(".");
    return lastDot !== -1 ? pathAfterUpload.slice(0, lastDot) : pathAfterUpload;
};

const deleteFromCloudinary = async (fileUrl, resourceType = "image") => {
    try {
        const publicId = extractPublicIdFromUrl(fileUrl);
        if (!publicId) return null;
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
    } catch (error) {
        console.log("Cloudinary Delete Error:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
