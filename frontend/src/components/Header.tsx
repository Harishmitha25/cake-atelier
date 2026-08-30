"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useCartStore, cartTotal, cartCount, lineKey } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";

export function Header() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const count = cartCount(items);

  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-xl font-semibold tracking-tight">🍰 Sweet Layers</span>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#menu" className="hover:text-foreground">Menu</a>
          <a href="#" className="hover:text-foreground">About</a>
        </nav>
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Your cart</SheetTitle>
              </SheetHeader>

              {items.length === 0 ? (
                <p className="px-4 text-sm text-muted-foreground">Your cart is empty.</p>
              ) : (
                <div className="flex-1 space-y-4 overflow-y-auto px-4">
                  {items.map(({ cake, quantity, size, flavor }) => {
                    const key = lineKey(cake._id, size, flavor);
                    return (
                      <div key={key} className="flex gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                          {cake.images[0] && (
                            <Image src={cake.images[0]} alt={cake.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{cake.name}</p>
                          {(size || flavor) && (
                            <p className="text-xs text-muted-foreground">
                              {[size, flavor].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">£{cake.price}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(key, quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-4 text-center text-sm">{quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(key, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 ml-auto text-destructive"
                              onClick={() => removeItem(key)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {items.length > 0 && (
                <SheetFooter>
                  <Separator className="mb-2" />
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>£{cartTotal(items).toFixed(2)}</span>
                  </div>
                  <SheetClose
                    nativeButton={false}
                    render={<Link href="/checkout" className={buttonVariants({ className: "w-full" })} />}
                  >
                    Checkout
                  </SheetClose>
                </SheetFooter>
              )}
            </SheetContent>

            <SheetTrigger
              render={<Button variant="outline" size="icon" className="relative" />}
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
                  {count}
                </Badge>
              )}
            </SheetTrigger>
          </Sheet>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="icon" />}
              >
                <UserIcon className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/orders")}>
                  My orders
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push("/admin/cakes")}>
                    Admin dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" nativeButton={false} render={<Link href="/login" />}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
