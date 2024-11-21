import { Router } from "express";
import MessageController from "../controllers/message.controller";

const router = Router();

// Routes
router.post("/", MessageController.createMessage);
router.get("/user/:userId", MessageController.getMessagesByUser);
router.get("/:senderId/:receiverId", MessageController.getConversation);

export default router;
