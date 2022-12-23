import { Request, Response, NextFunction } from "express";
import Hotel from "../models/Hotel";

export const createHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newHotel = new Hotel(req.body);
    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    res.status(200).json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id });
    res.status(200).json([hotel]);
  } catch (error) {
    next(error);
  }
};

export const getAllHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const limit: number = req.query.limit! as unknown as number;
  const { limit, min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapest: { $gt: min || 1, $lt: max || 999 },
    }).limit(limit as unknown as number);
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const countByCities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cities = (req.query.cities as string).split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => Hotel.countDocuments({ city }))
    );
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const countByTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ]);
  } catch (error) {
    next(error);
  }
};
