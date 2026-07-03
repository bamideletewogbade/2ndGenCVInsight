export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 sm:py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <p className="text-[11px] sm:text-[12px] text-muted-foreground tracking-wide">
          Built to demonstrate production AI engineering practices.
        </p>
        <p className="text-[11px] sm:text-[12px] text-muted-foreground/50 tracking-wide mt-1">
          Powered by NVIDIA NIM
        </p>
      </div>
    </footer>
  );
}