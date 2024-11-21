import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
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
