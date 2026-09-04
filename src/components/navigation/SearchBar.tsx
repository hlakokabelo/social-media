// components/search/SearchBar.tsx

import * as React from "react";
import { useNavigate } from "react-router";

const SearchBar = () => {
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const location = window.location.pathname

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts, communities..."
          className="w-full rounded-full bg-gray-800/70 border border-gray-700
            pl-10 pr-4 py-2 text-sm text-white
            placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            focus:border-blue-500/50"
        />

        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
          />
        </svg>
      </div>
    </form>
  );
};

export default SearchBar;