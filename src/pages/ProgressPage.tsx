import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

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

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>
      {loading ? (
        <p>Loading progress...</p>
      ) : !progressData || progressData.attempts.length === 0 ? (
        <p>No quiz attempts found.</p>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-bold mb-4">Overall Performance</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Questions Attempted</p>
                <p className="text-3xl font-bold text-blue-600">
                  {progressData.overall_summary.total_questions_attempted}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Correct Answers</p>
                <p className="text-3xl font-bold text-green-600">
                  {progressData.overall_summary.total_correct_answers}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Accuracy</p>
                <p className="text-3xl font-bold text-purple-600">
                  {progressData.overall_summary.overall_accuracy_percentage}%
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Recent Attempts</h2>
            {progressData.attempts.map((attempt) => (
              <div
                key={attempt.attempt_id}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <p className="text-lg font-semibold">
                  Attempt on:{" "}
                  {new Date(attempt.created_at).toLocaleDateString()}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-gray-600">MCQ Score</p>
                    <p className="font-bold">{attempt.mcq_score}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">SAQ Score</p>
                    <p className="font-bold">{attempt.saq_score}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">LAQ Score</p>
                    <p className="font-bold">{attempt.laq_score}</p>
                  </div>
                </div>
                <p className="text-right mt-2 text-gray-700">
                  Overall: {attempt.overall_score}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
