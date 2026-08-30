"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";

export function AuthInitializer() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return null;
}
