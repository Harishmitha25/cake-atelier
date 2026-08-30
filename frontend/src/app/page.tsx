import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { sampleCakes } from "@/lib/sample-cakes";

export default function Home() {
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sampleCakes.map((cake) => (
            <Card key={cake.id} className="overflow-hidden py-0">
              <div
                className={`flex h-40 items-center justify-center bg-gradient-to-br ${cake.gradient} text-6xl`}
              >
                {cake.emoji}
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
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          © 2026 Sweet Layers Bakery. Made with ❤️ and buttercream.
        </div>
      </footer>
    </div>
  );
}
