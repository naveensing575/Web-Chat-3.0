import User from "../models/user.model";
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
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return token;
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
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return token;
  }

  async signOut(): Promise<string> {
    return "Successfully signed out"; // For stateful systems, manage token invalidation
  }
}

export default new AuthService();
