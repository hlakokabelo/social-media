import { useInfiniteQuery } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../../config/supabase-client";
import PostItem from "./PostItem";
import { useAuth } from "../../context/AuthContext";
import { formatErrorMessage } from "../../utils/formatErrorMessage";
import Loading from "../Loading";

interface IPostListProps {}

export interface IPost {
  id: number;
  title: string;
  content: string;
  image_url: string;
   image_urls: string[];
  avatar_url: string | null;
  created_at: string;
  comment_count?: number;
  like_count?: number;
  user_id?: string;
  username?: string;
  community_name?: string;
  edited?: boolean;
}

const fetchPosts = async ({
  pageParam,
  feedMode,
}: {
  pageParam: number;
  feedMode: string;
}) => {
  const limit = 10;
  const page = pageParam;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let query = supabase.rpc("get_posts_with_counts");

  if (feedMode === "fresh") {
    query = query.order("created_at", { ascending: false });
  }

  if (feedMode === "rising") {
    query = query
      .order("like_count", { ascending: false })
      .order("created_at", { ascending: false });
  }

  if (feedMode === "rising_comments") {
    query = query
      .order("like_count", { ascending: false })
      .order("created_at", { ascending: false })
      .order("comment_count", { ascending: false });
  }

  if (feedMode === "discussion") {
    query = query
      .order("comment_count", { ascending: false })
      .order("created_at", { ascending: false });
  }

  const { data, error } = await query.range(from, to);

  if (error) throw new Error(error?.message);
  return data;
};

const PostList: React.FunctionComponent<IPostListProps> = () => {
  const { feedMode } = useAuth();
  const { data,isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", feedMode],
      queryFn: ({ pageParam }) => fetchPosts({ pageParam, feedMode }),

      initialPageParam: 1,

      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length + 1 : undefined;

        return nextPage;
      },
    });

  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage]);

  const posts: IPost[] | undefined = data?.pages.flat();

  if(isLoading){
    return <Loading/>
  }
  if (error)
    return (
      <div className="text-center text-red-400">
        {formatErrorMessage(error.message)}
      </div>
    );

  return (
    <div className="md:flex md:flex-col md:items-center">
      {posts?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}

      <div ref={loadMoreRef}></div>

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-slate-400"></div>
        </div>
      )}
    </div>
  );
};

export default PostList;
