import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface AttemptDetail {
  attempt_id: string;
  created_at: string;
  mcq_score: string;
  saq_score: string;
  laq_score: string;
  overall_score: string;
}

interface OverallSummary {
  total_questions_attempted: number;
  total_correct_answers: number;
  overall_accuracy_percentage: number;
}

interface ProgressData {
  overall_summary: OverallSummary;
  attempts: AttemptDetail[];
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get("/progress");
        setProgressData(res.data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const viewAttemptDetails = (attemptId: string) => {
    navigate(`/progress/attempt/${attemptId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-4 sm:my-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Your Progress
      </h1>
      {loading ? (
        <p className="text-center">Loading progress...</p>
      ) : !progressData || progressData.attempts.length === 0 ? (
        <p className="text-center">No quiz attempts found.</p>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Overall Performance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <p className="text-gray-600 text-sm sm:text-base">
                  Questions Attempted
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {progressData.overall_summary.total_questions_attempted}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                <p className="text-gray-600 text-sm sm:text-base">
                  Correct Answers
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {progressData.overall_summary.total_correct_answers}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                <p className="text-gray-600 text-sm sm:text-base">Accuracy</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {progressData.overall_summary.overall_accuracy_percentage}%
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Recent Attempts
            </h2>
            {progressData.attempts.map((attempt) => (
              <div
                key={attempt.attempt_id}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm"
              >
                <p className="text-base sm:text-lg font-semibold mb-2">
                  Attempt on:{" "}
                  {new Date(attempt.created_at).toLocaleDateString()}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-gray-600 text-sm">MCQ Score</p>
                    <p className="font-bold">{attempt.mcq_score}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-gray-600 text-sm">SAQ Score</p>
                    <p className="font-bold">{attempt.saq_score}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-gray-600 text-sm">LAQ Score</p>
                    <p className="font-bold">{attempt.laq_score}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-700 text-sm sm:text-base">
                    Overall: {attempt.overall_score}
                  </p>
                  <button
                    onClick={() => viewAttemptDetails(attempt.attempt_id)}
                    className="btn btn-secondary text-sm py-1 px-3"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
