import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CakeDetailForm } from "@/components/CakeDetailForm";
import { getCakeById } from "@/lib/api";
import { categoryFallback } from "@/lib/categoryFallback";

export default async function CakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cake = await getCakeById(id);
  if (!cake) notFound();

  const fallback = categoryFallback[cake.category];

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-16 md:grid-cols-2">
      <div className={`relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${fallback.gradient}`}>
        {cake.images[0] ? (
          <Image src={cake.images[0]} alt={cake.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-8xl">{fallback.emoji}</div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Badge variant="outline" className="w-fit capitalize">
          {cake.category}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">{cake.name}</h1>
        <p className="text-2xl font-bold text-primary">£{cake.price}</p>
        <p className="text-muted-foreground">{cake.description}</p>

        <CakeDetailForm cake={cake} />
      </div>
    </div>
  );
}
