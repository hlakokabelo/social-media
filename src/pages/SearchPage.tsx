import * as React from "react";
import { Link } from "react-router";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { searchCommunities, searchPosts, searchUsers } from "../services/search";


interface SearchResult {
  id: number;
  type: "post" | "community" | "user";
  title?: string;
  content?: string;
  name?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
  community_name?: string;
}

// Mock data
const mockResults: SearchResult[] = [
  {
    id: 1,
    type: "post",
    title: "Learning React and TypeScript",
    content:
      "I've been working on a React project recently and TypeScript has made things much easier to manage.",
    username: "kabelo",
    avatar_url: "https://i.pravatar.cc/100?img=12",
    created_at: "2 hours ago",
    community_name: "Programming",
  },
  {
    id: 2,
    type: "post",
    title: "What is your favourite JavaScript framework?",
    content:
      "React, Vue, Angular or something else? What are you currently using?",
    username: "devguy",
    avatar_url: "https://i.pravatar.cc/100?img=5",
    created_at: "5 hours ago",
    community_name: "Web Development",
  },
  {
    id: 3,
    type: "community",
    name: "Programming",
    content: "A community for programmers and software developers.",
  },
  {
    id: 4,
    type: "community",
    name: "Web Development",
    content: "Discuss frontend, backend and full-stack web development.",
  },
  {
    id: 5,
    type: "user",
    username: "kabelo",
    name: "Kabelo Hlako",
    avatar_url: "https://i.pravatar.cc/100?img=12",
  },
];

const SearchPage = () => {
  const [searchParams] =  useSearchParams();

  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = React.useState<
    "all" | "posts" | "communities" | "users"
  >("all");

  const filteredResults = mockResults.filter((result) => {
    if (activeTab === "posts") return result.type === "post";
    if (activeTab === "communities") return result.type === "community";
    if (activeTab === "users") return result.type === "user";

    return true;
  });

  const {data:postsQuery} = useQuery({
  queryKey: ["search-posts", query],
  queryFn: () => searchPosts(query),
  enabled: !!query,
});

const {data:communitiesQuery} = useQuery({
  queryKey: ["search-communities", query],
  queryFn: () => searchCommunities(query),
  enabled: !!query,
});

const {data:usersQuery} = useQuery({
  queryKey: ["search-users", query],
  queryFn: () => searchUsers(query),
  enabled: !!query,
});


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Search
        </h1>

        {query ? (
          <p className="text-gray-400 mt-1">
            Results for{" "}
            <span className="text-white font-medium">
              "{query}"
            </span>
          </p>
        ) : (
          <p className="text-gray-400 mt-1">
            Search posts, communities and users.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 mb-6 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "posts", label: "Posts" },
          { key: "communities", label: "Communities" },
          { key: "users", label: "Users" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(
                tab.key as "all" | "posts" | "communities" | "users"
              )
            }
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {!query ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Search for something</p>
            <p className="text-sm mt-1">
              Try searching for a post, community or user.
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No results found</p>
            <p className="text-sm mt-1">
              Try a different search term.
            </p>
          </div>
        ) : (
          filteredResults.map((result) => {
            {/* POST */}
            if (result.type === "post") {
              return (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={""}
                  className="block p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={result.avatar_url}
                      alt={result.username}
                      className="w-8 h-8 rounded-full"
                    />

                    <div className="text-sm">
                      <span className="text-white">
                        u/{result.username}
                      </span>

                      <span className="text-gray-500 mx-2">
                        •
                      </span>

                      <span className="text-gray-500">
                        {result.created_at}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-lg font-semibold text-white mb-1">
                    {result.title}
                  </h2>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {result.content}
                  </p>

                  {result.community_name && (
                    <p className="text-blue-400 text-xs mt-3">
                      r/{result.community_name}
                    </p>
                  )}
                </Link>
              );
            }

            {/* COMMUNITY */}
            if (result.type === "community") {
              return (
                <Link
                  key={`${result.type}-${result.id}`}
                  to="#"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                    👥
                  </div>

                  <div>
                    <h2 className="text-white font-semibold">
                      r/{result.name}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      {result.content}
                    </p>
                  </div>
                </Link>
              );
            }

            {/* USER */}
            return (
              <Link
                key={`${result.type}-${result.id}`}
                to="#"
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition"
              >
                <img
                  src={result.avatar_url}
                  alt={result.username}
                  className="w-12 h-12 rounded-full"
                />

                <div>
                  <h2 className="text-white font-semibold">
                    {result.name}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    u/{result.username}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchPage;