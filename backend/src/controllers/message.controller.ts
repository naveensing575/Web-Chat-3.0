import { Request, Response, NextFunction } from "express";
import MessageService from "@/services/message.service";

class MessageController {
  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderId, receiverId, text } = req.body;

      // Validate required fields
      if (!senderId || !receiverId || (!text && !req.file)) {
        res.status(400).json({
          success: false,
          message:
            "senderId, receiverId, and at least one of text or image are required.",
        });
        return;
      }

      // Call the service to send the message
      const message = await MessageService.sendMessage(
        { senderId, receiverId, text },
        req.file?.path
      );

      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async getMessagesByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const messages = await MessageService.getMessagesByUser(userId);
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }

  async getConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { senderId, receiverId } = req.params;
      const conversation = await MessageService.getConversation(
        senderId,
        receiverId
      );
      res.status(200).json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
