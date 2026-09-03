import * as React from "react";
import type { IPost } from "./PostList";
import { Link } from "react-router";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { FaUser, FaComment } from "react-icons/fa";
import { routeBuilder } from "../../utils/routes";
import { ShareBtn } from "./ShareBtn";
import LikeButton from "../postsProperties/LikeButton";

interface IPostItemProps {
  post: IPost & { community_name?: string; community_id?: number };
  calledByCommunityComponent?: boolean;
}

const PostItem: React.FunctionComponent<IPostItemProps> = ({
  post,
  calledByCommunityComponent = false,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-6 group">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-sm p-6 transition-all duration-300 ">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {post.avatar_url ? (
            <Link
              to={routeBuilder.user(post.username)}
              className="flex-shrink-0"
            >
              <img
                src={post.avatar_url}
                alt={post.username}
                  onError={(e) => {
    e.currentTarget.src = "/images/image-fallback.jpg";
  }}

                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 hover:ring-slate-500 transition-all"
              />
            </Link>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-slate-700">
              <FaUser className="text-slate-300 text-lg" />
            </div>
          )}

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={routeBuilder.user(post.username)}
                className="text-slate-200 font-semibold hover:text-white transition-colors text-base"
              >
                u/{post.username}
              </Link>

              {!calledByCommunityComponent && post.community_id && (
                <>
                  <span className="text-slate-600">•</span>
                  <Link
                    to={routeBuilder.community(
                      post.community_id,
                      post.community_name,
                    )}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium"
                  >
                    c/{post.community_name}
                  </Link>
                </>
              )}
            </div>

            <span className="text-xs text-slate-500 mt-0.5">
              {formatTimeStamp(post.created_at, false)}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={routeBuilder.post(post.id, post.title)}>
          <h2 className="text-2xl font-bold text-slate-100 mb-3 hover:text-white transition-colors leading-tight">
            {post.title}
          </h2>
        </Link>

        {/* Image */}
        {/* Images */}
{post.image_urls?.length > 0 && (
  <Link
    to={routeBuilder.post(post.id, post.title)}
    className="block mb-4"
  >
    <div
      className={
        post.image_urls.length > 1
          ? "flex gap-2 overflow-x-auto scrollbar-small"
          : "block"
      }
    >
      {post.image_urls.map((imageUrl, index) => (
        <div
          key={imageUrl}
          className={
            post.image_urls.length > 1
              ? "shrink-0 w-64 rounded-xl overflow-hidden bg-black"
              : "rounded-xl overflow-hidden bg-black max-h-[80vh]"
          }
        >
          <img
            src={imageUrl}
            alt={`${post.title} - Image ${index + 1}`}
            onError={(e) => {
              e.currentTarget.src = "/images/image-fallback.jpg";
            }}
            className={
              post.image_urls.length > 1
                ? "w-full h-64 object-cover"
                : "w-full h-auto max-h-[80vh] object-contain"
            }
          />
        </div>
      ))}
    </div>
  </Link>
)}

        {/* Action Buttons */}
        <div className="flex items-center gap-6 pt-2 border-t border-slate-800 mt-4">
          <LikeButton
            item_id={post.id}
            user_id={post.user_id}
            refetchIntervalOn={false}
          />

          <Link
            to={routeBuilder.post(post.id, post.title)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
          >
            <FaComment className="text-base" />
            <span className="text-sm font-medium">
              {post.comment_count ?? 0}
            </span>
          </Link>

          {/* Share Button with Menu */}
          <ShareBtn post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostItem;
