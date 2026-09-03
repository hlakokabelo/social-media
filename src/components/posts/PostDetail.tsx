import * as React from "react";
import type { IPost } from "./PostList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import LikeButton from "../postsProperties/LikeButton";
import CommentSection from "../postsProperties/CommentSection";
import { formatTimeStamp } from "../../utils/formatTimeStamp";
import { Link, useNavigate } from "react-router";
import Loading from "../Loading";
import { FaUser, FaComment } from "react-icons/fa";
import PostNotFoud from "../../pages/PageNotFound";
import { routeBuilder, slugify } from "../../utils/routes";
import { ShareBtn } from "./ShareBtn";

import { PhotoProvider, PhotoView } from "react-photo-view";

interface IPostDetailProps {
  postId: number;
  slug: string | undefined;
}

type IPostCommunity = IPost & {
  community_name: string;
  community_id: number;
};

const fetchPostById = async (id: number): Promise<IPostCommunity> => {
  const { data, error } = await supabase.rpc("get_posts_with_post_id", {
    p_post_id: id,
  });

  if (error) throw new Error(error.message);

  return data[0] as IPostCommunity;
};

const PostDetail: React.FunctionComponent<IPostDetailProps> = ({
  postId,
  slug,
}) => {
  const navigate = useNavigate();

  if (isNaN(postId)) {
    return <PostNotFoud title="Post" />;
  }

  const { data, error, isLoading, isSuccess } = useQuery<
    IPostCommunity,
    Error
  >({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  React.useEffect(() => {
    if (isSuccess && data && slug !== slugify(data.title)) {
      const hash = window.location.hash;

      navigate(routeBuilder.post(postId) + `/${slugify(data.title)}${hash}`, {
        replace: true,
      });
    }
  }, [isSuccess, data, slug, postId, navigate]);

  if (isLoading) return <Loading title="Loading post" />;

  if (error) return <PostNotFoud title="Post" />;

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Post Card */}
      <div className="w-full max-w-3xl mx-auto group">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-sm p-6 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            {data?.avatar_url ? (
              <Link
                to={routeBuilder.user(data.username)}
                className="flex-shrink-0"
              >
                <img
                  src={data.avatar_url}
                  alt={data.username}
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
                  to={routeBuilder.user(data!.username)}
                  className="text-slate-200 font-semibold hover:text-white transition-colors text-base"
                >
                  u/{data?.username}
                </Link>

                {data?.community_id && (
                  <>
                    <span className="text-slate-600">•</span>

                    <Link
                      to={routeBuilder.community(
                        data.community_id,
                        data.community_name,
                      )}
                      className="text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium"
                    >
                      c/{data.community_name}
                    </Link>
                  </>
                )}
              </div>

              <span className="text-xs text-slate-500 mt-0.5">
                {formatTimeStamp(data!.created_at, false)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-100 mb-3 leading-tight">
            {data?.title}
          </h2>

      {/* Image */}
{data?.image_urls&&data?.image_urls?.length > 0 && (
  <div className="block mb-4">
    <PhotoProvider maskOpacity={0.9} speed={() => 300}>
     <div
  className={
    data.image_urls.length > 2
      ? "flex gap-2 overflow-x-auto scrollbar-small"
      : "block"
  }
>
        {data.image_urls.map((imageUrl, index) => (
          <PhotoView key={imageUrl} src={imageUrl}>
            <div
              className={
                data.image_urls.length > 2
                  ? "shrink-0 w-64 rounded-xl overflow-hidden bg-black cursor-zoom-in"
                  : "rounded-xl overflow-hidden bg-black cursor-zoom-in select-none"
              }
            >
              <img
                src={imageUrl}
                alt={`${data.title} - Image ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = "/images/image-fallback.jpg";
                }}
                className={
                  data.image_urls.length > 2
                    ? "w-full h-64 object-cover"
                    : "w-full h-auto max-h-[32rem] object-contain bg-black transition-transform duration-300 hover:scale-[1.01]"
                }
              />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  </div>
)}


          {/* Content */}
          <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
            {data?.content}
          </p>

          {/* Edited indicator */}
          {data?.edited && (
            <p className="text-xs italic text-blue-300/70 mb-4">
              edited
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-800 mt-2">
            <LikeButton
              item_id={postId}
              user_id={data?.user_id}
              refetchIntervalOn={false}
            />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400">
              <FaComment className="text-base" />

              <span className="text-sm font-medium">
                {data?.comment_count ?? 0}
              </span>
            </div>

            {/* Share Button */}
            {data && <ShareBtn post={data} />}
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={Number(postId)} />
    </div>
  );
};

export default PostDetail;