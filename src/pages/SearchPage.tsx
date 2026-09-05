import * as React from "react";
import { Link } from "react-router";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  searchCommunities,
  searchPosts,
  searchUsers,
  type SearchResult,
} from "../services/search";
import { routeBuilder } from "../utils/routes";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import SearchLoading from "../components/skeleton/SearchLoading";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = React.useState<
    "all" | "posts" | "communities" | "users"
  >("all");

  const { data: postsQuery, isLoading: postsQueryLoading } = useQuery({
    queryKey: ["search-posts", query],
    queryFn: () => searchPosts(query),
    enabled: !!query,
  });

  const { data: communitiesQuery, isLoading: communitiesQueryLoading } =
    useQuery({
      queryKey: ["search-communities", query],
      queryFn: () => searchCommunities(query),
      enabled: !!query,
    });

  const { data: usersQuery, isLoading: usersQueryLoading } = useQuery({
    queryKey: ["search-users", query],
    queryFn: () => searchUsers(query),
    enabled: !!query,
  });

  const isLoading =
    usersQueryLoading || communitiesQueryLoading || postsQueryLoading;

  if (isLoading) return <SearchLoading />;

  let postsResults: SearchResult[] = [];
  let communitiesResults: SearchResult[] = [];
  let usersResults: SearchResult[] = [];

  if (activeTab === "all") {
    postsResults = postsQuery?.slice(0, 5) ?? [];
    communitiesResults = communitiesQuery?.slice(0, 5) ?? [];
    usersResults = usersQuery?.slice(0, 5) ?? [];
  } else if (activeTab === "posts") {
    postsResults = postsQuery ?? [];
  } else if (activeTab === "communities") {
    communitiesResults = communitiesQuery ?? [];
  } else if (activeTab === "users") {
    usersResults = usersQuery ?? [];
  }

  const resultsLength =
    postsResults.length + communitiesResults.length + usersResults.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Search</h1>

        {query ? (
          <p className="text-gray-400 mt-1">
            Results for{" "}
            <span className="text-white font-medium">"{query}"</span>
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
              setActiveTab(tab.key as "all" | "posts" | "communities" | "users")
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
        ) : resultsLength === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No results found</p>
            <p className="text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <>
            {/* MORE POSTS */}
            {activeTab === "all" && (
              <div className="w-full py-3 text-white">Posts</div>
            )}
            {/* POSTS */}
            {postsResults.map((post) => {
              return (
                <Link
                  key={`${post.type}-${post.id}`}
                  to={routeBuilder.post(post.id as number, post.title)}
                  className="block p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={post.avatar_url}
                      alt={post.username}
                      className="w-8 h-8 rounded-full"
                    />

                    <div className="text-sm">
                      <span className="text-white hover:text-blue-400">
                        u/{post.username}
                      </span>

                      <span className="text-gray-500 mx-2">•</span>

                      <span className="text-gray-500">
                        {formatTimeStamp(post.created_at!)}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-lg font-semibold text-white mb-1">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {post.content}
                  </p>

                  {post.community_name && (
                    <p className="text-blue-400 text-xs mt-3">
                      r/{post.community_name}
                    </p>
                  )}
                </Link>
              );
            })}

            {/* MORE POSTS */}
            {activeTab === "all" && postsQuery && postsQuery.length > 5 && (
              <button
                onClick={() => setActiveTab("posts")}
                className="w-full py-3 cursor-pointer text-blue-400 hover:text-blue-300 transition"
              >
                See more posts →
              </button>
            )}

            {/* COMMUNITIES */}
            {activeTab === "all" && (
              <div className="w-full py-3 text-white">Communities</div>
            )}
            {communitiesResults.map((community) => {
              return (
                <Link
                  key={`${community.type}-${community.id}`}
                  to={routeBuilder.community(
                    community.id as number,
                    community.name,
                  )}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                    👥
                  </div>

                  <div>
                    <h2 className="text-white font-semibold">
                      r/{community.name}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      {community.content}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* MORE communities */}
            {activeTab === "all" &&
              communitiesQuery &&
              communitiesQuery.length > 5 && (
                <button
                  onClick={() => setActiveTab("communities")}
                  className="w-full cursor-pointer py-3 text-blue-400 hover:text-blue-300 transition"
                >
                  See more communities →
                </button>
              )}

            {/* USERs */}
            {activeTab === "all" && (
              <div className="w-full py-3 text-white">Users</div>
            )}
            {usersResults.map((user) => {
              return (
                <Link
                  key={`${user.type}-${user.id}`}
                  to={routeBuilder.user(user.username)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition"
                >
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />

                  <div>
                    <h2 className="text-white font-semibold">{user.name}</h2>

                    <p className="text-gray-400 text-sm">u/{user.username}</p>
                  </div>
                </Link>
              );
            })}

            {/* MORE users */}
            {activeTab === "all" && usersQuery && usersQuery?.length > 5 && (
              <button
                onClick={() => setActiveTab("users")}
                className="w-full cursor-pointer py-3 text-blue-400 hover:text-blue-300 transition"
              >
                See more users →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
