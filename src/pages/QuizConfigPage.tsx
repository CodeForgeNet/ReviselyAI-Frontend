import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function QuizConfigPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState(5);
  const [saqs, setSaqs] = useState(3);
  const [laqs, setLaqs] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/quiz/generate?pdf_id=${id}&mcq=${mcqs}&saq=${saqs}&laq=${laqs}`
      );
      navigate(`/quiz/${res.data.quiz_id}`, { state: res.data });
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6">Configure Your Quiz</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="mcqs" className="block font-medium mb-1">
            Number of Multiple Choice Questions
          </label>
          <input
            type="number"
            id="mcqs"
            value={mcqs}
            onChange={(e) => setMcqs(Number(e.target.value))}
            className="input"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="saqs" className="block font-medium mb-1">
            Number of Short Answer Questions
          </label>
          <input
            type="number"
            id="saqs"
            value={saqs}
            onChange={(e) => setSaqs(Number(e.target.value))}
            className="input"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="laqs" className="block font-medium mb-1">
            Number of Long Answer Questions
          </label>
          <input
            type="number"
            id="laqs"
            value={laqs}
            onChange={(e) => setLaqs(Number(e.target.value))}
            className="input"
            min="0"
          />
        </div>
        <button
          onClick={handleGenerateQuiz}
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </div>
    </div>
  );
}
