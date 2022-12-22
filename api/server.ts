import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import hotelRouter from "./routes/hotels";
import roomRouter from "./routes/rooms";
import userRouter from "./routes/users";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO ? process.env.MONGO : "");
    console.log("connected to database");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("STATUS: database disconnected");
});
mongoose.connection.on("connected", () => {
  console.log("STATUS: database connected");
});

app.use("/api/auth", authRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(4000, () => {
  connect();
  console.log(`Listening on port 4000`);
});
