import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import { Link } from "react-router";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import type { IComment } from "../postsProperties/CommentSection";
import type { IPost } from "../posts/PostList";
import { routeBuilder } from "../../utils/routes";
import Loading from "../Loading";

interface Props {
  userId: string;
}

type ICommentReply = IComment & { posts: IPost };

const fetchUserReplies = async (userId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      posts (
        id,
        content
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as ICommentReply[];
};

const UserReplies: React.FC<Props> = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userReplies", userId],
    queryFn: () => fetchUserReplies(userId),
  });

  if (isLoading)
    return <div className="text-zinc-400 mt-4"><Loading/></div>;
  if (error) return <p className="text-red-400 mt-4">Error loading replies.</p>;

  if (!data?.length)
    return <p className="text-zinc-400 mt-4">No replies yet.</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {data.map((reply: ICommentReply) => (
        <div key={reply.id}>
          <Link to={routeBuilder.hashComment(reply.posts.id, reply.id)}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 cursor-pointer hover:border-blue-600 ">
              <p className="text-white">{reply.content}</p>

              <p className="text-xs text-zinc-500 mt-2">
                Reply to: {reply.posts?.content?.slice(0, 50)}...
              </p>
              <p className="text-xs text-zinc-400 mt-2 ">
                {formatTimeStamp(reply.created_at)}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
export default UserReplies;
