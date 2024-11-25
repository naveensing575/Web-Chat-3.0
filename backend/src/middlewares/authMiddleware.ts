import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

export default authMiddleware;
