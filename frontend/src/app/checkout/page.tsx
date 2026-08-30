"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore, cartTotal, lineKey } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import { apiFetch } from "@/lib/api";
import { stripePromise } from "@/lib/stripe";
import type { Order } from "@/lib/types";

function PaymentForm({
  deliveryAddress,
  deliveryDate,
}: {
  deliveryAddress: string;
  deliveryDate: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
      setError("Payment was not completed");
      setSubmitting(false);
      return;
    }

    try {
      const order = await apiFetch<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({
            cake: i.cake._id,
            name: i.cake.name,
            price: i.cake.price,
            quantity: i.quantity,
            size: i.size,
            flavor: i.flavor,
          })),
          totalAmount: cartTotal(items),
          deliveryDate,
          deliveryAddress,
          stripePaymentIntentId: paymentIntent.id,
        }),
      });
      clear();
      toast.success("Order placed!");
      router.push(`/checkout/success?orderId=${order._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save the order");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!stripe || submitting} className="w-full">
        {submitting ? "Processing…" : `Pay £${cartTotal(items).toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  async function handleContinueToPayment(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCreatingIntent(true);
    try {
      const { clientSecret } = await apiFetch<{ clientSecret: string }>(
        "/payments/create-intent",
        { method: "POST", body: JSON.stringify({ amount: cartTotal(items) }) }
      );
      setClientSecret(clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start payment");
    } finally {
      setCreatingIntent(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {items.map(({ cake, quantity, size, flavor }) => (
            <div key={lineKey(cake._id, size, flavor)} className="flex justify-between text-sm">
              <span>
                {cake.name}
                {(size || flavor) && (
                  <span className="text-muted-foreground"> ({[size, flavor].filter(Boolean).join(" · ")})</span>
                )}{" "}
                × {quantity}
              </span>
              <span>£{(cake.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>£{cartTotal(items).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery details</CardTitle>
        </CardHeader>
        <CardContent>
          {!clientSecret ? (
            <form onSubmit={handleContinueToPayment} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address">Delivery address</Label>
                <Textarea
                  id="address"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date">Delivery date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={creatingIntent} className="w-full">
                {creatingIntent ? "Loading…" : "Continue to payment"}
              </Button>
            </form>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm deliveryAddress={deliveryAddress} deliveryDate={deliveryDate} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
