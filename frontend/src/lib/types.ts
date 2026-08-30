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

export interface OrderItem {
  cake: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryDate: string;
  deliveryAddress: string;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  user?: { _id: string; name: string; email: string };
}
