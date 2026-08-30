import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getCakes } from "@/lib/api";

const categoryFallback: Record<string, { emoji: string; gradient: string }> = {
  birthday: { emoji: "🎂", gradient: "from-rose-300 to-rose-500" },
  wedding: { emoji: "💒", gradient: "from-amber-200 to-rose-300" },
  anniversary: { emoji: "🍫", gradient: "from-orange-300 to-rose-400" },
  cupcakes: { emoji: "🧁", gradient: "from-amber-200 to-pink-300" },
  custom: { emoji: "🍰", gradient: "from-pink-300 to-amber-300" },
};

export default async function Home() {
  const cakes = await getCakes().catch(() => null);

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold tracking-tight">
            🍰 Sweet Layers
          </span>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#menu" className="hover:text-foreground">Menu</a>
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Cart</a>
          </nav>
          <Button variant="default">Sign in</Button>
        </div>
      </header>

      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
          <Badge variant="secondary" className="text-sm">Freshly baked, every day</Badge>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Cakes made for your{" "}
            <span className="text-primary">sweetest moments</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Birthdays, weddings, anniversaries or just because — order a
            handcrafted cake and have it delivered fresh to your door.
          </p>
          <div className="flex gap-4">
            <Button size="lg">Order Now</Button>
            <Button size="lg" variant="outline">Browse Menu</Button>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured cakes</h2>
            <p className="text-muted-foreground">Popular picks from our bakery</p>
          </div>
        </div>

        {!cakes && (
          <p className="text-muted-foreground">
            Unable to load the menu right now — check that the backend is running.
          </p>
        )}

        {cakes && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cakes.map((cake) => {
              const fallback = categoryFallback[cake.category];
              return (
                <Card key={cake._id} className="overflow-hidden py-0">
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
                      <div className="flex h-full items-center justify-center text-6xl">
                        {fallback.emoji}
                      </div>
                    )}
                  </div>
                  <CardContent className="px-5 pt-4">
                    <Badge variant="outline" className="mb-2 capitalize">
                      {cake.category}
                    </Badge>
                    <h3 className="font-semibold">{cake.name}</h3>
                    <p className="text-lg font-bold text-primary">£{cake.price}</p>
                  </CardContent>
                  <CardFooter className="px-5 pb-5">
                    <Button className="w-full">Add to cart</Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          © 2026 Sweet Layers Bakery. Made with ❤️ and buttercream.
        </div>
      </footer>
    </div>
  );
}
