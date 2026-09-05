import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { ROUTES } from "../../utils/routes";
import { manageOAuthErrors } from "../../utils/manageAuthErrors";

export default function SignInPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { signInWithGitHub, signInWithGoogle, signInWithEmail } = useAuth();
  const [isSigningIn,setIsSigningIn]= useState<boolean>(false);

  const navigate = useNavigate();
  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningIn(true)

    const { error } = await signInWithEmail(email, password);
   setIsSigningIn(false)

    if (error) return setErrorMessage(manageOAuthErrors(error.message));
    navigate(ROUTES.HOME);
  };

  const signUpWithGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { error } = await signInWithGoogle();
    if (error) return setErrorMessage(manageOAuthErrors(error.message));
    navigate(ROUTES.HOME);
  };
  const signUpWithGitHub = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { error } = await signInWithGitHub();

    if (error) return setErrorMessage(manageOAuthErrors(error.message));
    navigate(ROUTES.HOME);
  };
  return (
    <div className="flex mt-[40%] sm:mt-0 md:mt-0 lg:mt-0 items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-sm text-zinc-400 mb-6">Sign in to continue</p>

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
        <form onSubmit={(e) => onSubmitForm(e)} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-zinc-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-zinc-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
<button
  type="submit"
  disabled={isSigningIn}
  className={`w-full py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
    isSigningIn
      ? "bg-indigo-400 cursor-not-allowed"
      : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
  }`}
>
  {isSigningIn && (
    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
  )}
  {isSigningIn ? "Signing in..." : "Sign In"}
</button>
        </form>

        <div className="text-sm text-zinc-400 mt-6 text-center">
          Don’t have an account?{" "}
          <div
            onClick={() => navigate(ROUTES.SIGN_UP)}
            className="cursor-pointer text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </div>
        </div>
        <p className="text-red-500 text-center "> {errorMessage}</p>
      </div>
    </div>
  );
}
