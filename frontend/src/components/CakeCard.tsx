"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/lib/cartStore";
import { categoryFallback } from "@/lib/categoryFallback";
import type { Cake } from "@/lib/types";

export function CakeCard({ cake }: { cake: Cake }) {
  const addItem = useCartStore((state) => state.addItem);
  const fallback = categoryFallback[cake.category];

  return (
    <Card className="overflow-hidden py-0">
      <Link href={`/cakes/${cake._id}`}>
        <div className={`relative h-40 bg-gradient-to-br ${fallback.gradient}`}>
          {cake.images[0] ? (
            <Image
              src={cake.images[0]}
              alt={cake.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">{fallback.emoji}</div>
          )}
        </div>
      </Link>
      <CardContent className="px-5 pt-4">
        <Badge variant="outline" className="mb-2 capitalize">
          {cake.category}
        </Badge>
        <Link href={`/cakes/${cake._id}`}>
          <h3 className="font-semibold hover:underline">{cake.name}</h3>
        </Link>
        <p className="text-lg font-bold text-primary">£{cake.price}</p>
      </CardContent>
      <CardFooter className="px-5 pb-5">
        <Button
          className="w-full"
          onClick={() => {
            addItem(cake);
            toast.success(`${cake.name} added to cart`);
          }}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
