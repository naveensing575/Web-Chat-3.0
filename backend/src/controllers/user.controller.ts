import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";

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
}

export default new UserController();
