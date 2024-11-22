import Message, { IMessage } from "@/models/message.model";

class MessageService {
  async createMessage(data: Partial<IMessage>): Promise<IMessage> {
    return await Message.create(data);
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
