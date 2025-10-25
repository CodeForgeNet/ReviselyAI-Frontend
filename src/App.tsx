import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase/config";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";
import QuizConfigPage from "./pages/QuizConfigPage";
import ProgressPage from "./pages/ProgressPage";
import ReviseChatPage from "./pages/ReviseChatPage";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";
import VideosPage from "./pages/VideosPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AttemptDetailsPage from "./pages/AttemptDetailsPage";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex flex-col">
      {user && <Navbar user={user} />}

      <div className="container mx-auto px-4 py-4 flex-grow">
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard /> : <LandingPage />}
          />
          <Route
            path="/quiz/:id"
            element={user ? <QuizPage /> : <Navigate to="/" />}
          />
          <Route
            path="/quiz/config/:id"
            element={user ? <QuizConfigPage /> : <Navigate to="/" />}
          />
          <Route
            path="/chat/:id"
            element={user ? <ChatPage /> : <Navigate to="/" />}
          />
          <Route
            path="/progress"
            element={user ? <ProgressPage /> : <Navigate to="/" />}
          />
          <Route
            path="/progress/attempt/:attemptId"
            element={user ? <AttemptDetailsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/revisechat"
            element={user ? <ReviseChatPage /> : <Navigate to="/" />}
          />
          <Route
            path="/videos/:pdf_id"
            element={user ? <VideosPage /> : <Navigate to="/" />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
