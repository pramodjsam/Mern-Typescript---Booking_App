import { Request, Response, NextFunction } from "express";
import Hotel from "../models/Hotel";
import Room from "../models/Room";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    await Hotel.findByIdAndUpdate(
      hotelId,
      { $push: { rooms: savedRoom._id } },
      { new: true }
    );
    res.status(200).json(savedRoom);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const updateRoomAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRoom = await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: { "roomNumbers.$.unavailableDates": req.body.dates },
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: req.params.id } });
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const getAllRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};
