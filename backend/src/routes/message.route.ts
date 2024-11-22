import { Router } from "express";
import multer from "multer";
import MessageController from "@/controllers/message.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("image"), MessageController.sendMessage);
router.get("/user/:userId", MessageController.getMessagesByUser);
router.get("/:senderId/:receiverId", MessageController.getConversation);

export default router;
