"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CakeFormDialog } from "@/components/admin/CakeFormDialog";
import { AdminNav } from "@/components/admin/AdminNav";
import { getCakes, deleteCake } from "@/lib/api";
import { useRequireAdmin } from "@/lib/useRequireAdmin";
import type { Cake } from "@/lib/types";

export default function AdminCakesPage() {
  const { user, loading: authLoading } = useRequireAdmin();
  const [cakes, setCakes] = useState<Cake[] | null>(null);

  const refresh = useCallback(() => {
    getCakes().then(setCakes).catch(() => setCakes([]));
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this cake?")) return;
    try {
      await deleteCake(id);
      toast.success("Cake deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete cake");
    }
  }

  if (authLoading || !user) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <AdminNav />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage cakes</h1>
        <CakeFormDialog trigger={<Button>Add cake</Button>} onSaved={refresh} />
      </div>

      {cakes === null && <p className="text-muted-foreground">Loading…</p>}

      <div className="flex flex-col gap-3">
        {cakes?.map((cake) => (
          <Card key={cake._id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{cake.name}</span>
                  <Badge variant="outline" className="capitalize">
                    {cake.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">£{cake.price}</p>
              </div>
              <div className="flex gap-2">
                <CakeFormDialog
                  cake={cake}
                  trigger={
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  }
                  onSaved={refresh}
                />
                <Button variant="destructive" size="sm" onClick={() => handleDelete(cake._id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
