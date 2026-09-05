import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../../config/supabase-client";
import { useAuth } from "../../context/AuthContext";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router";
import { ROUTES } from "../../utils/routes";
import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import toast from "react-hot-toast";

interface ILikeButtonProps {
  isComment?: boolean;
  item_id: number;
  user_id: string | undefined;
  refetchIntervalOn?: boolean;
}
interface IVote {
  id: number;
  post_id?: number;
  comment_id?: number;
  user_id: string;
  vote: number;
}

const submitVote = async (
  voteValue: number,
  itemIdValue: number,
  userId: string,
  isComment: boolean,
) => {
  const itemColumn = isComment ? "comment_id" : "post_id";
  const table = isComment ? "comment_votes" : "votes";

  const { data: existingVote } = await supabase
    .from(table)
    .select("*")
    .eq(itemColumn, itemIdValue)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      // delete
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      // update
      const { error } = await supabase
        .from(table)
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    // insert
    const { error } = await supabase.from(table).insert({
      [itemColumn]: itemIdValue,
      vote: voteValue,
      user_id: userId,
    });

    if (error) throw new Error(error.message);
  }
};

const deletePostOrComment = async (item_id: number, isComment: boolean) => {
  const table = isComment ? "comments" : "posts";

  const { error } = await supabase.from(table).delete().eq("id", item_id);

  if (error) throw new Error(error.message);
};

const fetchVotes = async (
  item_id: number,
  isComment: boolean,
): Promise<IVote[]> => {
  const table = isComment ? "comment_votes" : "votes";
  const column = isComment ? "comment_id" : "post_id";

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(column, item_id);

  if (error) throw new Error(error.message);

  return data as IVote[];
};

/** Displays likes of an item either a comment or post */
const LikeButton: React.FunctionComponent<ILikeButtonProps> = ({
  item_id,
  user_id,
  isComment = false,
  refetchIntervalOn = true,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const queryKey: unknown[] = [
    `${isComment ? "comment" : "post"}`,
    "votes",
    item_id,
  ];

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to vote!");
      return submitVote(voteValue, item_id, user.id, isComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const { mutate: deleteItemMutate } = useMutation({
    mutationFn: () => {
      return deletePostOrComment(item_id, isComment);
    },
    onSuccess: () => {
      //if its a post deleted go home, else stay where you are
      if (!isComment) navigate(ROUTES.HOME);
    },
  });

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<IVote[], Error>({
    queryKey: queryKey,
    queryFn: () => fetchVotes(item_id, isComment),
    refetchInterval: refetchIntervalOn ? 15000 : false, //10secs
  });

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const submitLike = (like: number) => {
    if (user ? false : true) {
      toast.error(
        `Oops — log in to like`);
      return;
    }
    mutate(like);
  };

  const deletHandle = () => {
    deleteItemMutate();
  };
  // establish upvote and downvote count
  const dislikes = votes?.filter((vote) => vote.vote === -1).length || 0;
  const likes = votes?.filter((vote) => vote.vote === 1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className={`${isComment ? "text-[12px]" : ""}`}>
      <div className="flex items-center space-x-4 my-4">
        <div className="flex flex-row items-center gap-0.5">
          <button
            onClick={() => submitLike(1)}
            className={`p-1.5 cursor-pointer rounded-full transition-colors duration-150 ${
              userVote === 1
                ? "text-orange-500 hover:text-orange-900 hover:bg-gray-100"
                : "text-gray-500 hover:text-orange-500 hover:bg-gray-100"
            }`}
          >
            <BiSolidUpvote className="text-xl" />
          </button>

          <span
            className={`text-xs font-bold ${
              userVote === 1
                ? "text-orange-500"
                : userVote === -1
                  ? "text-blue-600"
                  : "text-gray-500"
            }`}
          >
            {likes - dislikes}
          </span>

          <button
            onClick={() => submitLike(-1)}
            className={`p-1.5 cursor-pointer rounded-full transition-colors duration-150 ${
              userVote === -1
                ? "text-blue-600 hover:text-blue-900 hover:bg-gray-100"
                : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            <BiSolidDownvote className="text-xl" />
          </button>
        </div>

        {user && user?.id === user_id && (
          <div
            className="ml-5.5 cursor-pointer"
            title="delete"
            onClick={deletHandle}
          >
            <MdDeleteForever
              className="text-red-500 hover:text-red-800"
              size={isComment ? 17 : 25}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeButton;
