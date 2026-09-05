import { supabase } from "../config/supabase-client";

export const searchPosts = async (query: string,limit?:number) => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select(`*`)
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching posts:", error);
    throw error;
  }

  return data;
};

export const searchCommunities = async (query: string) => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const { data, error } = await supabase
    .from("communities")
    .select(`*`)
    .ilike("name", `%${searchTerm}%`)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error searching communities:", error);
    throw error;
  }

  return data;
};

export const searchUsers = async (query: string) => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`* `)
    .ilike("username", `%${searchTerm}%`)
    .order("username", { ascending: true });

  if (error) {
    console.error("Error searching users:", error);
    throw error;
  }

  return data;
};