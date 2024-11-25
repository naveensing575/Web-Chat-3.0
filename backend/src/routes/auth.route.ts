import { Router } from "express";
import AuthController from "@/controllers/auth.controller";
import authMiddleware from "@/middlewares/authMiddleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

// Authentication Routes
router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signIn);
router.post("/signout", AuthController.signOut);
router.get("/checkAuth", AuthController.checkAuth);
router.put(
  "/updateProfilePic",
  authMiddleware,
  upload.single("profilePic"),
  AuthController.updateProfilePic
);

export default router;
