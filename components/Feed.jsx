'use client'
import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"

function PromptCardList({ data, handleTagClick }) {
  return (
    <div className="mt-10 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

// Pastel category tiles — chromatic accents that break the monochrome feed (used sparingly, per spec)
const CATEGORIES = [
  {
    label: "Image",
    value: "image",
    color: "bg-blush",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
      </>
    ),
  },
  {
    label: "Software",
    value: "software",
    color: "bg-mint",
    icon: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
  },
  {
    label: "Task",
    value: "task",
    color: "bg-pale-yellow",
    icon: (
      <>
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    label: "All prompts",
    value: "",
    color: "bg-lilac",
    icon: (
      <>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </>
    ),
  },
]

function Feed() {
  const [searchText, setSearchText] = useState('')
  const [allPosts, setAllPosts] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [searchTimeOut, setSearchTimeOut] = useState(null)

  useEffect(() => {
    const fetchallPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setAllPosts(Array.isArray(data) ? data : []);
    }
    fetchallPosts();
  }, []);

  const filterPrompt = (text) => {
    const regex = new RegExp(text, "i");
    return allPosts.filter((item) =>
      regex.test(item.creator?.username || '') ||
      regex.test(item.tag || '') ||
      regex.test(item.prompt || '')
    )
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);
    setSearchText(e.target.value)
    setSearchTimeOut(
      setTimeout(() => setSearchResult(filterPrompt(e.target.value)), 400)
    )
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setSearchResult(filterPrompt(tagName));
  }

  const handleCategory = (value) => {
    if (!value) {
      setSearchText('');
      setSearchResult([]);
      return;
    }
    setSearchText(value);
    setSearchResult(allPosts.filter((p) => (p.tag || '').toLowerCase() === value));
  }

  const countFor = (value) =>
    value
      ? allPosts.filter((p) => (p.tag || '').toLowerCase() === value).length
      : allPosts.length;

  return (
    <section className="feed">
      <form className="relative w-full max-w-xl flex-center">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          className="search_input peer"
          placeholder="Search for a tag or a username"
        />
      </form>

      {/* Browse by category — pastel tiles */}
      <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((c) => {
          const active = c.value
            ? searchText.toLowerCase() === c.value
            : !searchText;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => handleCategory(c.value)}
              className={`${c.color} flex flex-col items-start gap-3 rounded-xl p-5 text-left transition-shadow duration-200 cursor-pointer ${
                active ? "ring-2 ring-[#111111]" : "ring-1 ring-transparent hover:ring-[#111111]/15"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-[#111111]"
              >
                {c.icon}
              </svg>
              <span className="flex w-full items-end justify-between">
                <span className="font-medium tracking-[-0.01em] text-[#111111]">
                  {c.label}
                </span>
                <span className="text-xs font-medium text-[#111111]/55">
                  {countFor(c.value)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Full browsable grid — all prompts (or the filtered results) */}
      {searchText ? (
        <PromptCardList data={searchResult} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  )
}

export default Feed
