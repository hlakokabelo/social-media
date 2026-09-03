import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../../config/supabase-client";
import { useAuth } from "../../context/AuthContext";
import { type IMemberInfo } from "../community/CommunityList";
import { useNavigate } from "react-router";
import { routeBuilder } from "../../utils/routes";
import toast from "react-hot-toast";

interface ICreatePostProps {}
let postId: number = 0;

interface IPostInput {
  title: string;
  content: string;
  imageFiles: File[];
  avatar_url: string | null;
  community_id?: number | null;
  user_id?: string | null;
}

const createPost = async (post: IPostInput) => {
  const image_urls: string[] = [];

  for (const imageFile of post.imageFiles) {
    const filePath = `${crypto.randomUUID()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: imageData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    image_urls.push(imageData.publicUrl);
  }

  const { imageFiles: _, ...payloadVariables } = post;

  const payload = {
    ...payloadVariables,
    image_urls,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  postId = data.id;
  return data;
};

const getUserCommunities = async (): Promise<IMemberInfo[]> => {
  const { error, data } = await supabase.rpc("get_user_communities");
  if (error) throw new Error(error?.message);
  return data as IMemberInfo[];
};

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const { user } = useAuth();
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const navigate = useNavigate();
  const clearForm = (): void => {
    setTitle("");
    setContent("");
    setSelectedFiles([]);
  };

  /** Community functionality*/
  const [communityId, setCommunityId] = React.useState<number | null>(null);

  const { data: communities } = useQuery<IMemberInfo[], Error>({
    queryKey: ["memberInfo", user?.id],
    queryFn: getUserCommunities,
  });

  const handleCommunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const { mutate, isError, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      clearForm();
      navigate(routeBuilder.post(postId, title));
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(files);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return toast.error("Log in to create post");

    return mutate({
      title,
      content,
      imageFiles: selectedFiles,
      avatar_url: user?.user_metadata.avatar_url || null,
      community_id: communityId,
      user_id: user.id,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-1 p-8 rounded-2xl 
  bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl"
    >
      <h2 className="text-4xl  font-bold mb-3 text-center bg-linear-to-r text-slate-200">
        Create New Post
      </h2>
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block font-medium text-gray-200">
          Title
        </label>

        <input
          type="text"
          value={title}
          disabled={!user}
          id="title"
          required
          maxLength={300}
          className="w-full rounded-lg bg-slate-700 border border-white/10 px-4 py-2 
      focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block font-medium text-gray-200">
          Content
        </label>

        <textarea
          id="content"
          rows={5}
          disabled={!user}
          value={content}
          className="w-full rounded-lg bg-slate-700 border border-white/10 px-4 py-2 
      focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {/* Community */}
      <label className="block font-medium text-gray-200">Community</label>
      <div className="relative">
        <select
          disabled={!user}
          className="w-full appearance-none bg-slate-800/80 border border-slate-700 
      text-slate-200 rounded-xl px-5 py-3.5 pr-12
      focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200 cursor-pointer
      hover:bg-slate-800 hover:border-slate-600"
          id="community"
          onChange={handleCommunityChange}
          defaultValue=""
        >
          <option value="" className="bg-slate-800 text-slate-400">
            {user ? "Select a community" : "Sign in to select a community"}
          </option>

          {communities?.length ? (
            communities.map((community) => (
              <option
                key={community.id}
                value={community.id}
                className="bg-slate-800 text-slate-200 py-2"
              >
                c/{community.name}
              </option>
            ))
          ) : (
            <option disabled className="bg-slate-800 text-slate-500">
              No communities available
            </option>
          )}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${!user ? "opacity-50" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Optional: Add placeholder text when no selection */}
        {!user && (
          <p className="mt-2 text-xs text-slate-500">
            Please sign in to join a community
          </p>
        )}
      </div>{" "}
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-200" htmlFor="image">
          Upload Image
        </label>

        <input
          id="image"
          disabled={!user}
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-lg bg-slate-700 border border-white/10 px-4 py-2 
      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
      file:bg-cyan-700 file:text-white hover:file:bg-cyan-500 disabled:cursor-not-allowed
      transition"
          onChange={handleFileChange}
        />
      </div>
      {/* Button */}
      <button
        className="w-full py-3 mt-2 rounded-lg font-semibold text-white 
    bg-cyan-700 cursor-pointer
    hover:scale-[1.02] active:scale-[0.98] 
    transition-transform shadow-lg"
        type="submit"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
      {isError && (
        <p className="text-center text-red-400">Error creating post</p>
      )}
    </form>
  );
};

export default CreatePost;