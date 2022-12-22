import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRoom,
  getRoom,
  updateRoom,
} from "../controllers/roomController";
import { verifyAdmin } from "../utils/verifyToken";

const router = express.Router();

//Create
router.post("/:hotelid", verifyAdmin, createRoom);

//Update
router.put("/:id", verifyAdmin, updateRoom);

//Delete
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);

//Get single Room
router.get("/:id", getRoom);

//Get all
router.get("/", getAllRoom);

export default router;
