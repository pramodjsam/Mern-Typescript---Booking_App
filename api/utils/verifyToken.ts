import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUserModel } from "../models/User";
import { createError } from "./error";

declare module "express-serve-static-core" {
  interface Request {
    user: IUserModel;
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    next(createError(401, "You are not authorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) next(createError(403, "Invalid token"));
    req.user = user;

    next();
  });
};

export const verityUser = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      next(createError(403, "You are not authorized"));
    }
  });
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      next(createError(403, "You are not authorized"));
    }
  });
};
