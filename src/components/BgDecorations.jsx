const BgDecorations = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Dots */}
    <div className="absolute top-[12%] left-[6%] w-2 h-2 rounded-full bg-primary-light/50" />
    <div className="absolute top-[28%] right-[10%] w-1.5 h-1.5 rounded-full bg-primary/40" />
    <div className="absolute top-[55%] left-[4%] w-1.5 h-1.5 rounded-full bg-primary-light/40" />
    <div className="absolute top-[72%] right-[7%] w-2 h-2 rounded-full bg-primary/30" />
    <div className="absolute top-[85%] left-[15%] w-1 h-1 rounded-full bg-primary-light/50" />
    <div className="absolute top-[40%] left-[45%] w-1.5 h-1.5 rounded-full bg-primary/25" />

    {/* 4-pointed sparkle SVGs */}
    <svg className="absolute top-[18%] right-[18%] w-5 h-5 text-primary/20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
    </svg>
    <svg className="absolute top-[48%] left-[12%] w-4 h-4 text-primary-light/20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
    </svg>
    <svg className="absolute top-[78%] right-[22%] w-3 h-3 text-primary/15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
    </svg>

    {/* Outline circles */}
    <div className="absolute top-[30%] left-[70%] w-16 h-16 rounded-full border border-primary/10" />
    <div className="absolute top-[65%] left-[80%] w-10 h-10 rounded-full border border-primary/15" />
    <div className="absolute top-[20%] left-[85%] w-20 h-20 rounded-full border border-primary-light/10" />

    {/* Diamond shapes */}
    <div className="absolute top-[42%] right-[4%] w-3 h-3 border border-primary/15 rotate-45" />
    <div className="absolute top-[8%] left-[48%] w-2.5 h-2.5 border border-primary-light/20 rotate-45" />
    <div className="absolute top-[90%] left-[35%] w-2 h-2 bg-primary/10 rotate-45" />
  </div>
);

export default BgDecorations;
