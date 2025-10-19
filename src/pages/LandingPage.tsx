import { useState } from "react";
import LoginPopup from "../components/LoginPopup";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to <span className="text-primary-600">Revisely</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your intelligent study companion that transforms the way you learn.
          Upload your coursebooks and let AI power your revision journey.
        </p>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 text-lg shadow-lg hover:shadow-2xl cursor-pointer border-2 border-primary-700"
        >
          Start Learning Now
        </button>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {/* Smart Chat */}
          <div className="bg-transparent p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-primary-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary-600 text-2xl">💬</div>
              <h3 className="text-xl font-semibold">AI Study Companion</h3>
            </div>
            <p className="text-gray-600">
              Chat with our AI tutor to understand concepts better. Get instant,
              contextual explanations from your coursebooks.
            </p>
          </div>

          {/* Quiz Generation */}
          <div className="bg-transparent p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-primary-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary-600 text-2xl">📝</div>
              <h3 className="text-xl font-semibold">Smart Quiz Generator</h3>
            </div>
            <p className="text-gray-600">
              Practice with auto-generated MCQs, short answers, and long-form
              questions. Get instant feedback and explanations.
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="bg-transparent p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-primary-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary-600 text-2xl">📊</div>
              <h3 className="text-xl font-semibold">Progress Dashboard</h3>
            </div>
            <p className="text-gray-600">
              Track your learning journey, identify strengths and areas for
              improvement with detailed analytics.
            </p>
          </div>

          {/* PDF Management */}
          <div className="bg-transparent p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-primary-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary-600 text-2xl">📚</div>
              <h3 className="text-xl font-semibold">PDF Library</h3>
            </div>
            <p className="text-gray-600">
              Upload and manage your coursebooks. Access them anytime, anywhere
              with our integrated PDF viewer.
            </p>
          </div>

          {/* Video Recommendations */}
          <div className="bg-transparent p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-primary-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary-600 text-2xl">🎥</div>
              <h3 className="text-xl font-semibold">Video Learning</h3>
            </div>
            <p className="text-gray-600">
              Get personalized YouTube video recommendations relevant to your
              study material.
            </p>
          </div>

          {/* Smart Citations */}
          <div className="bg-transparent p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-primary-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary-600 text-2xl">🔍</div>
              <h3 className="text-xl font-semibold">Smart Citations</h3>
            </div>
            <p className="text-gray-600">
              Get answers with precise page citations and relevant quotes from
              your coursebooks.
            </p>
          </div>
        </div>
      </div>

      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default LandingPage;
