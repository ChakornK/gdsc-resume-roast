"use client";

import { mdiHomeOutline, mdiHomeVariantOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";

export default function Error404() {
  const router = useRouter();
  return (
    <main className="flex flex-col justify-center items-center gap-2 p-8 min-h-screen text-center">
      <p className="font-bold text-7xl">404</p>
      <p className="mb-8 text-3xl">Page Not Found</p>
      <button
        onClick={() => router.push("/")}
        className="text-lg md:text-xl btn primary-btn"
      >
        <Icon path={mdiHomeVariantOutline} size="1em" />
        Return home
      </button>
    </main>
  );
}
