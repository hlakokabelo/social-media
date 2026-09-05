import type { PostWithCommunity } from "../components/community/CommunityDisplay";
import { supabase } from "../config/supabase-client";
import type { ICommunity, IMemberInfo } from "../types/community";


export const getUserCommunities = async (): Promise<IMemberInfo[]> => {
  const { error, data } = await supabase.rpc("get_user_communities");
  if (error) throw new Error(error?.message);
  return data as IMemberInfo[];
};

export const fetchCommunities = async (): Promise<ICommunity[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error?.message);
  return data as ICommunity[];
};

export const joinCommunity = async ({
  communityId,
  userId,
}: {
  communityId: number;
  userId: string;
}) => {
  const { error, status, data } = await supabase
    .from("community_members")
    .insert({
      community_id: communityId,
      user_id: userId,
      role: "member",
      joined_at: new Date().toISOString(),
    });

  console.log({ status, data });
  if (error) throw new Error(error.message);
};

export const leaveCommunity = async ({
  communityId,
  userId,
}: {
  communityId: number;
  userId: string;
}) => {
  const { error } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};


export const fetchCommunityData = async (
  communityId: number,
): Promise<ICommunity> => {
  const { data, error } = await supabase
    .rpc("community_with_creator", { p_community_id: communityId })
    .single();

  if (error) throw new Error(error.message);
  return data as ICommunity;
};

export const fetchCommunityPost = async (
  communityId: number,
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_community_meta", {
    p_community_id: communityId,
  });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};

export const checkMembership = async (
  communityId: number,
  userId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("community_members")
    .select("*")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return !!data;
};


