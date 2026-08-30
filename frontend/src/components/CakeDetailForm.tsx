"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import type { Cake } from "@/lib/types";

export function CakeDetailForm({ cake }: { cake: Cake }) {
  const addItem = useCartStore((state) => state.addItem);
  const [size, setSize] = useState<string | undefined>(cake.sizes[0]);
  const [flavor, setFlavor] = useState<string | undefined>(cake.flavors[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-5">
      {cake.sizes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>Size</Label>
          <Select value={size} onValueChange={(value) => setSize(value ?? undefined)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cake.sizes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {cake.flavors.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>Flavor</Label>
          <Select value={flavor} onValueChange={(value) => setFlavor(value ?? undefined)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cake.flavors.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label>Quantity</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button type="button" size="icon" variant="outline" onClick={() => setQuantity((q) => q + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => {
          addItem(cake, { size, flavor, quantity });
          toast.success(`${cake.name} added to cart`);
        }}
      >
        Add to cart · £{(cake.price * quantity).toFixed(2)}
      </Button>
    </div>
  );
}
