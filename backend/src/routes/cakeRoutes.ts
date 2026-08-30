import { Router } from "express";
import { getCakes, getCakeById, createCake, updateCake, deleteCake } from "../controllers/cakeController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", getCakes);
router.get("/:id", getCakeById);
router.post("/", requireAuth, requireAdmin, createCake);
router.put("/:id", requireAuth, requireAdmin, updateCake);
router.delete("/:id", requireAuth, requireAdmin, deleteCake);

export default router;
