import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-primary-600">
          Revisely
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-primary-600">
            Dashboard
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
