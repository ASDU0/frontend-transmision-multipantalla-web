export default function Footer() {
  return (
    <footer className="w-full text-center text-xs text-black/60 dark:text-white/60 py-6">
      Hackathon ASDU · {new Date().getFullYear()}
    </footer>
  );
}
