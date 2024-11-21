import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "@/models/user.model";

class AuthController {
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user and verify password
      const user = await userModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      // Generate password expiration timestamp
      const passwordExpiry = new Date();
      passwordExpiry.setDate(passwordExpiry.getDate() + 1); // 1 day

      // Set the cookie with password expiration timestamp
      res.cookie("passwordExpiry", passwordExpiry.toISOString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
        sameSite: "strict",
      });

      res.status(200).json({ success: true, token });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
