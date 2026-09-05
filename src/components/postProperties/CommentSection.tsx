import * as React from "react";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import CommentItem from "./CommentItem";
import CommentSectionSkeleton from "../Skeletons/CommentSectionSkeleton";

interface ICommentSectionProps {
  postId: number;
}
interface INewComment {
  content: string;
  parent_comment_id: number | null;
}

export interface IComment {
  post_id: number;
  user_id: string;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  id: number;
  username?: string;
}

const createComment = async (
  newComment: INewComment,
  postId: number,
  userId?: string,
) => {
  if (!userId) throw new Error("You must be logged in to comment");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: userId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<IComment[]> => {
  /*   const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
 */
  const { data, error } = await supabase.rpc("get_post_comments", {
    p_post_id: postId,
  });

  if (error) {
  throw new Error(error.message);
}

  return data as IComment[];
};

const CommentSection: React.FunctionComponent<ICommentSectionProps> = ({
  postId,
}) => {
  const [newComentText, setNewCommentText] = React.useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: INewComment) => {
      return createComment(newComment, postId, user?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!newComentText) return;
    mutate({ content: newComentText, parent_comment_id: null });
    setNewCommentText("");
  };

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<IComment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 15000, //10secs
  });

  const hasScrolled = React.useRef(false);

  React.useEffect(() => {
    if (hasScrolled.current) return;

    const hash = window.location.hash;
    if (!hash || isLoading) return;

    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start", 
      });
      hasScrolled.current = true;
    }
  }, [isLoading]);

  /* Map of Comments - Organize Replies - Return Tree  */
  const buildCommentTree = (
    flatComments: IComment[],
  ): (IComment & { children?: IComment[] })[] => {
    //map stores comments and commentID
    // comment migth also have a variable called children
    const map = new Map<number, IComment & { children?: IComment[] }>();
    const roots: (IComment & { children?: IComment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

 if (isLoading) {
  return <CommentSectionSkeleton />;
}
  if (error) {
    return <div> Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-10 border-t border-slate-800 pt-8">
      {/* Header */}
      <h3 className="text-xl font-semibold text-slate-200 mb-6">Comments</h3>

      {/* Comment Form */}
      {user ? (
        <form
          className="mb-6 p-4 rounded-xl border border-slate-700 bg-slate-900/60"
          onSubmit={handleSubmit}
        >
          <textarea
            className="w-full rounded-lg bg-slate-800 border border-slate-700
          px-3 py-2 text-slate-200 placeholder-slate-500
          focus:outline-none focus:ring-1 focus:ring-slate-500
          resize-none"
            rows={3}
            value={newComentText}
            placeholder="Write a comment..."
            required
            onChange={(e) => setNewCommentText(e.target.value)}
          />

          <div className="flex justify-end mt-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium
            bg-slate-700 text-slate-100 hover:bg-slate-600
            transition cursor-pointer"
              type="submit"
            >
              {isPending ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {isError && (
            <p className="text-rose-400 text-sm mt-2">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p className="mb-6 text-slate-400 text-sm">
          Log in to join the discussion
        </p>
      )}

      {/* Comment List */}
      <div className="space-y-5">
        {commentTree.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
