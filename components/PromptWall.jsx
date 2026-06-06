"use client";

import { useState, useEffect } from "react";
import ScrollingColumns from "./ScrollingColumns";

function PromptWall() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/prompt");
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;
        setPosts(data.slice(0, 15));
      } catch {
        /* ignore — section just won't render */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!posts.length) return null;

  return (
    <section className="mt-24 w-full max-w-6xl">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
          Trending in the community
        </h2>
        <p className="desc text-center">
          A living wall of prompts people are creating and sharing right now.
        </p>
      </div>

      <ScrollingColumns posts={posts} />
    </section>
  );
}

export default PromptWall;
