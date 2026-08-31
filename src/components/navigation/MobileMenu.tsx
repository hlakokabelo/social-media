import * as React from "react";
import MobileNavItem from "./MobileNavItem";
import { routeBuilder, ROUTES } from "../../utils/routes";

interface IMobileMenuProps {
  items: {
    goToUrl: (destination: string) => void;
    menuOpen: boolean;
    mobileMenuClick: () => void;
    user: any;
    userProfile: any;
  };
}

const MobileMenu: React.FunctionComponent<IMobileMenuProps> = ({ items }) => {
  let { goToUrl, menuOpen, mobileMenuClick, user, userProfile } = items;

  return (
    <>
      {menuOpen && (
        <div className="md:hidden">
          <div className="absolute right-2 top-16 w-72 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden animate-slideDown">
            {/* Mobile Menu Header with User Info */}
            {user && userProfile && (
              <div className="px-4 py-4 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  {userProfile?.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-400/50"
                      alt="User Avatar"
                        onError={(e) => {
    e.currentTarget.src = "/images/image-fallback.jpg";
  }}

                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {userProfile?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {userProfile?.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Items */}
            <div className="py-2">
              {!user && (
                <MobileNavItem
                  onClick={mobileMenuClick}
                  className="text-green-400 hover:bg-green-500/10"
                >
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign In / Sign Up</span>
                  </div>
                </MobileNavItem>
              )}

              {user && (
                <>
                  <MobileNavItem
                    onClick={() =>
                      goToUrl(routeBuilder.user(userProfile?.username))
                    }
                  >
                    <div className="flex cursor-pointer items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Profile Page</span>
                    </div>
                  </MobileNavItem>

                  <MobileNavItem
                    onClick={mobileMenuClick}
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    <div className="flex cursor-pointer  items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </div>
                  </MobileNavItem>
                </>
              )}

              <div className="border-t border-gray-700/50 my-2"></div>

              <MobileNavItem onClick={() => goToUrl(ROUTES.HOME)}>
                <div className="flex cursor-pointer  items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Home</span>
                </div>
              </MobileNavItem>

              <MobileNavItem onClick={() => goToUrl(ROUTES.CREATE_POST)}>
                <div className="flex cursor-pointer  items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Create Post</span>
                </div>
              </MobileNavItem>

              <MobileNavItem onClick={() => goToUrl(ROUTES.COMMUNITIES)}>
                <div className="flex cursor-pointer  items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Communities</span>
                </div>
              </MobileNavItem>

              <MobileNavItem onClick={() => goToUrl(ROUTES.CREATE_COMMUNITY)}>
                <div className="flex  cursor-pointer items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Create Community</span>
                </div>
              </MobileNavItem>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
