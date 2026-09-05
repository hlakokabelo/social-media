import * as React from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import imageCompression from "browser-image-compression";
import { routeBuilder } from "../../utils/routes";
import { validateUsername } from "../../utils/validations";

interface IEditProfilePageProps {}

interface IUserProfile {
  bio: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}
const upDateProfile = async (
  profile: IUserProfile,
  id: string | undefined,
  profilePic: File | null,
) => {
  let image_url = "";
  if (profilePic) {
    const filePath = `${profilePic.name}-4-4-${Date.now()}-3-3-${profilePic.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, profilePic);

    if (uploadError) return new Error(uploadError.message);

    //get imageUrl
    const { data: ImageData } = await supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    image_url = ImageData.publicUrl;
  }
  if (image_url !== "") profile.avatar_url = image_url;
  await supabase.from("profiles").update(profile).eq("id", id);
};


const reFetchProfile = async (getProfile: any) => {
  getProfile();
};

const EditProfilePage: React.FunctionComponent<IEditProfilePageProps> = () => {
  const { user, userProfile, getProfile } = useAuth();
  const [editing, setEditing] = React.useState<boolean>(false);
  // const [password, setPassword] = React.useState<string>("-------");
  const [display_name, setDisplayName] = React.useState<string>("-------");
  const [bio, setBio] = React.useState<string>("my bio");
  const [username, setUsername] = React.useState<string>("");
  const [infoEdited, setInfoEdited] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [profilePic, setProfilePic] = React.useState<File | null>(null);
  const [usernameAvailable, setUsernameAvailable] = React.useState<
    boolean | null
  >(null);
  const [debouncedUsername, setDebouncedUsername] = React.useState("");
  const [availableUsername, setAvailableUsername] = React.useState<string>("");

  const inputStyle = editing
    ? "mt-1 w-full px-4 py-2 bg-slate-800 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    : "mt-1 w-full px-4 py-2 border border-slate-500 rounded-lg bg-slate-700 text-slate-300";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      const compressed = await imageCompression(image, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });

      setProfilePic(compressed);
    }

    setInfoEdited(true);
  };
  React.useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name);
      setBio(userProfile.bio);
      setUsername(userProfile.username);
    }
  }, []);

  const { mutate } = useMutation({
    mutationFn: (profile: IUserProfile) => {
      return upDateProfile(profile, userProfile?.id, profilePic);
    },
    onSuccess: () => reFetchProfile(getProfile),
  });

  const checkUsernameAvailability = async (name: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .ilike("username", name)
      .maybeSingle();

    return !data;
  };

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error !== "") return;

    if (!infoEdited) {
      setEditing(false);
      return;
    }

    const profile: IUserProfile = {
      bio,
      username,
      display_name,
    };

    mutate(profile);

    setEditing((prev) => !prev);
  };

  const handleOnChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = e.target.id;
    const value = e.target.value;
    setInfoEdited(true);
    switch (name) {
      case "username":
        setUsername(value);

        const validationError = validateUsername(value);
        setError(validationError);
        break;
      case "bio":
        setBio(value);
        break;
      case "display_name":
        setDisplayName(value);
        break;
      /*    case "password":
        setPassword(value);
        break;
    */
    }
  };
  const handleCancel = () => {
    if (userProfile) {
      setDisplayName(userProfile.display_name);
      setBio(userProfile.bio);
      setUsername(userProfile.username);
    }

    setProfilePic(null);
    setError("");
    setInfoEdited(false);
    setEditing(false);
    setUsernameAvailable(null);
  };
  if (!user) return <Navigate to="/" />;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (username !== userProfile?.username) setDebouncedUsername(username);
    }, 250); // delay (tweak if you want)

    return () => clearTimeout(timeout);
  }, [username]);

  React.useEffect(() => {
    const check = async () => {
      if (!debouncedUsername) return;

      const validationError = validateUsername(debouncedUsername);
      setError(validationError);

      if (validationError === "") {
        const available = await checkUsernameAvailability(debouncedUsername);
        setUsernameAvailable(available);
        setAvailableUsername(debouncedUsername);
      } else {
        setUsernameAvailable(null);
      }
    };

    check();
  }, [debouncedUsername]);

  return (
    <div className="flex justify-center">
      <div className="max-w-2xl w-full bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
        {" "}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={
                profilePic
                  ? URL.createObjectURL(profilePic)
                  : userProfile?.avatar_url ||
                    "https://placehold.co/120x120?text=Avatar"
              }
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-lg"
            />

            {editing && (
              <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer shadow-md">
                📷
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <Link to={routeBuilder.user(username)}>
            <p className="mt-3 text-sm text-slate-400 cursor-pointer hover:text-amber-300">
              @{username}
            </p>
          </Link>
        </div>
        <form className="flex flex-col gap-6" onSubmit={onSubmitForm}>
          <div>
            <div>
              <label className="text-sm text-slate-400" htmlFor="username">
                username:
              </label>
              <input
                disabled={!editing}
                className={`mt-1 w-full px-4 py-2 ${editing ? "bg-slate-800 text-white border border-white/10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500" : " bg-slate-700 border border-slate-500 rounded-2xl"}`}
                type="text"
                id="username"
                value={username}
                onChange={(e) => handleOnChange(e)}
              />
              {usernameAvailable === false && (
                <p className="text-red-400 text-xs mt-1">
                  Username already taken {availableUsername}
                </p>
              )}

              {usernameAvailable === true && (
                <p className="text-green-400 text-xs mt-1">
                  Username available ✓ {availableUsername}
                </p>
              )}
              {error && (
                <p className="text-center text-red-500 text-sm">{error}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-slate-400" htmlFor="display_name">
                Display name:
              </label>
              <input
                disabled={!editing}
                className={inputStyle}
                type="text"
                id="display_name"
                value={display_name}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-400" htmlFor="bio">
                bio
              </label>
              <textarea
                disabled={!editing}
                className={inputStyle}
                rows={3}
                id="bio"
                value={bio}
                onChange={(e) => handleOnChange(e)}
              />
            </div>
            <div>
              <label htmlFor="image">Select Profile pic</label>
              <input
                id="image"
                disabled={!editing}
                type="file"
                accept="image/*"
                placeholder="choose profile pic"
                className={inputStyle}
                onChange={handleFileChange}
              />
            </div>
            {/* <div>
              <label className="text-sm text-slate-400" htmlFor="password">
                Password
              </label>
              <input
                disabled={!editing}
                className={inputStyle} type="password"
                id="password"
                value={password}
                onChange={(e) => handleOnChange(e)}
              />
            </div> */}
          </div>

          <div>
            <div className="flex justify-center gap-4 mt-6">
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-6 py-2  cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition"
                >
                  Edit Profile
                </button>
              )}

              {editing && (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2  cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
