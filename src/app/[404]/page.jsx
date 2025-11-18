"use client";

import { useRouter } from "next/navigation";

export default function Error404() {
  const router = useRouter();
  return (
    <main className="flex flex-col justify-center items-center gap-2 bg-linear-to-br from-neutral-100 to-neutral-200 p-8 min-h-screen text-center">
      <p className="font-bold text-7xl">404</p>
      <p className="mb-8 text-3xl">Page Not Found</p>
      <button onClick={() => router.push("/")} className="btn primary-btn">
        Return home
      </button>
    </main>
  );
}
