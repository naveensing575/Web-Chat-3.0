import { Request, Response, NextFunction } from "express";
import MessageService from "../services/message.service";

class MessageController {
  async createMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const message = await MessageService.createMessage(req.body);
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
