"use client";

import { useState, FormEvent, ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCake, updateCake, uploadImage } from "@/lib/api";
import type { Cake } from "@/lib/types";

const categories: Cake["category"][] = ["birthday", "wedding", "anniversary", "custom", "cupcakes"];

function parseCsv(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function CakeFormDialog({
  cake,
  trigger,
  onSaved,
}: {
  cake?: Cake;
  trigger: ReactNode;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(cake?.name ?? "");
  const [description, setDescription] = useState(cake?.description ?? "");
  const [price, setPrice] = useState(cake ? String(cake.price) : "");
  const [category, setCategory] = useState<Cake["category"]>(cake?.category ?? "birthday");
  const [sizesText, setSizesText] = useState(cake?.sizes.join(", ") ?? "");
  const [flavorsText, setFlavorsText] = useState(cake?.flavors.join(", ") ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage] = useState(cake?.images[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const imageUrl = imageFile ? await uploadImage(imageFile) : existingImage;
      const input = {
        name,
        description,
        price: Number(price),
        category,
        images: imageUrl ? [imageUrl] : [],
        sizes: parseCsv(sizesText),
        flavors: parseCsv(flavorsText),
      };

      if (cake) {
        await updateCake(cake._id, input);
        toast.success("Cake updated");
      } else {
        await createCake(input);
        toast.success("Cake added");
      }
      setOpen(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save cake");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{cake ? "Edit cake" : "Add cake"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Price (£)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v as Cake["category"])}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sizes">Sizes (comma separated)</Label>
            <Input
              id="sizes"
              placeholder="6 inch, 8 inch, 10 inch"
              value={sizesText}
              onChange={(e) => setSizesText(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flavors">Flavors (comma separated)</Label>
            <Input
              id="flavors"
              placeholder="Vanilla, Chocolate"
              value={flavorsText}
              onChange={(e) => setFlavorsText(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="image">Photo</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
