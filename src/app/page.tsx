import Link from "next/link";
import HackathonTimer from "@/components/HackathonTimer";

export default function Home() {
  // Fecha estimada de cierre del hackathon (ajústala)
  const deadline = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Transmisión Multipantalla</h1>
        <p className="text-black/70 dark:text-white/70">
          Elige una categoría para ver transmisiones o ve a &quot;Transmitir&quot; para compartir tu pantalla.
        </p>
      </div>
      <HackathonTimer deadline={deadline} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/categoria/1" className="p-8 rounded border hover:bg-black/5 dark:hover:bg-white/5">
          <div className="text-xl font-medium">Categoría 1</div>
          <div className="text-sm text-black/60 dark:text-white/60">Ver transmisiones</div>
        </Link>
        <Link href="/categoria/2" className="p-8 rounded border hover:bg-black/5 dark:hover:bg-white/5">
          <div className="text-xl font-medium">Categoría 2</div>
          <div className="text-sm text-black/60 dark:text-white/60">Ver transmisiones</div>
        </Link>
      </div>
      <div className="pt-2">
        <div className="text-sm text-black/60 dark:text-white/60 mb-2">¿Listo para transmitir?</div>
        <div className="flex gap-2 flex-wrap items-center">
          <Link href="/transmitir?cat=1" className="px-3 py-2 rounded border">Transmitir en categoría 1</Link>
          <Link href="/transmitir?cat=2" className="px-3 py-2 rounded border">Transmitir en categoría 2</Link>
        </div>
      </div>
    </div>
  );
}
