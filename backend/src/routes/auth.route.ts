import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

// Routes
router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signIn);
router.post("/signout", AuthController.signOut);

export default router;
