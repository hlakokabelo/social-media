import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { ROUTES } from "../../utils/routes";
import { manageOAuthErrors } from "../../utils/manageAuthErrors";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);

  const { signInWithGitHub, signInWithGoogle, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await signUpWithEmail(email, password);
    if (error) return setErrorMessage(manageOAuthErrors(error.message));
    else navigate(ROUTES.HOME);
  };

  const signUpWithGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signInWithGoogle();

    const { error } = await signInWithGitHub();

    if (error) return setErrorMessage(manageOAuthErrors(error.message));
    else navigate(ROUTES.HOME);
  };
  const signUpWithGitHub = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { error } = await signInWithGitHub();

    if (error) return setErrorMessage(manageOAuthErrors(error.message));
    else navigate(ROUTES.HOME);
  };


  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 transition-transform hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-center text-2xl font-semibold text-white mb-2">
          Create account
        </h2>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={(e) => signUpWithGoogle(e)}
            className=" cursor-pointer w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 py-2 rounded-lg transition"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>

          <button
            onClick={(e) => signUpWithGitHub(e)}
            type="button"
            className=" cursor-pointer w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 py-2 rounded-lg transition"
          >
            <FaGithub />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email Form */}
        {showForm && (
          <form className="space-y-4" onSubmit={onSubmitForm}>
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full bg-zinc-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full bg-zinc-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-2 rounded-lg font-medium"
            >
              Sign Up
            </button>
          </form>
        )}

        {!showForm && (
          <div
            onClick={() => setShowForm((prev) => !prev)}
            className="w-full cursor-pointer text-center bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-2 rounded-lg font-medium"
          >
            Continue with email
          </div>
        )}

        <div className="text-sm text-zinc-400 mt-6 text-center">
          Already have an account?{" "}
          <div
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="cursor-pointer text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </div>
        </div>

        <div className="text-red-500 "> {errorMessage}</div>
      </div>
    </div>
  );
}
