import type { Cake } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function getCakes(category?: string): Promise<Cake[]> {
  const query = category ? `?category=${category}` : "";
  const res = await fetch(`${API_URL}/cakes${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cakes");
  return res.json();
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

  return res.json();
}
