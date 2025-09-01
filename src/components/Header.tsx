"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-4 px-6 border-b border-black/10 dark:border-white/10">
      <Link href="/" className="font-semibold text-lg">ASDU</Link>
      <nav className="flex gap-4 text-sm">
        <Link href="/">Inicio</Link>
        <Link href="/transmitir">Transmitir</Link>
      </nav>
    </header>
  );
}
