"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick, noExpand }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Backwards-compatible: prompts created before the title field show a fallback.
  const hasTitle = Boolean(post.title && post.title.trim());
  const displayTitle = hasTitle ? post.title : "Untitled Prompt";

  // Only offer "Read more" when the prompt is long enough — and never inside the
  // auto-scroll marquee (noExpand), where a height change would break the loop.
  const isLong = !noExpand && (post.prompt?.length || 0) > 120;

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(post.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className='prompt_card group'>
      {/* Header: author */}
      <div className='flex items-center gap-3'>
        <div
          className='flex flex-1 items-center gap-3 cursor-pointer'
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt='user_image'
            width={40}
            height={40}
            className='h-10 w-10 rounded-full object-cover ring-1 ring-ink/5 transition group-hover:ring-ink/20'
          />

          <div className='flex flex-col'>
            <h3 className='font-semibold leading-tight tracking-[-0.01em] text-ink'>
              {post.creator.username}
            </h3>
            <p className='text-xs text-graphite'>{post.creator.email}</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2
        className={`prompt_title mt-4 ${
          hasTitle ? "text-ink" : "italic font-medium text-stone"
        }`}
        title={displayTitle}
      >
        {displayTitle}
      </h2>

      {/* Prompt body */}
      <p
        className={`mt-2 text-sm leading-relaxed text-graphite ${
          expanded ? "" : "line-clamp-3 min-h-[3.9rem]"
        }`}
      >
        {post.prompt}
      </p>

      {isLong && (
        <button
          type='button'
          onClick={() => setExpanded((prev) => !prev)}
          className='mt-1 self-start text-xs font-semibold tracking-[-0.01em] text-ink transition-colors hover:text-violet-deep cursor-pointer'
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}

      {/* Footer: tag + copy */}
      <div className='mt-auto flex items-center justify-between gap-3 border-t border-ink/10 pt-3'>
        <button
          type='button'
          className='tag_chip max-w-[60%] truncate'
          onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          #{post.tag}
        </button>

        <button
          type='button'
          onClick={handleCopy}
          aria-label='Copy prompt'
          className={`copy_pill ${copied ? "copy_pill--done" : ""}`}
        >
          {copied ? (
            <>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-3.5 w-3.5'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-3.5 w-3.5'
              >
                <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
                <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className='mt-4 flex-center gap-4 border-t border-ink/10 pt-3'>
          <p
            className='text-sm font-medium text-ink transition-colors hover:text-graphite cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='text-sm font-medium text-ink transition-colors hover:text-violet-deep cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
