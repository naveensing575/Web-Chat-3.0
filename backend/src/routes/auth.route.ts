import { Router } from "express";
import AuthController from "@/controllers/auth.controller";
import authMiddleware from "@/middlewares/authMiddleware";

const router = Router();

// Authentication Routes
router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signIn);
router.post("/signout", AuthController.signOut);
router.get("/checkAuth", authMiddleware, AuthController.checkAuth);

export default router;
