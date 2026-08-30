import { Router } from "express";
import { createPaymentIntent } from "../controllers/paymentController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/create-intent", requireAuth, createPaymentIntent);

export default router;
