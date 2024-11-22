import User from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  async signUp(
    email: string,
    fullName: string,
    password: string
  ): Promise<string> {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    // Generate JWT token
    return this.generateToken(newUser._id.toString(), newUser.email);
  }

  async signIn(email: string, password: string): Promise<string> {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    return this.generateToken(user._id.toString(), user.email);
  }

  async updateUser(
    userId: string,
    updateData: { fullName?: string; email?: string; password?: string }
  ): Promise<{ token: string } | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Handle password hashing if password is updated
    if (updateData.password) {
      if (updateData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    // Update user data
    Object.assign(user, updateData);
    await user.save();

    // Generate a new JWT token if email is updated
    const token = this.generateToken(user._id.toString(), user.email);
    return { token };
  }

  async signOut(): Promise<string> {
    return "Successfully signed out";
  }

  async checkAuth(): Promise<string> {
    return "Authorized";
  }

  private generateToken(id: string, email: string): string {
    return jwt.sign({ id, email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  }
}

export default new AuthService();
