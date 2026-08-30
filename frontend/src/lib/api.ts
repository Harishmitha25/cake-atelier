import type { Cake, Order, OrderStatus } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function getCakes(category?: string): Promise<Cake[]> {
  const query = category ? `?category=${category}` : "";
  const res = await fetch(`${API_URL}/cakes${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cakes");
  return res.json();
}

export async function getCakeById(id: string): Promise<Cake | null> {
  const res = await fetch(`${API_URL}/cakes/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load cake");
  return res.json();
}

export async function getMyOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders/mine");
}

export interface CakeInput {
  name: string;
  description: string;
  price: number;
  category: Cake["category"];
  images: string[];
  sizes: string[];
  flavors: string[];
}

export async function createCake(input: CakeInput): Promise<Cake> {
  return apiFetch<Cake>("/cakes", { method: "POST", body: JSON.stringify(input) });
}

export async function updateCake(id: string, input: CakeInput): Promise<Cake> {
  return apiFetch<Cake>(`/cakes/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export async function deleteCake(id: string): Promise<void> {
  return apiFetch<void>(`/cakes/${id}`, { method: "DELETE" });
}

export async function getAllOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders");
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Failed to upload image");
  }
  const { url } = await res.json();
  return url;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
