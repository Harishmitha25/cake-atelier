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

export interface CartItem {
  cake: Cake;
  quantity: number;
  size?: string;
  flavor?: string;
  message?: string;
}
