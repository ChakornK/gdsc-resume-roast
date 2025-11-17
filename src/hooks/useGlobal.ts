"use client";

import { GlobalContext } from "@/contexts/GlobalContext";
import { useContext } from "react";

export function useGlobal() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobal must be used within provider");
  }

  return context;
}
