import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axiosInstance";

interface Question {
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

interface SAQ {
  question: string;
  answer: string;
}

interface LAQ {
  question: string;
  answer_outline: string[];
}

interface QuizState {
  quiz_id: string;
  questions: {
    mcqs?: Question[];
    saqs?: SAQ[];
    laqs?: LAQ[];
    raw?: string;
  };
}

interface Result {
  score: number;
  total: number;
  pct: number;
  results: {
    mcq: {
      correct_index: number;
      user_answer: number;
      is_correct: boolean;
    }[];
    saq: {
      correct_answer: string;
      user_answer: string;
      is_correct: boolean;
    }[];
    laq: {
      user_answer: string;
      is_correct: boolean;
    }[];
  };
}

function renderMarkdown(text: string) {
  let processedText = text;
  if (processedText.startsWith("* ")) {
    processedText = processedText.slice(2);
  }

  const parts = processedText.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: QuizState };
  const { quiz_id, questions } = state || {
    quiz_id: "",
    questions: { mcqs: [], saqs: [], laqs: [] },
  };
  const [answers, setAnswers] = useState<{
    mcq: Record<number, number>;
    saq: Record<number, string>;
    laq: Record<number, string>;
  }>({ mcq: {}, saq: {}, laq: {} });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/progress/submit", {
        quiz_id,
        answers: answers,
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

  const selectMcqAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      mcq: { ...prev.mcq, [questionIndex]: optionIndex },
    }));
  };

  const handleSaqChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      saq: { ...prev.saq, [questionIndex]: value },
    }));
  };

  const handleLaqChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      laq: { ...prev.laq, [questionIndex]: value },
    }));
  };

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
                    answers.mcq[i] === j
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200"
                  } ${
                    submitted && j === q.answer_index
                      ? "border-green-500 bg-green-50"
                      : ""
                  } ${
                    submitted && answers.mcq[i] === j && j !== q.answer_index
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`mcq-${i}`}
                      value={j}
                      checked={answers.mcq[i] === j}
                      onChange={() => selectMcqAnswer(i, j)}
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

        {questions.saqs?.map((q, i) => (
          <div key={i} className="bg-white p-5 rounded-lg shadow-sm">
            <p className="font-semibold mb-3 text-lg">
              {i + 1}. {q.question}
            </p>
            <textarea
              value={answers.saq[i] || ""}
              onChange={(e) => handleSaqChange(i, e.target.value)}
              disabled={submitted}
              className={`input w-full ${
                submitted && result?.results.saq[i]?.is_correct
                  ? "border-green-500"
                  : submitted
                  ? "border-red-500"
                  : ""
              }`}
              rows={3}
            />
            {submitted && (
              <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                <p className="text-sm font-semibold">Answer:</p>
                <p className="text-sm">{q.answer}</p>
              </div>
            )}
          </div>
        ))}

        {questions.laqs?.map((q, i) => (
          <div key={i} className="bg-white p-5 rounded-lg shadow-sm">
            <p className="font-semibold mb-3 text-lg">
              {i + 1}. {q.question}
            </p>
            <textarea
              value={answers.laq[i] || ""}
              onChange={(e) => handleLaqChange(i, e.target.value)}
              disabled={submitted}
              className={`input w-full ${
                submitted && result?.results.laq[i]?.is_correct
                  ? "border-green-500"
                  : submitted
                  ? "border-red-500"
                  : ""
              }`}
              rows={6}
            />
            {submitted && (
              <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                <p className="text-sm font-semibold">Answer Outline:</p>
                <ul className="list-disc list-inside">
                  {q.answer_outline.map((point, j) => (
                    <li key={j} className="text-sm">
                      {renderMarkdown(point)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary px-8"
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      ) : (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-bold mb-2">Quiz Results</h2>
          <div className="text-5xl font-bold text-primary-600 mb-2">
            {result?.score}/{result?.total}
          </div>
          <p className="text-lg mb-4">
            Overall Accuracy: {Math.round(result?.pct || 0)}%
          </p>

          {result?.results.mcq && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Multiple Choice Questions</h3>
              <p>
                Score: {result.results.mcq.filter((r) => r.is_correct).length} /{" "}
                {result.results.mcq.length}
              </p>
            </div>
          )}

          {result?.results.saq && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Short Answer Questions</h3>
              <p>
                Score: {result.results.saq.filter((r) => r.is_correct).length} /{" "}
                {result.results.saq.length}
              </p>
            </div>
          )}

          {result?.results.laq && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Long Answer Questions</h3>
              <p>
                Score: {result.results.laq.filter((r) => r.is_correct).length} /{" "}
                {result.results.laq.length}
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="btn btn-primary mt-6"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
