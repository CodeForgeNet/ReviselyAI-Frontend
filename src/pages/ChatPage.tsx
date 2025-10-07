import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PdfInfo {
  id: number;
  filename: string;
  path: string;
  uploaded_at: string;
  user_id: number;
}

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchPdfInfo = useCallback(async () => {
    try {
      const res = await axios.get(`/files/${id}`);
      setPdfInfo(res.data);
    } catch (error) {
      console.error("Error fetching PDF info:", error);
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPdfInfo();
  }, [fetchPdfInfo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setLoading(true);

    try {
      const res = await axios.post("/chat/ask", {
        pdf_id: Number(id),
        question: userQuestion,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your question. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Chat with {pdfInfo?.filename || "PDF"}
        </h1>
        <button
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-700"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto mb-4 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Ask a question about this document to get started!</p>
            <p className="text-sm mt-2">
              For example: "What are the main topics covered?" or "Explain the
              concept of X"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 flex">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          placeholder="Ask a question about this document..."
          className="flex-1 border-none focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={askQuestion}
          disabled={!question.trim() || loading}
          className={`ml-2 btn btn-primary ${
            !question.trim() && "opacity-50 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
