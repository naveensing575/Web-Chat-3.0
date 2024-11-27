import User from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "@/config/cloudinaryConfig";

class AuthService {
  async signUp(
    email: string,
    fullName: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    const token = this.generateToken(newUser._id.toString());

    return {
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: null,
        createdAt: newUser.createdAt,
      },
      token,
    };
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user._id.toString());

    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic ?? null,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async checkAuth(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic ?? null,
      createdAt: user.createdAt,
    };
  }

  async updateProfilePic(
    userId: string,
    file: Express.Multer.File
  ): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "profile_pics",
      resource_type: "image",
    });

    // Update user's profilePic with the new URL
    user.profilePic = uploadResult.secure_url;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    };
  }

  async signOut(): Promise<string> {
    return "Sign-out successful";
  }

  private generateToken(id: string): string {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  }
}

export default new AuthService();
