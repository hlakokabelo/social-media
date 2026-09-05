import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import { Link } from "react-router";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import type { IPost } from "./PostList";
import { routeBuilder } from "../../utils/routes";
import { formatErrorMessage } from "../../utils/formatErrorMessage";
import UserPostsSkeleton from "../Skeletons/UserPostsSkeleton";

interface Props {
  userId: string;
}

const timeStamp = (post: IPost) => {
  //posted on : 16 Sep, 18:00
  //posted 18hrs ago
  const stamp = formatTimeStamp(post.created_at);
  return (
    "posted " +
    (stamp.includes("min") || stamp.includes("hr") ? "" : "on") +
    " " +
    stamp
  );
};
const fetchUserPosts = async (userId: string) => {
  const { data, error } = await supabase
    .rpc("get_posts_with_user_id", { p_user_id: userId })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const UserPosts: React.FC<Props> = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchUserPosts(userId),
  });


  if (isLoading) return <UserPostsSkeleton />;
  if (error)
    return (
      <p className="text-red-400 mt-4">{formatErrorMessage(error.message)}</p>
    );

  if (!data?.length) return <p className="text-zinc-400 mt-4">No posts yet.</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {data.map((post: IPost & { community_id: number }) => (
        <div
          key={post.id}
          className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:border-amber-300 "
        >
          <Link to={routeBuilder.post(post.id, post.title)}>
            <p className="text-shadow-amber-200 hover:text-blue-300">
              {post.title}
            </p>
          </Link>
          <div className="w-fit">
            {post.community_id && (
              <Link
                to={routeBuilder.community(
                  post.community_id,
                  post.community_name,
                )}
              >
                <p className="text-blue-300 w-fit hover:text-blue-600">
                  c/{post.community_name}
                </p>
              </Link>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-2">{timeStamp(post)} </p>
        </div>
      ))}
    </div>
  );
};

export default UserPosts;
