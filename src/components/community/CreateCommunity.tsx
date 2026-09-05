import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { supabase } from "../../config/supabase-client";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/routes";
import { validateCommunityName } from "../../utils/validations";
import toast from "react-hot-toast";

interface ICreateCommunityProps {}

interface ICommunity {
  name: string;
  description: string;
  user_id: string;

}

const createCommunity = async (community: ICommunity) => {
  const { error } = await supabase
    .from("communities")
    .insert(community);

  if (error) {
  
    throw new Error(error.message);
  }
};

const checkNameAvailability = async (name: string) => {
  const { data } = await supabase
    .from("communities")
    .select("name")
    .ilike("name", name)
    .maybeSingle();

  return !data;
};

const CreateCommunity: React.FunctionComponent<ICreateCommunityProps> = () => {
  const { user } = useAuth();
  const [name, setName] = React.useState<string>("");
  const [debouncedUsername, setDebouncedUsername] = React.useState<string>("");
  const [nameAvailable, setNameAvailable] = React.useState<boolean | null>(
    null,
  );
  const [availableName, setAvailableName] = React.useState<string>("");

  const [description, setDescription] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate(ROUTES.COMMUNITIES);
    },
  });

  const handleOnSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (user)
      return mutate({ name, description, user_id: user?.id });

    toast.error("Log in to create community");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    setErrorMessage("");
    setName(name);
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (errorMessage === "") setDebouncedUsername(name);
    }, 250);

    return () => clearTimeout(timeout);
  }, [name]);

  React.useEffect(() => {
    const check = async () => {
      if (!debouncedUsername) return;

      setErrorMessage(validateCommunityName(name));

      if (errorMessage === "") {
        const available = await checkNameAvailability(debouncedUsername);
        setNameAvailable(available);
        setAvailableName(debouncedUsername);
      } else {
        setNameAvailable(null);
      }
    };

    check();
  }, [debouncedUsername]);

  return (
    <form
      onSubmit={handleOnSubmit}
      className="w-full max-w-2xl mx-auto space-y-6 p-8 rounded-2xl
  bg-slate-900/60 backdrop-blur-md border border-slate-600/60 shadow-xl"
    >
      <h2 className="text-4xl font-bold text-center  text-slate-300 bg-clip-text ">
        Create New Community
      </h2>

      {/* Community Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block font-medium text-gray-200">
          Community Name
        </label>

        <input
          disabled={!user}
          type="text"
          id="name"
          value={name}
          maxLength={20}
          required
          onChange={(e) => handleNameChange(e)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2
      focus:outline-none focus:ring-2 focus:ring-cyan-900 transition"
        />

        {nameAvailable === false && (
          <p className="text-red-400 text-xs mt-1">
            Community name already taken {availableName}
          </p>
        )}

        {nameAvailable === true && (
          <p className="text-green-400 text-xs mt-1">
            Community name available ✓ {availableName}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block font-medium text-gray-200"
        >
          Description
        </label>

        <textarea
          disabled={!user}
          id="description"
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2
      focus:outline-none focus:ring-2 focus:ring-cyan-900 transition resize-none"
        />
      </div>

      <p className="text-center text-red-400">{errorMessage}</p>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold text-white
    bg-cyan-900/65
    hover:scale-[1.02] active:scale-[0.98]
    transition-transform shadow-lg cursor-pointer"
      >
        {isPending ? "Creating Community..." : "Create Community"}
      </button>

      {isError && (
        <p className="text-center text-red-400">Error creating community</p>
      )}
    </form>
  );
};

export default CreateCommunity;
