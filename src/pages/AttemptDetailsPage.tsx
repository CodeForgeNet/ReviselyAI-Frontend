import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface MCQ {
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

interface Questions {
  mcqs: MCQ[];
  saqs: SAQ[];
  laqs: LAQ[];
}

interface UserAnswers {
  mcq?: { [key: string]: number };
  saq?: { [key: string]: string };
  laq?: { [key: string]: string };
}

interface AttemptDetails {
  questions: Questions;
  user_answers: UserAnswers;
  created_at: string;
}

export default function AttemptDetailsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [details, setDetails] = useState<AttemptDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        const res = await axios.get(`/progress/attempt/${attemptId}`);
        setDetails(res.data);
      } catch (error) {
        console.error("Error fetching attempt details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchAttemptDetails();
    }
  }, [attemptId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-4 sm:my-8">
      <button
        onClick={() => navigate("/progress")}
        className="btn btn-secondary mb-4"
      >
        &larr; Back to Progress
      </button>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Quiz Attempt Details
      </h1>
      {loading ? (
        <p className="text-center">Loading details...</p>
      ) : !details ? (
        <p className="text-center">Attempt details not found.</p>
      ) : (
        <div className="space-y-6">
          <p className="text-center text-gray-600">
            Attempt on: {new Date(details.created_at).toLocaleString()}
          </p>

          {/* MCQs */}
          <div>
            <h2 className="text-lg font-bold mb-2">Multiple Choice Questions</h2>
            {details.questions.mcqs.map((mcq, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg bg-white">
                <p className="font-semibold">{mcq.question}</p>
                <div className="my-2">
                  {mcq.options.map((option, i) => {
                    const userAnswer = details.user_answers.mcq?.[index];
                    const isCorrect = i === mcq.answer_index;
                    const isUserAnswer = userAnswer === i;
                    let className = "";
                    if (isUserAnswer && isCorrect) {
                      className = "bg-green-200";
                    } else if (isUserAnswer && !isCorrect) {
                      className = "bg-red-200";
                    } else if (isCorrect) {
                      className = "bg-green-200";
                    }

                    return (
                      <p key={i} className={`p-2 rounded ${className}`}>
                        {option}
                      </p>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-700">Your answer: {mcq.options[details.user_answers.mcq?.[index] ?? -1] ?? "Not answered"}</p>
                <p className="text-sm text-green-700">Correct answer: {mcq.options[mcq.answer_index]}</p>
                <p className="text-sm text-gray-500">Explanation: {mcq.explanation}</p>
              </div>
            ))}
          </div>

          {/* SAQs */}
          <div>
            <h2 className="text-lg font-bold mb-2">Short Answer Questions</h2>
            {details.questions.saqs.map((saq, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg bg-white">
                <p className="font-semibold">{saq.question}</p>
                <p>Your answer: {details.user_answers.saq?.[index] ?? "Not answered"}</p>
                <div>
                  <p>Correct answer:</p>
                  <ReactMarkdown>{saq.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* LAQs */}
          <div>
            <h2 className="text-lg font-bold mb-2">Long Answer Questions</h2>
            {details.questions.laqs.map((laq, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg bg-white">
                <p className="font-semibold">{laq.question}</p>
                <p>Your answer: {details.user_answers.laq?.[index] ?? "Not answered"}</p>
                <div>
                  <p>Correct answer outline:</p>
                  <ul className="list-disc list-inside">
                    {laq.answer_outline.map((point, i) => (
                      <li key={i}>
                        <ReactMarkdown>{point}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
