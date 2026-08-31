import "dotenv/config";
import { connectDB } from "./config/db";
import Cake from "./models/Cake";
import mongoose from "mongoose";

const cakes = [
  {
    name: "Classic Red Velvet",
    description: "Layers of moist red velvet sponge with tangy cream cheese frosting.",
    price: 32,
    category: "birthday",
    images: ["https://images.unsplash.com/photo-1602630209855-dceac223adfe?w=800&q=80&fit=crop"],
    sizes: ["6 inch", "8 inch", "10 inch"],
    flavors: ["Red Velvet"],
  },
  {
    name: "Chocolate Truffle Delight",
    description: "Rich dark chocolate sponge soaked in ganache with chocolate truffle shavings.",
    price: 38,
    category: "anniversary",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&fit=crop"],
    sizes: ["6 inch", "8 inch", "10 inch"],
    flavors: ["Dark Chocolate", "Truffle"],
  },
  {
    name: "Three-Tier Wedding White",
    description: "An elegant three-tier vanilla almond cake finished with smooth white buttercream.",
    price: 220,
    category: "wedding",
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80&fit=crop"],
    sizes: ["2-tier", "3-tier"],
    flavors: ["Vanilla", "Almond"],
  },
  {
    name: "Rainbow Sprinkle Cupcakes",
    description: "A dozen funfetti cupcakes topped with vanilla buttercream and rainbow sprinkles.",
    price: 18,
    category: "cupcakes",
    images: ["https://images.unsplash.com/photo-1680580735621-4371027734eb?w=800&q=80&fit=crop"],
    sizes: ["Box of 6", "Box of 12"],
    flavors: ["Vanilla", "Funfetti"],
  },
  {
    name: "Custom Photo Cake",
    description: "A fully personalised cake with an edible print of your favourite photo or design.",
    price: 45,
    category: "custom",
    images: ["https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80&fit=crop"],
    sizes: ["6 inch", "8 inch"],
    flavors: ["Vanilla", "Chocolate", "Red Velvet"],
  },
  {
    name: "Salted Caramel Ganache",
    description: "Caramel sponge layered with salted caramel ganache and a caramel drizzle finish.",
    price: 40,
    category: "anniversary",
    images: ["https://images.unsplash.com/photo-1571050045617-cbbd5e68d181?w=800&q=80&fit=crop"],
    sizes: ["6 inch", "8 inch", "10 inch"],
    flavors: ["Salted Caramel", "Chocolate"],
  },
  {
    name: "Classic Vanilla Bean Cupcakes",
    description: "A dozen classic vanilla bean cupcakes with smooth vanilla buttercream swirls.",
    price: 16,
    category: "cupcakes",
    images: ["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80&fit=crop"],
    sizes: ["Box of 6", "Box of 12"],
    flavors: ["Vanilla Bean"],
  },
  {
    name: "Golden Anniversary Gateau",
    description: "A refined layered gateau with gold leaf accents, perfect for milestone celebrations.",
    price: 65,
    category: "anniversary",
    images: ["https://images.unsplash.com/photo-1693059740560-21151639561f?w=800&q=80&fit=crop"],
    sizes: ["8 inch", "10 inch"],
    flavors: ["Vanilla", "Chocolate"],
  },
];

async function seed() {
  await connectDB();
  await Cake.deleteMany({});
  await Cake.insertMany(cakes);
  console.log(`Seeded ${cakes.length} cakes`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
