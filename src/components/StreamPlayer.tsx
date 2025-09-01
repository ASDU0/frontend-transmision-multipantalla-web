"use client";
import { useEffect, useRef } from "react";

export default function StreamPlayer({ stream, muted = true }: { stream: MediaStream | null; muted?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (stream) {
      ref.current.srcObject = stream;
      const v = ref.current as HTMLVideoElement;
      // Intentar reproducir por si el navegador bloquea autoplay
      const play = () => v.play().catch(() => {});
      if (v.readyState >= 2) play(); else v.onloadeddata = play;
    } else {
      ref.current.srcObject = null;
    }
  }, [stream]);
  return (
    <video ref={ref} autoPlay playsInline muted={muted} className="w-full h-full bg-black rounded" />
  );
}
