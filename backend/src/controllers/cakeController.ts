import { Request, Response } from "express";
import Cake from "../models/Cake";

export async function getCakes(req: Request, res: Response) {
  const { category } = req.query;
  const filter: Record<string, unknown> = category ? { category } : {};
  const cakes = await Cake.find(filter).sort({ createdAt: -1 });
  res.json(cakes);
}

export async function getCakeById(req: Request, res: Response) {
  const cake = await Cake.findById(req.params.id);
  if (!cake) return res.status(404).json({ message: "Cake not found" });
  res.json(cake);
}

export async function createCake(req: Request, res: Response) {
  const cake = await Cake.create(req.body);
  res.status(201).json(cake);
}

export async function updateCake(req: Request, res: Response) {
  const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cake) return res.status(404).json({ message: "Cake not found" });
  res.json(cake);
}

export async function deleteCake(req: Request, res: Response) {
  const cake = await Cake.findByIdAndDelete(req.params.id);
  if (!cake) return res.status(404).json({ message: "Cake not found" });
  res.status(204).send();
}
