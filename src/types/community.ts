export interface ICommunity {
  name: string;
  description: string;
  created_at: string;
  user_id?: string;
  creator?: { username: string };
  member_count?: number;
  id: number;
}

export interface IMemberInfo {
  id: number;
  joined_at: string;
  name: string;
  role: string;
}