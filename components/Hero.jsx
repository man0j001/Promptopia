"use client";

// Adapted from the provided shadcn "hero-1" component to this project's stack:
// plain JSX, Tailwind 3, no shadcn (CTA is a styled link, icon is inline SVG).
export function Hero({
  eyebrow = "Curated AI prompts",
  title,
  subtitle,
  ctaLabel = "Explore prompts",
  ctaHref = "#prompts",
}) {
  return (
    <section
      id="hero"
      className="relative isolate mx-auto w-full pt-40 px-6 text-center md:px-8
      min-h-[calc(100vh-40px)] overflow-hidden
      bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_46%,#ebe9f3_80%,transparent_100%)]
      dark:bg-[linear-gradient(to_bottom,#000000_0%,#000000_30%,#544f6e_80%,transparent_100%)]"
    >
      {/* Color wash — soft on-brand glows (ember · violet · cyan) behind the grid.
          Masked to fade before the bottom so the seamless page-blend is preserved. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
        bg-[radial-gradient(42%_38%_at_10%_15%,rgba(232,64,13,0.22),transparent_70%),radial-gradient(45%_40%_at_90%_10%,rgba(124,92,232,0.28),transparent_70%),radial-gradient(40%_38%_at_78%_62%,rgba(56,189,248,0.16),transparent_72%)]
        dark:bg-[radial-gradient(42%_38%_at_10%_15%,rgba(232,64,13,0.16),transparent_70%),radial-gradient(48%_44%_at_90%_10%,rgba(139,92,246,0.32),transparent_70%),radial-gradient(44%_42%_at_78%_62%,rgba(79,70,229,0.26),transparent_72%)]
        [mask-image:linear-gradient(to_bottom,#000_55%,transparent_90%)]"
      />

      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-25 dark:opacity-60 h-[600px] w-full
        bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]
        dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:linear-gradient(to_bottom,transparent,#000_80px),radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]
        [mask-composite:intersect] [-webkit-mask-composite:source-in]"
      />

      {/* Radial Accent — the horizon "circle". Larger now; its lower half
          dissolves into the page via the bottom fade, so it never looks clipped. */}
      <div
        className="absolute -z-10 left-1/2 top-[calc(100%-240px)] md:top-[calc(100%-260px)] lg:top-[calc(100%-340px)]
        h-[600px] w-[820px] md:h-[680px] md:w-[1200px] lg:h-[950px] lg:w-[150%]
        -translate-x-1/2 rounded-[100%]
        bg-[radial-gradient(closest-side,#ffffff_76%,#a78bfa_90%,#ff5a1f)]
        dark:bg-[radial-gradient(closest-side,#000000_74%,#8b5cf6_90%,#ff5a1f)]
        animate-fade"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href={ctaHref} className="group">
          <span
            className="text-sm text-gray-600 dark:text-gray-400 mx-auto px-5 py-2
            bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent
            border-[2px] border-gray-300/20 dark:border-white/5
            rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center"
          >
            {eyebrow}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </a>
      )}

      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance
        bg-gradient-to-br from-black from-30% to-black/70
        bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter
        text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl
        dark:from-white dark:to-white/40"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mb-12 -translate-y-4 text-balance
        text-lg tracking-tight text-gray-600 dark:text-gray-400
        opacity-0 md:text-xl"
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex justify-center">
          <a
            href={ctaHref}
            className="mt-[-20px] z-20 inline-flex h-11 w-fit md:w-52 items-center justify-center
            rounded-md bg-ink px-8 text-lg font-medium tracking-tighter text-paper
            transition-colors hover:bg-ink/90"
          >
            {ctaLabel}
          </a>
        </div>
      )}

      {/* Bottom fade — ramps to the exact page background so the hero melts
          into the section below (no seam) and softens the circle's lower edge.
          Light → #ffffff (.main base) · Dark → #0a0a0c (.dark .main base). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[200px] md:h-[260px] lg:h-[320px]
        bg-[linear-gradient(to_bottom,transparent_0%,#ffffff_72%,#ffffff_100%)]
        dark:bg-[linear-gradient(to_bottom,transparent_0%,#0a0a0c_72%,#0a0a0c_100%)]"
      />
    </section>
  );
}

export default Hero;
