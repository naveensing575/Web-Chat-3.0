import cloudinary from "@/config/cloudinaryConfig";
import User, { IUser } from "@/models/user.model";

class UserService {
  async createUser(userData: Omit<IUser, "_id">): Promise<IUser> {
    return await User.create(userData);
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  async updateUser(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async updateProfilePic(
    userId: string,
    filePath: string
  ): Promise<IUser | null> {
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "profile_pics",
    });

    // Update user's profile picture
    return await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }
}

export default new UserService();