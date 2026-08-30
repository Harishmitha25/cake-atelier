import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: "No file provided" });

  const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cake-order" },
      (error, result) => (error ? reject(error) : resolve(result as { secure_url: string }))
    );
    stream.end(req.file!.buffer);
  });

  res.status(201).json({ url: uploadResult.secure_url });
}
