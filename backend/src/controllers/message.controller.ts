import { Request, Response, NextFunction } from "express";
import MessageService from "@/services/message.service";

class MessageController {
  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { receiverId, text } = req.body;

      // Extract senderId from the authenticated user (middleware adds `user` to req)
      const senderId = (req as any).user.id;

      // Validate required fields
      if (!senderId || !receiverId || (!text && !req.file)) {
        res.status(400).json({
          success: false,
          message: "receiverId and at least one of text or image are required.",
        });
        return;
      }

      // Call the service to send the message
      const message = await MessageService.sendMessage(
        senderId,
        receiverId,
        text,
        req.file?.path
      );

      res.status(201).json({ success: true, data: message });
    } catch (error) {
      /*************  ✨ Codeium Command ⭐  *************/
      /**
       * Retrieves all messages sent or received by a specific user.
       *
       * @param req - The request object containing the user ID in the URL parameters.
       * @param res - The response object used to send the retrieved messages.
       * @param next - The next middleware function in the stack.
       *
       * @returns A promise that resolves to a JSON response with a success status and the user's messages.
       *          Calls the next middleware with an error if an exception occurs.
       */
      /******  03fc2315-f7c7-4c20-a69a-dd35f978d865  *******/ next(error);
    }
  }

  async getMessagesByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract userId from the authenticated user (middleware adds `user` to req)
      const userId = (req as any).user.id;

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
      const { receiverId } = req.params;

      // Extract senderId from the authenticated user (middleware adds `user` to req)
      const senderId = (req as any).user.id;

      if (!receiverId) {
        res.status(400).json({
          success: false,
          message: "receiverId is required.",
        });
        return;
      }

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
