import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUserModel } from "../models/User";
import { createError } from "../utils/error";

interface CustomRequest<T> extends Request {
  body: T;
}

export const register = async (
  req: CustomRequest<IUserModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: CustomRequest<IUserModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return next(createError(404, "No User Found"));
    }
    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
      return next(createError(404, "wrong credentials"));
    }
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!
    );
    const { password: userPassword, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(otherDetails);
  } catch (error) {
    next(error);
  }
};
