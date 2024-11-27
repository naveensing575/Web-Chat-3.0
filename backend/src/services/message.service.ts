import Message, { IMessage } from "@/models/message.model";
import FileService from "@/services/FileService";

class MessageService {
  async sendMessage(
    senderId: string,
    receiverId: string,
    text: string,
    filePath?: string
  ): Promise<IMessage> {
    // Upload the image to Cloudinary if a file is provided
    let imageUrl = "";
    if (filePath) {
      imageUrl = await FileService.uploadToCloudinary(filePath, "messages");
    }

    // Create the message
    const messageData = {
      senderId,
      receiverId,
      text,
      image: imageUrl || null,
    };

    return await Message.create(messageData);
  }

  async getMessagesByUser(userId: string): Promise<IMessage[]> {
    return await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });
  }

  async getConversation(
    senderId: string,
    receiverId: string
  ): Promise<IMessage[]> {
    return await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: -1 });
  }
}

export default new MessageService();
