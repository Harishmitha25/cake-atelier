import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadImage } from "../controllers/uploadController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, requireAdmin, upload.single("image"), uploadImage);

export default router;
