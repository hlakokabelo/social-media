import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { Link } from "react-router";
import type { IPost } from "../posts/PostList";
import { routeBuilder } from "../../utils/routes";
import UserLikesSkeleton from "../Skeletons/UserLikesSkeleton";

interface Props {
  userId: string;
}
interface IVotes {
  created_at: string;
  id: number;
  posts: IPost;
  user_id: string;
  vote: number;
}

const fetchUserLikes = async (userId: string) => {
  const { data, error } = await supabase
    .from("votes")
    .select(
      `*,
      posts (
        id,
        title,
        content,
        created_at
      )
    `,
    )
    .eq("user_id", userId)

    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as IVotes[];
};

const UserLikes: React.FC<Props> = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userLikes", userId],
    queryFn: () => fetchUserLikes(userId),
  });

if (isLoading) return <UserLikesSkeleton />;
  if (error) return <p className="text-red-400 mt-4">Error loading likes.</p>;

  if (!data?.length)
    return <p className="text-zinc-400 mt-4">No liked posts yet.</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {data.map((like: IVotes) => (
        <div key={like.id}>
          <Link to={routeBuilder.post(like.posts.id, like.posts.title)}>
            <div className="cursor-pointer bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:border-green-600">
              <p className="text-white">{like.posts?.title}</p>

              <p>
                <span
                  className={
                    like.vote === 1 ? "text-green-500" : "text-red-500"
                  }
                >
                  {like.vote === 1 ? "up-voted on:" : "down-voted on:"}{" "}
                </span>
                {formatTimeStamp(like.created_at)}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UserLikes;
