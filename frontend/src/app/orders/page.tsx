"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/authStore";
import { getMyOrders } from "@/lib/api";
import type { Order } from "@/lib/types";

const statusVariant: Record<Order["status"], "default" | "secondary" | "outline" | "destructive"> = {
  pending: "secondary",
  confirmed: "outline",
  preparing: "outline",
  "out-for-delivery": "outline",
  delivered: "default",
  cancelled: "destructive",
};

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      getMyOrders()
        .then(setOrders)
        .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"));
    }
  }, [authLoading, user, router]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">My orders</h1>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!error && orders === null && (
        <p className="text-muted-foreground">Loading your orders…</p>
      )}

      {orders?.length === 0 && (
        <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
      )}

      {orders?.map((order) => (
        <Card key={order._id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Order placed {new Date(order.createdAt).toLocaleDateString()}
            </CardTitle>
            <Badge variant={statusVariant[order.status]} className="capitalize">
              {order.status.replace(/-/g, " ")}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>£{order.totalAmount.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Delivery on {new Date(order.deliveryDate).toLocaleDateString()} to{" "}
              {order.deliveryAddress}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
