"use client";
import { useEffect, useState } from "react";

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function HackathonTimer({ deadline }: { deadline: string }) {
  const [left, setLeft] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setLeft(new Date(deadline).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return (
    <div className="text-center">
      <div className="text-sm text-black/60 dark:text-white/60">Tiempo restante</div>
      <div className="text-3xl font-mono" suppressHydrationWarning>
        {mounted ? format(left) : "--:--:--"}
      </div>
    </div>
  );
}
