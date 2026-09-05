import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatErrorMessage } from "../../utils/formatErrorMessage";
import { useAuth } from "../../context/AuthContext";
import DiscoverCommunities from "./DiscoverCommunities";
import MyCommunities from "./MyCommunitiesDisplay";
import { fetchCommunities, getUserCommunities, joinCommunity, leaveCommunity } from "../../services/community";
import type { ICommunity, IMemberInfo } from "../../types/community";
import CommunityListSkeleton from "../Skeletons/CommunityListSkeleton";

interface ICommunityListProps {}

type TabType = "my-communities" | "discover";

const CommunityList: React.FunctionComponent<ICommunityListProps> = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<TabType>("discover");

  const {
  data: communities,
  error,
  isLoading: isLoadingCommunities,
} = useQuery<ICommunity[], Error>({
  queryKey: ["communities"],
  queryFn: fetchCommunities,
});

const {
  data: userCommunities,
  isLoading: isLoadingUserCommunities,
} = useQuery<IMemberInfo[], Error>({
  queryKey: ["memberInfo", user?.id],
  queryFn: getUserCommunities,
  enabled: !!user,
});

const isLoading =
  isLoadingCommunities || isLoadingUserCommunities;
  
  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberInfo", user?.id] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberInfo", user?.id] });
    },
  });


  const handleJoinCommunity = async (
    e: React.MouseEvent,
    communityId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    joinMutation.mutate({ communityId, userId: user.id });
  };

  const handleLeaveCommunity = async (
    e: React.MouseEvent,
    communityId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

      leaveMutation.mutate({ communityId, userId: user.id });
    
  };

  const myCommunities = React.useMemo(() => {
    if (!communities || !userCommunities) return [];
    return communities.filter((community) =>
      userCommunities.some((userComm) => userComm.id === community.id),
    );
  }, [communities, userCommunities]);

  const discoverCommunities = React.useMemo(() => {
    if (!communities || !userCommunities) return communities || [];
    return communities.filter(
      (community) =>
        !userCommunities.some((userComm) => userComm.id === community.id),
    );
  }, [communities, userCommunities]);

if (isLoading) return <CommunityListSkeleton />;
  if (error) {
    return (
      <div className="text-center text-red-400">
        {formatErrorMessage(error.message)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Tabs */}
      {user && (
        <div className="flex gap-4 border-b border-slate-700 mb-6">
          <button
            onClick={() => setActiveTab("discover")}
            className={`pb-2 px-4 font-medium transition-colors relative
              ${
                activeTab === "discover"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
          >
            Discover
            {discoverCommunities.length > 0 && activeTab !== "discover" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("my-communities")}
            className={`pb-2 px-4 font-medium transition-colors relative
              ${
                activeTab === "my-communities"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
          >
            My Communities
            <span className="ml-2 text-sm text-slate-500">
              ({myCommunities.length})
            </span>
          </button>
        </div>
      )}

      {/* Community Grid */}
      <div className="space-y-4">
        {!user && (
          <div className="text-center py-8 text-slate-400">
            Sign in to join communities
          </div>
        )}

        {activeTab === "my-communities" && (
          <>
            {myCommunities.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                You haven't joined any communities yet.{" "}
                <button
                  onClick={() => setActiveTab("discover")}
                  className="text-emerald-400 hover:underline"
                >
                  Discover communities
                </button>
              </div>
            ) : (
              <MyCommunities
                communities={myCommunities}
                userCommunities={userCommunities || []}
                user={user}
                onLeaveCommunity={handleLeaveCommunity}
                onDiscoverClick={() => setActiveTab("discover")}
                isJoinPending={joinMutation.isPending}
                isLeavePending={leaveMutation.isPending}
              />
            )}
          </>
        )}

        {activeTab === "discover" && (
          <>
            {discoverCommunities.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No new communities to discover!
              </div>
            ) : (
              <DiscoverCommunities
                communities={discoverCommunities}
                user={user}
                onJoinCommunity={handleJoinCommunity}
                isJoinPending={joinMutation.isPending}
                isLeavePending={leaveMutation.isPending}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityList;
