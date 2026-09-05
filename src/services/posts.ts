import type { IPost } from "../components/posts/PostList";
import { supabase } from "../config/supabase-client";

export type IPostCommunity = IPost & {
  community_name: string;
  community_id: number;
};

export const fetchPostById = async (id: number): Promise<IPostCommunity> => {
  const { data, error } = await supabase.rpc("get_posts_with_post_id", {
    p_post_id: id,
  });

  if (error) throw new Error(error.message);

  return data[0] as IPostCommunity;
};

