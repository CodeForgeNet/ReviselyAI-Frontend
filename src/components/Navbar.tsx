import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { signOut, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // Get current location

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "?";
    return email[0].toUpperCase();
  };

  const getLinkClass = (path: string) => {
    const baseClasses =
      "px-3 py-2 rounded-md border border-white transition-colors duration-200";
    const activeClasses = "bg-blue-700"; // Active style
    const inactiveClasses = "hover:bg-blue-700"; // Inactive hover style

    return `${baseClasses} ${
      location.pathname === path ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-white">
          Revisely
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className={getLinkClass("/")}>
            Dashboard
          </Link>
          <Link to="/progress" className={getLinkClass("/progress")}>
            Progress
          </Link>
          <Link to="/revisechat" className={getLinkClass("/revisechat")}>
            ReviselyChat
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white"
            >
              {getInitials(user?.email)}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black">
                <button
                  onClick={() => {
                    signOut(auth);
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
