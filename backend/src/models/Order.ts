import { Schema, model, InferSchemaType } from "mongoose";

const orderItemSchema = new Schema(
  {
    cake: { type: Schema.Types.ObjectId, ref: "Cake", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: String,
    flavor: String,
    message: String,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

export type Order = InferSchemaType<typeof orderSchema>;
export default model("Order", orderSchema);
