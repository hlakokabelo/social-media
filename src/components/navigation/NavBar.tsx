import * as React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import UserProfilePhoto from "../user/UserProfilePhoto";
import image from "../../assets/icon3.svg";
import { ROUTES } from "../../utils/routes";
import MobileMenu from "./MobileMenu";
import { appName } from "../../utils/appName";
import SearchBar from "./SearchBar";

interface INavBarProps {}

const NavBar: React.FunctionComponent<INavBarProps> = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
    const windowLocation = window.location.toString()
  
  const { user, signOut, userProfile } = useAuth();

  const navigate = useNavigate();
  const goToUrl = (destination: string) => {
    setMenuOpen(false);
    navigate(destination);
  };

  React.useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!target.closest(".mobile-menu")) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

  const mobileMenuClick = () => {
    if (user) {
      signOut();
      setMenuOpen((prev) => !prev);
      return;
    }
    goToUrl(ROUTES.SIGN_IN);
  };

  return (
     <div className="lg:h-auto h-25">
       <nav className="lg:fixed h-18 top-0 w-full z-40 bg-linear-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 shadow-xl">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex  items-center space-x-2 font-mono text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300"
          >
            <img
              className="w-7 h-7 animate-pulse"
              src={image}
              alt={`${appName} Logo`}
                onError={(e) => {
                e.currentTarget.src = "/images/image-fallback.jpg";
  }}
            />
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {appName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 md:gap-20 space-x-1">
            <NavLink className={'hidden lg:block'} to={ROUTES.HOME}>Home</NavLink>
            <NavLink to={ROUTES.CREATE_POST}>Create Post</NavLink>
            <NavLink to={ROUTES.COMMUNITIES}>Communities</NavLink>
            <NavLink to={ROUTES.CREATE_COMMUNITY}>Create Community</NavLink>
          </div>


          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Using the UserProfilePhoto component */}
                <UserProfilePhoto user={user} />

                <button
                  onClick={signOut}
                  className="cursor-pointer bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate(ROUTES.SIGN_IN)}
                className="cursor-pointer bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="cursor-pointer mobile-menu text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
              onClick={() => {
                setMenuOpen((prev) => !prev);
              }}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 transform transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Profile Photo - Only show when menu is closed */}
      {user && !menuOpen && (
        <div className="md:hidden absolute right-16 top-4">
          <UserProfilePhoto user={user} />
        </div>
      )}

      {/* Mobile Menu */}
      <MobileMenu
        items={{ mobileMenuClick, goToUrl, menuOpen, user, userProfile }}
      />

{(windowLocation.includes('search')||windowLocation.endsWith('/'))&&<div className="mt-3 flex justify-center"> <SearchBar/></div>}

    </nav>
     </div>
    
  );
};
export default NavBar;