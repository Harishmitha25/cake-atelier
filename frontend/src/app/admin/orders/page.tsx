"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllOrders, updateOrderStatus } from "@/lib/api";
import { AdminNav } from "@/components/admin/AdminNav";
import { OrderCardSkeleton } from "@/components/OrderCardSkeleton";
import { useRequireAdmin } from "@/lib/useRequireAdmin";
import type { Order, OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useRequireAdmin();
  const [orders, setOrders] = useState<Order[] | null>(null);

  const refresh = useCallback(() => {
    getAllOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Order status updated");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  if (authLoading || !user) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <AdminNav />
      <h1 className="text-2xl font-bold tracking-tight">Manage orders</h1>

      {orders === null && <OrderCardSkeleton />}
      {orders?.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}

      {orders?.map((order) => (
        <Card key={order._id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {order.user?.name ?? "Unknown customer"} · {new Date(order.createdAt).toLocaleDateString()}
            </CardTitle>
            <Select
              value={order.status}
              onValueChange={(status) => status && handleStatusChange(order._id, status as OrderStatus)}
            >
              <SelectTrigger className="w-44 capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s.replace(/-/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {order.user?.email && (
              <p className="text-sm text-muted-foreground">{order.user.email}</p>
            )}
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
              <Badge variant="outline" className="mr-2 capitalize">
                {order.paymentStatus}
              </Badge>
              Delivery on {new Date(order.deliveryDate).toLocaleDateString()} to{" "}
              {order.deliveryAddress}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
