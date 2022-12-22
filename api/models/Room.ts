import mongoose, { Document, Schema } from "mongoose";

interface IRoom {
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumber: [{ number: number; unavailableDates: [Date] }];
}

interface DocumentResult<T> {
  _doc: T;
}

export interface IRoomModel extends IRoom, Document, DocumentResult<IRoom> {
  matchPassword: (enteredPassword: string) => boolean;
}

const RoomSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    roomNumbers: {
      type: [{ number: { type: Number }, unavailableDates: { type: [Date] } }],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRoomModel>("Room", RoomSchema);
