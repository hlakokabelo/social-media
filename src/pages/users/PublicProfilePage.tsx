import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { supabase } from "../../config/supabase-client";
import * as React from "react";
import UserPosts from "../../components/posts/UserPosts";
import UserReplies from "../../components/user/UserReplies";
import UserLikes from "../../components/user/UserLikes";
import { MdEdit } from "react-icons/md";
import { useAuth, type IUserProfile } from "../../context/AuthContext";
import { ROUTES } from "../../utils/routes";
import { formatErrorMessage } from "../../utils/formatErrorMessage";
import { useEffect } from "react";

import { PhotoProvider, PhotoView } from "react-photo-view";
import PublicProfileSkeleton from "../../components/Skeletons/PublicProfileSkeleton";

const PublicProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { username } = useParams();

  const [profile, setProfile] = React.useState<IUserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, SetErrorMessage] = React.useState("");
  const [notFound, setNotFound] = React.useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const legalTabs = ["posts", "replies", "likes"];

  const tab = legalTabs.includes(searchParams.get("tab") || "")
    ? searchParams.get("tab")
    : "posts";

  const handleTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        SetErrorMessage(formatErrorMessage(error.message));
        setLoading(false);
        return;
      }

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [username]);

 if (loading) {
  return <PublicProfileSkeleton />;
}

  if (errorMessage) {
    return (
      <div className="text-center text-red-400">
        {errorMessage}
      </div>
    );
  }

  if (notFound) {
    return (
      <div>
        <div className="flex justify-center mt-20">
          <div className="text-center bg-zinc-900 p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-white">
              User not found
            </h2>

            <p className="text-zinc-400 mt-2">
              The username "@{username}" does not exist.
            </p>

            <button
              onClick={() => navigate("/")}
              className="cursor-pointer mt-4 px-4 py-2 bg-purple-600 rounded-lg text-white"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center mt-12">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl max-w-md w-full">
          {user?.id === profile?.id && (
            <Link to={ROUTES.EDIT_PROFILE}>
              <div className="w-full flex justify-end relative">
                <p className="hover:text-green-400 cursor-pointer w-fit">
                  <MdEdit size={25} />
                </p>
              </div>
            </Link>
          )}

          <div className="flex flex-col items-center">
            {profile?.avatar_url && (
              <PhotoProvider maskOpacity={0.9}>
                <PhotoView src={profile.avatar_url}>
                  <img
                    src={profile.avatar_url}
                    className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 cursor-zoom-in transition-transform duration-300 hover:scale-[1.03]"
                    alt={`${profile.username} avatar`}
                      onError={(e) => {
    e.currentTarget.src = "/images/image-fallback.jpg";
  }}

                  />
                </PhotoView>
              </PhotoProvider>
            )}

            <h2 className="text-xl font-semibold mt-4">
              {profile?.display_name}
            </h2>

            <p className="text-zinc-400">
              @{profile?.username}
            </p>

            <p className="mt-4 text-center text-zinc-300">
              {profile?.bio}
            </p>
          </div>
        </div>
      </div>

      {profile && (
        <div>
          <div className="flex justify-center gap-6 border-b border-zinc-700 mt-6 pb-2">
            <button
              onClick={() => handleTabChange("posts")}
              className={
                tab === "posts"
                  ? "text-purple-400 cursor-pointer"
                  : "text-zinc-400 cursor-pointer"
              }
            >
              Posts
            </button>

            <button
              onClick={() => handleTabChange("replies")}
              className={
                tab === "replies"
                  ? "text-purple-400 cursor-pointer"
                  : "text-zinc-400 cursor-pointer"
              }
            >
              Replies
            </button>

            <button
              onClick={() => handleTabChange("likes")}
              className={
                tab === "likes"
                  ? "text-purple-400 cursor-pointer"
                  : "text-zinc-400 cursor-pointer"
              }
            >
              Likes
            </button>
          </div>

          {tab === "posts" && <UserPosts userId={profile.id} />}
          {tab === "replies" && <UserReplies userId={profile.id} />}
          {tab === "likes" && <UserLikes userId={profile.id} />}
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;