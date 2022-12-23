import express, { NextFunction, Request, Response } from "express";
import {
  countByCities,
  countByTypes,
  createHotel,
  deleteHotel,
  getAllHotel,
  getHotel,
  getHotelRooms,
  updateHotel,
} from "../controllers/hotelController";
import { verifyAdmin } from "../utils/verifyToken";

const router = express.Router();

//Create
router.post("/", verifyAdmin, createHotel);

//Update
router.put("/find/:id", verifyAdmin, updateHotel);

//Delete
router.delete("/find/:id", verifyAdmin, deleteHotel);

//Get single hotel
router.get("/find/:id", getHotel);

//Get all
router.get("/", getAllHotel);

router.get("/countByCity", countByCities);
router.get("/countByType", countByTypes);
router.get("/room/:id", getHotelRooms);
export default router;
