import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IPost } from "../posts/PostList";
import PostItem from "../posts/PostItem";
import PostNotFoud from "../../pages/PageNotFound";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { useNavigate } from "react-router";
import { routeBuilder, slugify } from "../../utils/routes";
import { useAuth } from "../../context/AuthContext";
import { checkMembership, fetchCommunityData, fetchCommunityPost, joinCommunity, leaveCommunity } from "../../services/community";
import type { ICommunity } from "../../types/community";
import CommunityDisplaySkeleton from "../Skeletons/CommunityDisplaySkeleton";

interface ICommunityDisplayProps {
  communityId: number;
  slug: string | undefined;
}

export interface PostWithCommunity extends IPost {
  communities: {
    name: string;
  };
}

const CommunityDisplay: React.FunctionComponent<ICommunityDisplayProps> = ({
  communityId,
  slug,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  if (isNaN(communityId)) {
    return <PostNotFoud title="Community" />;
  }

 const {
  data: CommunityData,
  error: CommunityError,
  isLoading: communityLoading,
} = useQuery<ICommunity, Error>({
  queryKey: ["community", communityId],
  queryFn: () => fetchCommunityData(communityId),
});

  const { data: isMember, isLoading: isCheckingMembership } = useQuery({
    queryKey: ["isMember", communityId, user?.id],
    queryFn: () => checkMembership(communityId, user?.id!),
    enabled: !!user,
  });

  const { data: posts, isLoading: postsLoading } = useQuery<
    PostWithCommunity[],
    Error
  >({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isMember", communityId, user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isMember", communityId, user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  // Handle slug redirect
  React.useEffect(() => {
    if (CommunityData && !postsLoading) {
      const correctSlug = slugify(CommunityData.name);
      if (slug !== correctSlug) {
        navigate(routeBuilder.community(communityId) + `/${correctSlug}`, {
          replace: true,
        });
      }
    }
  }, [CommunityData, slug, communityId, navigate, postsLoading]);

  const handleJoinLeave = () => {
    if (!user) {
      setErrorMessage("Please log in to join this community");
      return;
    }

    if (isMember) {
      if (window.confirm("Are you sure you want to leave this community?")) {
        leaveMutation.mutate({ communityId, userId: user.id });
      }
    } else {
      joinMutation.mutate({ communityId, userId: user.id });
    }
  };

const isLoading =
  communityLoading ||
  postsLoading ||
  isCheckingMembership;
if (isLoading) {
  return <CommunityDisplaySkeleton/>;
}

  if (CommunityError) return <PostNotFoud title="Community" />;

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Community Header */}
      <div className="p-6 rounded-xl border border-slate-700 bg-linear-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-slate-100">
            c/{CommunityData?.name}
          </h2>

          {user && (
            <button
              onClick={handleJoinLeave}
              disabled={joinMutation.isPending || leaveMutation.isPending}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  isMember
                    ? "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-800/50"
                    : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-800/50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {joinMutation.isPending
                ? "Joining..."
                : leaveMutation.isPending
                  ? "Leaving..."
                  : isMember
                    ? "Leave"
                    : "Join"}
            </button>
          )}
        </div>

        {CommunityData?.description && (
          <p className="text-slate-300 mb-6 text-lg leading-relaxed">
            {CommunityData.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              created{" "}
              {CommunityData && formatTimeStamp(CommunityData.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>
              created by{" "}
              <button
                onClick={() =>
                  CommunityData?.creator!.username &&
                  navigate(routeBuilder.user(CommunityData.creator.username))
                }
                className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
              >
                u/{CommunityData?.creator!.username}
              </button>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 ml-auto">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-slate-300 font-semibold">
              {CommunityData?.member_count || 0}
            </span>
            <span className="text-slate-500">
              member{CommunityData?.member_count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-800/50">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-200 px-1">Posts</h3>

        {posts ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                calledByCommunityComponent={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/30">
            <p className="text-slate-400">No posts in this community yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDisplay;
