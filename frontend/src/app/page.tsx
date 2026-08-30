import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { CakeCard } from "@/components/CakeCard";
import { getCakes } from "@/lib/api";

export default async function Home() {
  const cakes = await getCakes().catch(() => null);

  return (
    <div className="flex flex-col flex-1">
      <Header />

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
            <Button size="lg" nativeButton={false} render={<a href="#menu" />}>
              Order Now
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<a href="#menu" />}>
              Browse Menu
            </Button>
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
            {cakes.map((cake) => (
              <CakeCard key={cake._id} cake={cake} />
            ))}
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
