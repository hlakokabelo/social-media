import { supabase } from "../config/supabase-client";

export interface SearchResult {
  id: number|string;
  type: "post" | "community" | "user";
  title?: string;
  content?: string;
  name?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
  community_name?: string;
}

export const searchPosts = async (
  query: string,
  limit?: number
): Promise<SearchResult[]> => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const { data, error } = await supabase.rpc("search_posts", {
    search_query: searchTerm,
    result_limit: limit ?? 2000,
  });

  if (error) {
    console.error("Error searching posts:", error);
    throw error;
  }

  return data.map((post: any) => ({
    ...post,
    type: "post" as const,
  }))
};

export const searchCommunities = async (
  query: string
): Promise<SearchResult[]> => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .ilike("name", `%${searchTerm}%`)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error searching communities:", error);
    throw error;
  }

  return data.map((community) => ({
    ...community,
    type: "community" as const,
  }));
};

export const searchUsers = async (
  query: string
): Promise<SearchResult[]> => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", `%${searchTerm}%`)
    .order("username", { ascending: true });

  if (error) {
    console.error("Error searching users:", error);
    throw error;
  }

  return data.map((user) => ({
    ...user,
    type: "user" as const,
  }));
};

