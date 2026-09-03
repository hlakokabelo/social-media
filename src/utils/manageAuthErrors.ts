export const manageOAuthErrors = (msg: string): string => {
  if (msg.includes("User already registered")) {
    return "Looks like you already have an account. Sign in to continue.";
  }

  if (msg.includes("Invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (msg.includes("Email not confirmed")) {
    return "Please verify your email before signing in.";
  }

  if (msg.includes("Password should be at least")) {
    return "Your password doesn't meet the minimum requirements.";
  }

  if (msg.includes("Database error saving new user")) {
    return "We couldn't create your account right now. Please try again.";
  }

  if (msg.toLowerCase().includes("rate limit")) {
    return "Too many attempts. Please try again later.";
  }

  if (
    msg.includes("Failed to fetch") ||
    msg.includes("NetworkError")
  ) {
    return "Unable to connect. Please check your internet connection.";
  }

  if (msg.includes("provider is not enabled")) {
    return "This sign-in option is currently unavailable.";
  }

  if (msg.includes("access_denied")) {
    return "Sign-in was cancelled.";
  }

  return "Something went wrong. Please try again.";
};