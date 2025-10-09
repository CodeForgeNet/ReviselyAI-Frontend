import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase/config";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300">
      {user && <Navbar />}

      <div className="container mx-auto px-4 py-4">
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/quiz/:id"
            element={user ? <QuizPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat/:id"
            element={user ? <ChatPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}
