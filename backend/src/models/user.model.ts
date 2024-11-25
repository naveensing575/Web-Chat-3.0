import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
