"use client";

import { useEffect, useRef } from "react";
import PromptCard from "./PromptCard";

const GAP = 16; // matches the track's gap-4 (1rem) — needed for a seamless loop
const SPEED = 0.35; // px per frame
const DIRECTIONS = [-1, 1, -1]; // columns: up, down, up

/**
 * A 3-column auto-scrolling marquee of prompt cards.
 * Renders the SAME PromptCard as the grid, with expand disabled (noExpand) so the
 * card height stays fixed and the loop stays seamless. Copy still works.
 * Outer columns scroll up, the middle scrolls down; hovering a column pauses it.
 * `posts` should be a STABLE array reference (memoize at the call site).
 */
export default function ScrollingColumns({ posts, handleTagClick }) {
  const colRefs = useRef([]);

  const columns = [[], [], []];
  (posts || []).forEach((p, i) => columns[i % 3].push(p));

  useEffect(() => {
    if (!(posts && posts.length)) return;

    const tracks = colRefs.current
      .map((c) => c?.querySelector("[data-track]"))
      .filter(Boolean);
    if (!tracks.length) return;

    const measure = (t) => (t.scrollHeight + GAP) / 2; // one copy's period
    const state = tracks.map((track, idx) => {
      const dir = DIRECTIONS[idx] ?? -1;
      const loopH = measure(track);
      return { track, dir, loopH, y: dir < 0 ? 0 : -loopH, paused: false };
    });

    const cleanups = state.map((s) => {
      const col = s.track.parentElement;
      const enter = () => (s.paused = true);
      const leave = () => (s.paused = false);
      col.addEventListener("mouseenter", enter);
      col.addEventListener("mouseleave", leave);
      return () => {
        col.removeEventListener("mouseenter", enter);
        col.removeEventListener("mouseleave", leave);
      };
    });

    let rafId;
    const frame = () => {
      for (const s of state) {
        if (s.loopH <= 0) s.loopH = measure(s.track); // recover if layout wasn't ready
        if (!s.paused && s.loopH > 0) {
          s.y += s.dir * SPEED;
          if (s.dir < 0 && s.y <= -s.loopH) s.y += s.loopH;
          if (s.dir > 0 && s.y >= 0) s.y -= s.loopH;
          s.track.style.transform = `translateY(${s.y}px)`;
        }
      }
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    const onResize = () => state.forEach((s) => (s.loopH = measure(s.track)));
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      cleanups.forEach((fn) => fn());
    };
  }, [posts]);

  if (!(posts && posts.length)) return null;

  const maskStyle = {
    maskImage: "linear-gradient(transparent, #000 12%, #000 88%, transparent)",
    WebkitMaskImage: "linear-gradient(transparent, #000 12%, #000 88%, transparent)",
  };

  return (
    <div className="mt-10 flex w-full justify-center gap-4">
      {columns.map((col, i) => (
        <div
          key={i}
          ref={(el) => (colRefs.current[i] = el)}
          style={maskStyle}
          className={`relative h-[560px] flex-1 overflow-hidden ${
            i === 0 ? "" : "hidden md:block"
          }`}
        >
          <div data-track className="flex flex-col gap-4 will-change-transform">
            {[...col, ...col].map((p, j) => (
              <PromptCard
                key={`${p._id}-${j}`}
                post={p}
                noExpand
                handleTagClick={handleTagClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
