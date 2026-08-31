import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

function signToken(id: string, role: string) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true as const,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  secure: isProduction,
};

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = signToken(user.id, user.role);
  setAuthCookie(res, token);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user.id, user.role);
  setAuthCookie(res, token);
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token", cookieOptions);
  res.status(204).send();
}

export async function me(req: AuthRequest, res: Response) {
  const user = await User.findById(req.user!.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
