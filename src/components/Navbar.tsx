import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(target)
      ) {
        setDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(target)
      ) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "?";
    return email[0].toUpperCase();
  };

  const getLinkClass = (path: string) => {
    const baseClasses =
      "px-3 py-2 rounded-md border border-white transition-colors duration-200";
    const activeClasses = "bg-blue-700";
    const inactiveClasses = "hover:bg-blue-700";

    return `${baseClasses} ${
      location.pathname === path ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-bold text-lg sm:text-xl text-white">
            Revisely
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/" className={getLinkClass("/")}>
              Dashboard
            </Link>
            <Link to="/progress" className={getLinkClass("/progress")}>
              Progress
            </Link>
            <Link to="/revisechat" className={getLinkClass("/revisechat")}>
              ReviselyChat
            </Link>
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white text-sm sm:text-base hover:bg-blue-800 transition-colors"
              >
                {getInitials(userEmail)}
              </button>
              {desktopDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black z-50">
                  <button
                    onClick={async () => {
                      try {
                        await signOut(auth);
                        setDesktopDropdownOpen(false);
                        navigate("/");
                      } catch (error) {
                        console.error("Logout failed:", error);
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white text-sm hover:bg-blue-800 transition-colors mr-2"
              >
                {getInitials(userEmail)}
              </button>
              {mobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black z-50">
                  <button
                    onClick={async () => {
                      try {
                        await signOut(auth);
                        setMobileDropdownOpen(false);
                        navigate("/");
                      } catch (error) {
                        console.error("Logout failed:", error);
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-2 space-y-2">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-center transition-colors border border-transparent
                ${
                  location.pathname === "/"
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/progress"
              className={`block px-3 py-2 rounded-md text-center transition-colors border border-transparent
                ${
                  location.pathname === "/progress"
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Progress
            </Link>
            <Link
              to="/revisechat"
              className={`block px-3 py-2 rounded-md text-center transition-colors border border-transparent
                ${
                  location.pathname === "/revisechat"
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ReviselyChat
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
