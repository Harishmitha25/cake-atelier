export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

export interface Cake {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "birthday" | "wedding" | "anniversary" | "custom" | "cupcakes";
  images: string[];
  sizes: string[];
  flavors: string[];
  isAvailable: boolean;
}
