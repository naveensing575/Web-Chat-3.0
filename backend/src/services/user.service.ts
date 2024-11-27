import cloudinary from "@/config/cloudinaryConfig";
import User, { IUser } from "@/models/user.model";

class UserService {
  async createUser(userData: Omit<IUser, "id">): Promise<IUser> {
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
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "profile_pics",
    });

    return await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  // Updated: Get all users except the logged-in user
  async getUserForSidebar(userId: string): Promise<IUser[]> {
    const filteredUsers = await User.find({ id: { $ne: userId } }).select(
      "-password"
    );
    return filteredUsers;
  }
}

export default new UserService();
