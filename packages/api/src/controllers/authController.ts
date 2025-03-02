import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel, IUser } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export const register: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user: IUser = new UserModel({ email, password: hashedPassword, name });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};
