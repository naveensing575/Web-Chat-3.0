import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Attach the user object to the request
    (req as any).user = user;

    next();
  } catch (error: any) {
    console.error("Error in authMiddleware: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default authMiddleware;
