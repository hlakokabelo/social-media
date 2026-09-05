import * as React from "react";
import type { IComment } from "./CommentSection.tsx";
import { useAuth } from "../../context/AuthContext.tsx";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client.ts";
import { formatTimeStamp } from "../../utils/formatTimeStamp.ts";
import { useNavigate } from "react-router";
import { routeBuilder } from "../../utils/routes.ts";
import LikeButton from "./LikeButton.tsx";
import { encodeId } from "../../utils/idEncoder.ts";

type ICommentChild = IComment & { children?: IComment[] };

interface ICommentItemProps {
  comment: IComment & { children?: ICommentChild[] };
  postId: number;
}
interface IReplyComment {
  content: string;
  parent_comment_id: number | null;
}

const hashCommentId = (id: number): string => {
  return `#comment-${encodeId(id)}`;
};

/**
 * makes sure that if a comment is hashed, its parent comments are not collapsed.
 * It also ensures that the comment is highlighted by giving it a different style.
 */
const handleHashedComment = (comment: ICommentChild): boolean => {
  const isHighlighted = window.location.hash === hashCommentId(comment.id);

  if (isHighlighted) return true;
  else if (comment.children) {
    let value = false;
    for (const child of comment.children) {
      value = window.location.hash === hashCommentId(child.id);

      if (value) break;
      else if (handleHashedComment(child)) {
        value = true;
      }
    }
    return value;
    // Output: 1, 2
  }

  return false;
};
const createReply = async (
  newReply: IReplyComment,
  postId: number,
  userId?: string,
) => {
  if (!userId) throw new Error("You must be logged in to reply");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: userId,
    content: newReply.content,
    parent_comment_id: newReply.parent_comment_id,
  });

  if (error) throw new Error(error.message);
};
const CommentItem: React.FunctionComponent<ICommentItemProps> = ({
  comment,
  postId,
}) => {
  const [showReply, setShowReply] = React.useState<boolean>(false);
  const [replyText, setReplyText] = React.useState<string>(""); 

  /**ensures that the first comments of root comment are shown */
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(
    comment.parent_comment_id ? false : true,
  );
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: IReplyComment) => {
      return createReply(newComment, postId, user?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      setReplyText("");
      setShowReply(false);
      setIsCollapsed(true);
    },
  });

  const handleReplySubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!replyText) return;
    mutate({ content: replyText, parent_comment_id: comment.id });
  };

  const isHighlighted = window.location.hash === hashCommentId(comment.id);
  React.useEffect(() => {
    //parent comment collapse is true by default so ignore
    if (window.location.hash && comment.parent_comment_id) {
      const val = handleHashedComment(comment);
      setIsCollapsed(val);
    }
  }, []);

const handleReply = () => {
  if (!user) {
    toast.error(
      `Oops — you’ll need to sign in to reply`
    );
    return;
  }

  setShowReply((prev) => !prev);
};

  return (
    <div
      id={`comment-${encodeId(comment.id)}`}
      className={`border-l rounded-lg p-4 ${
        isHighlighted
          ? "border-purple-500 ring-1 ring-purple-500"
          : "border-l-zinc-700"
      }`}
    >
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          {/**Display commenter username */}
          <span
            onClick={() =>
              comment?.username && navigate(routeBuilder.user(comment.username))
            }
            className="cursor-pointer text-sm font-bold text-blue-400 hover:text-yellow-500"
          >
            {comment?.username}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimeStamp(comment?.created_at)}
          </span>
        </div>
        <p className="text-gray-300 wrap-anywhere">{comment.content}</p>

        {/*   Like button    */}
        <LikeButton
          isComment={true}
          item_id={comment.id}
          user_id={comment.user_id}
        />
        <button
          className="text-amber-500 text-sm mt-1 cursor-pointer"
          onClick={handleReply}
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
      </div>

      {showReply && user && (
        <form className="mb-2" onSubmit={handleReplySubmit}>
          <textarea
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            rows={2}
            value={replyText}
            placeholder="write reply..."
            required
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            className="mt-1 bg-purple-500 text-white px-3 py-1 rounded cursor-pointer hover:text-amber-200"
            type="submit"
          >
            {isPending ? "Replying" : "Post reply"}
          </button>
          {isError && <p className="text-red-500">Error posting reply.</p>}
        </form>
      )}
      {comment.children && comment.children.length > 0 && (
        <div>
          <button
            className=""
            title={isCollapsed ? "Hide Replies" : "Show Replies"}
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
                color="green"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                color="red"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
          </button>
          {isCollapsed && (
            <div className="space-y-3 pl-2">
              {comment.children.map((childComment) => (
  <CommentItem
    key={childComment.id}
    comment={childComment}
    postId={postId}
  />
))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
