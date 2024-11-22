import { Router } from "express";
import multer from "multer";
import UserController from "@/controllers/user.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", UserController.createUser);
router.get("/sidebar/:id", UserController.getUserForSidebar);
router.get("/:id", UserController.getUserById);
router.get("/", UserController.getAllUsers);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

// Route for updating profile picture
router.put(
  "/:id/profile-pic",
  upload.single("profilePic"),
  UserController.updateProfilePic
);

export default router;
