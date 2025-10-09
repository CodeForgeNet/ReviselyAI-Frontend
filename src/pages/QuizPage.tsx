import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axiosInstance";

interface Question {
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

interface QuizState {
  quiz_id: string;
  questions: {
    mcqs?: Question[];
    raw?: string;
  };
}

interface Result {
  score: number;
  total: number;
  pct: number;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: QuizState };
  const { quiz_id, questions } = state || {
    quiz_id: "",
    questions: { mcqs: [] },
  };
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/progress/submit", {
        quiz_id,
        answers: { mcq: answers },
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  // If no state was passed, handle gracefully
  if (!state) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Quiz not found</h2>
        <p className="text-gray-600 mb-4">
          The quiz you're looking for doesn't exist or has expired.
        </p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Knowledge Quiz</h1>
        {!submitted && (
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Exit Quiz
          </button>
        )}
      </div>

      <div className="space-y-6">
        {questions.mcqs?.map((q, i) => (
          <div key={i} className="bg-white p-5 rounded-lg shadow-sm">
            <p className="font-semibold mb-3 text-lg">
              {i + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className={`block p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    answers[i] === j
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200"
                  } ${
                    submitted && j === q.answer_index
                      ? "border-green-500 bg-green-50"
                      : ""
                  } ${
                    submitted && answers[i] === j && j !== q.answer_index
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`mcq-${i}`}
                      value={j}
                      checked={answers[i] === j}
                      onChange={() => selectAnswer(i, j)}
                      disabled={submitted}
                      className="mr-2"
                    />
                    {opt}
                  </div>
                </label>
              ))}
              {submitted && (
                <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                  <p className="text-sm font-semibold">Explanation:</p>
                  <p className="text-sm">{q.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              Object.keys(answers).length !== (questions.mcqs?.length || 0)
            }
            className="btn btn-primary px-8"
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
          {Object.keys(answers).length !== (questions.mcqs?.length || 0) && (
            <p className="text-sm text-gray-500 mt-2">
              Please answer all questions to submit
            </p>
          )}
        </div>
      ) : (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-bold mb-2">Quiz Results</h2>
          <div className="text-5xl font-bold text-primary-600 mb-2">
            {result?.score}/{result?.total}
          </div>
          <p className="text-lg mb-4">
            Accuracy: {Math.round(result?.pct || 0)}%
          </p>

          <button onClick={() => navigate("/")} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
