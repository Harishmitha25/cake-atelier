"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <Card className="w-full max-w-md text-center">
      <CardContent className="flex flex-col items-center gap-4 py-8">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Order placed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We&apos;ll get baking right away.
        </p>
        {orderId && (
          <p className="text-sm text-muted-foreground">
            Order reference: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <Button nativeButton={false} render={<Link href="/" />}>
          Back to menu
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense fallback={null}>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
