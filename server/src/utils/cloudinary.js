import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// We use NAMED export here
export const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto", 
            folder: "ak computers" 
        });

        console.log("Upload Success URL:", result.secure_url);
        return result; 
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        throw error; 
    }
};

// REMOVED: export default upload; (This was causing the error!)