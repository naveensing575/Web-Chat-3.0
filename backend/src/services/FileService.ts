import fs from "fs";
import cloudinary from "@/config/cloudinaryConfig";

class FileService {
  static async uploadToCloudinary(
    filePath: string,
    folderName: string
  ): Promise<string> {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folderName,
      });

      // Delete the local file after successful upload
      FileService.deleteFile(filePath);

      return result.secure_url;
    } catch (error) {
      // Ensure file is deleted even if Cloudinary upload fails
      FileService.deleteFile(filePath);
      throw error;
    }
  }

  static deleteFile(filePath: string): void {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      } else {
        console.log(`Temporary file deleted: ${filePath}`);
      }
    });
  }
}

export default FileService;
