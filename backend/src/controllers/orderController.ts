import { Response } from "express";
import Order from "../models/Order";
import { AuthRequest } from "../middleware/auth";

export async function createOrder(req: AuthRequest, res: Response) {
  const order = await Order.create({ ...req.body, user: req.user!.id });
  res.status(201).json(order);
}

export async function getMyOrders(req: AuthRequest, res: Response) {
  const orders = await Order.find({ user: req.user!.id }).sort({ createdAt: -1 });
  res.json(orders);
}

export async function getAllOrders(_req: AuthRequest, res: Response) {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}
