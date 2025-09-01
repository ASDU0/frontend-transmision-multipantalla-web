"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StreamBroadcaster from "@/components/StreamBroadcaster";

function TransmitirInner() {
  const params = useSearchParams();
  const category = params.get("cat") || "1";
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Transmitir</h1>
      <p className="text-sm text-black/70 dark:text-white/70">Categoría actual: {category}</p>
      <StreamBroadcaster category={category} />
    </div>
  );
}

export default function TransmitirPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando…</div>}>
      <TransmitirInner />
    </Suspense>
  );
}
