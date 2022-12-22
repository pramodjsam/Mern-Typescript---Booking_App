import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
} from "../controllers/userController";
import { verityUser, verifyAdmin } from "../utils/verifyToken";

const router = express.Router();

// router.get("/checkAuthentication", verifyToken, (req, res, next) => {
//   res.json("correct ");
// });
// router.get("/verityUser/:id", verityUser, (req, res, next) => {
//   res.json("correct User");
// });

// router.get("/verityUser/:id", verifyAdmin, (req, res, next) => {
//   res.json("correct admin");
// });

//Update
router.put("/:id", verityUser, updateUser);

//Delete
router.delete("/:id", verityUser, deleteUser);

//Get single User
router.get("/:id", verityUser, getUser);

//Get all
router.get("/", verifyAdmin, getAllUser);

export default router;
