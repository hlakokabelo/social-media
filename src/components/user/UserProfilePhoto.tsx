

import type { User } from "@supabase/supabase-js";
import * as React from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { routeBuilder } from "../../utils/routes";

interface IUserProfilePhotoProps {
  user: User | null;
  showUsername?: boolean;
  size?: "sm" | "md" | "lg";
}

const UserProfilePhoto: React.FunctionComponent<IUserProfilePhotoProps> = ({
  user,
  showUsername = true,
  size = "md",
}) => {
  const { userProfile } = useAuth();
  
  if (!user || !userProfile) return null;
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };
  
  const usernameSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  return (
    <Link
      className="cursor-pointer flex items-center space-x-2 group"
      to={routeBuilder.user(userProfile?.username)}
    >
      {userProfile?.avatar_url ? (
        <img
          src={userProfile.avatar_url}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-transparent group-hover:border-blue-400 transition-all duration-300`}
          alt="user Avatar"
            onError={(e) => {
    e.currentTarget.src = "/images/image-fallback.jpg";
  }}

        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-300`}>
          {userProfile?.username?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      
      {showUsername && (
        <span className={`${usernameSizeClasses[size]} text-gray-300 group-hover:text-blue-400 transition-colors duration-300 font-medium`}>
          {userProfile?.username}
        </span>
      )} 
    </Link>
  );
};

export default UserProfilePhoto;