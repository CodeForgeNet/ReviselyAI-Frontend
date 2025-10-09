import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PdfInfo {
  id: string;
  title: string;
  user_id: string;
  is_indexed: boolean;
  created_at: string;
  file_id: string;
  full_url?: string;
}

interface ChatInterfaceProps {
  pdfInfo: PdfInfo | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  id: string | undefined;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  pdfInfo,
  messagesEndRef,
  id,
}) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  const askQuestion = async () => {
    if (!question.trim() || !id) return; // Ensure id is available

    const userQuestion = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setLoading(true);

    try {
      const res = await axios.post("/chat/ask", {
        pdf_id: id, // Changed from Number(id) to id
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
          content: `I'm sorry, I encountered an error while processing your question. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Chat with {pdfInfo?.title || "PDF"}
        </h1>
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
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown> {/* Use ReactMarkdown */}
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
};

export default ChatInterface;
