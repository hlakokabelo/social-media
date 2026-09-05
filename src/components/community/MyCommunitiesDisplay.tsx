import * as React from "react";
import { Link } from "react-router";
import { FiSearch } from "react-icons/fi";
import { routeBuilder } from "../../utils/routes";
import type { ICommunity, IMemberInfo } from "../../types/community";

interface IMyCommunitiesProps {
  communities: ICommunity[];
  userCommunities: IMemberInfo[];
  user: any; // Replace 'any' with your User type
  onLeaveCommunity: (e: React.MouseEvent, communityId: number) => void;
  onDiscoverClick: () => void;
  isJoinPending: boolean;
  isLeavePending: boolean;
}

const MyCommunities: React.FunctionComponent<IMyCommunitiesProps> = ({
  communities,
  userCommunities,
  user,
  onLeaveCommunity,
  onDiscoverClick,
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
        You haven't joined any communities yet.{" "}
        <button
          onClick={onDiscoverClick}
          className="text-emerald-400 hover:underline"
        >
          Discover communities
        </button>
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
            placeholder="Search your communities..."
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
        filteredCommunities.map((community) => {
          const userCommunity = userCommunities.find(
            (uc) => uc.id === community.id
          );

          return (
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

                      {userCommunity?.role && (
                        <span className="text-xs text-slate-500 mt-1 inline-block">
                          Role: {userCommunity.role}
                        </span>
                      )}

                      {community.description && (
                        <div
                          className="text-slate-400 mt-2 text-sm
                            leading-relaxed line-clamp-2"
                        >
                          {community.description}
                        </div>
                      )}
                    </div>

                    {user && (
                      <button
                        onClick={(e) => onLeaveCommunity(e, community.id)}
                        disabled={isPending}
                        className="shrink-0 px-3 py-1 text-sm bg-red-600/20 
                          text-red-400 rounded-lg hover:bg-red-600/30 
                          transition-colors disabled:opacity-50 
                          disabled:cursor-not-allowed"
                      >
                        {isLeavePending ? "Leaving..." : "Leave"}
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyCommunities;