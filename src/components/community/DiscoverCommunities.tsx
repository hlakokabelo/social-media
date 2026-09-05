import * as React from "react";
import { Link } from "react-router";
import { routeBuilder } from "../../utils/routes";
import { FiSearch } from "react-icons/fi";
import type { ICommunity } from "../../types/community";

interface IDiscoverCommunitiesProps {
  communities: ICommunity[];
  user: any; // Replace 'any' with your User type
  onJoinCommunity: (e: React.MouseEvent, communityId: number) => void;
  isJoinPending: boolean;
  isLeavePending: boolean;
}

const DiscoverCommunities: React.FunctionComponent<
  IDiscoverCommunitiesProps
> = ({
  communities,
  user,
  onJoinCommunity,
  isJoinPending,
  isLeavePending,
}) => {
  const [search, setSearch] = React.useState("");

  const isPending = isJoinPending || isLeavePending;

  const filteredCommunities = communities.filter((community) => {
    const query = search.toLowerCase();

    return (
      community.name.toLowerCase().includes(query) ||
      community.description?.toLowerCase().includes(query)
    );
  });

  if (communities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        No communities to discover!
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="px-4 pt-4">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl
          border border-slate-700 bg-slate-900/70
          focus-within:border-slate-500 transition-colors"
        >
          <FiSearch className="text-slate-400 text-lg" />

          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-200
              placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Communities */}
      {filteredCommunities.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No matching communities found.
        </div>
      ) : (
        filteredCommunities.map((community) => (
          <div key={community.id}>
            <Link to={routeBuilder.community(community.id, community.name)}>
              <div
                className="p-5 m-4 rounded-xl border border-slate-700 bg-slate-900/60
                  hover:bg-slate-900/80 hover:-translate-y-0.5
                  transition-all duration-200"
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <div
                      className="text-xl font-semibold text-slate-200
                        hover:text-slate-100 truncate"
                    >
                      {community.name}
                    </div>

                    {community.description && (
                      <div
                        className="text-slate-400 mt-2 text-sm leading-relaxed line-clamp-2"
                      >
                        {community.description}
                      </div>
                    )}
                  </div>

                  {user && (
                    <button
                      onClick={(e) => onJoinCommunity(e, community.id)}
                      disabled={isPending}
                      className="shrink-0 px-3 py-1 text-sm bg-emerald-600/20 
                        text-emerald-400 rounded-lg hover:bg-emerald-600/30 
                        transition-colors disabled:opacity-50 
                        disabled:cursor-not-allowed"
                    >
                      {isJoinPending ? "Joining..." : "Join"}
                    </button>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default DiscoverCommunities;