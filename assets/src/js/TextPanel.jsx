function TextPanel() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[2147483647] flex flex-wrap items-center justify-center gap-2 bg-emerald-400 px-3 py-2 text-center font-semibold text-emerald-950 pointer-events-none">
      <span className="min-w-0 text-lg">PML text mod loaded</span>
      <span className="min-w-0 text-sm">React + Tailwind · v1.0.0</span>
    </div>
  );
}

export default TextPanel;