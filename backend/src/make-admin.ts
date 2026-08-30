import "dotenv/config";
import { connectDB } from "./config/db";
import User from "./models/User";
import mongoose from "mongoose";

const email = process.argv[2];

async function run() {
  if (!email) {
    console.error("Usage: npm run make-admin -- <email>");
    process.exit(1);
  }

  await connectDB();
  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { returnDocument: "after" }
  );
  if (!user) {
    console.error(`No user found with email ${email}`);
  } else {
    console.log(`${user.email} is now an admin`);
  }
  await mongoose.disconnect();
}

run();
