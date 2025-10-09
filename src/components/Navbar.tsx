import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-white">
          Revisely
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-3 py-2 rounded-md border border-white hover:bg-blue-700 transition-colors duration-200"
          >
            Dashboard
          </Link>
          <button onClick={() => signOut(auth)} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
