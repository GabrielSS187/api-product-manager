import mongoose, { Schema } from "mongoose";
import { TCreateUserDto } from "../dtos/user-dtos";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "normal"],
      default: "normal",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<TCreateUserDto>("User", UserSchema);