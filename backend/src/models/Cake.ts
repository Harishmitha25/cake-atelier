import { Schema, model, InferSchemaType } from "mongoose";

const cakeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["birthday", "wedding", "anniversary", "custom", "cupcakes"],
      required: true,
    },
    images: [{ type: String }],
    sizes: [{ type: String }],
    flavors: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Cake = InferSchemaType<typeof cakeSchema>;
export default model("Cake", cakeSchema);
