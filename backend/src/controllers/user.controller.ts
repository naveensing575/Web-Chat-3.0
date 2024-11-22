import { Request, Response, NextFunction } from "express";
import UserService from "@/services/user.service";
import FileService from "@/services/FileService";

class UserController {
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
      }

      const uploadedImageUrl = await FileService.uploadToCloudinary(
        file.path,
        "profile_pics"
      );

      const updatedUser = await UserService.updateProfilePic(
        req.params.id,
        uploadedImageUrl
      );

      if (!updatedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.deleteUser(req.params.id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Updated: Get all users except the logged-in user
  async getUserForSidebar(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getUserForSidebar(req.params.id);
      if (!users || users.length === 0) {
        res
          .status(404)
          .json({ success: false, message: "No other users found" });
        return;
      }
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export default new UserController();
