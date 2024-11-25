import { Request, Response } from "express";
import AuthService from "@/services/auth.service";
import { AuthenticatedRequest } from "@/types/express";

class AuthController {
  // User Signup
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { email, fullName, password } = req.body;

      if (!email || !fullName || !password) {
        res.status(400).json({
          success: false,
          message: "Email, full name, and password are required",
        });
        return;
      }

      const { user, token } = await AuthService.signUp(
        email,
        fullName,
        password
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.cookie("userInfo", JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: "Sign-up successful",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Sign-up failed",
      });
    }
  }

  // User Sign-in
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      const { user, token } = await AuthService.signIn(email, password);

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie("userInfo", JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Sign-in successful",
        data: user,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Authentication failed",
      });
    }
  }

  // User Sign-out
  async signOut(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.clearCookie("userInfo", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        message: "Sign-out successful",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Sign-out failed",
      });
    }
  }

  // Check Auth Status
  async checkAuth(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const user = await AuthService.checkAuth(token);

      res.status(200).json({
        success: true,
        message: "Authenticated",
        data: user,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Unauthorized",
      });
    }
  }

  // Update Profile Picture
  async updateProfilePic(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const userId = req.user.id;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Profile picture file is required",
        });
        return;
      }

      const updatedUser = await AuthService.updateProfilePic(userId, req.file);

      res.cookie("userInfo", JSON.stringify(updatedUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update profile picture",
      });
    }
  }
}

export default new AuthController();
