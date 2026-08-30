import { Request, Response } from "express";
import Stripe from "stripe";

let stripe: Stripe | undefined;
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  return (stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY));
}

export async function createPaymentIntent(req: Request, res: Response) {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "gbp",
    payment_method_types: ["card"],
  });

  res.json({ clientSecret: paymentIntent.client_secret });
}
