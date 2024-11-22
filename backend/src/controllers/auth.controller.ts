import { Request, Response } from "express";
import AuthService from "@/services/auth.service";

class AuthController {
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      // Generate token and set it in a cookie
      const token = await AuthService.signIn(email, password);
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({ success: true, message: "Sign-in successful" });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Authentication failed",
      });
    }
  }

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

      // Generate token and set it in a cookie
      const token = await AuthService.signUp(email, fullName, password);
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(201).json({ success: true, message: "Sign-up successful" });
    } catch (error: any) {
      res
        .status(400)
        .json({ success: false, message: error.message || "Sign-up failed" });
    }
  }

  async signOut(req: Request, res: Response): Promise<void> {
    try {
      // Clear the accessToken cookie with the same properties
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message || "Sign-out failed" });
    }
  }

  async checkAuth(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ success: true, message: "Authenticated" });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Authentication failed",
      });
    }
  }
}

export default new AuthController();
