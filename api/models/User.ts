import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  username: string;
  email: string;
  country: string;
  img: string;
  city: string;
  phone: string;
  password: string;
  isAdmin: boolean;
}

interface DocumentResult<T> {
  _doc: T;
}

export interface IUserModel extends IUser, Document, DocumentResult<IUser> {
  matchPassword: (enteredPassword: string) => boolean;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    img: { type: String },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUserModel>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUserModel>("User", UserSchema);
