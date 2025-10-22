import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import ReactMarkdown from "react-markdown";

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
    if (!question.trim() || !id) return;

    const userQuestion = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setLoading(true);

    try {
      const res = await axios.post("/chat/ask", {
        pdf_id: id,
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
    <div className="w-full lg:w-1/2 flex flex-col p-2 sm:p-4 h-[50vh] lg:h-full">
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h1 className="text-lg sm:text-xl font-bold truncate max-w-[250px] sm:max-w-full">
          Chat with {pdfInfo?.title || "PDF"}
        </h1>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto mb-2 sm:mb-4 p-2 sm:p-4">
        {messages.length === 0 ? (
          <div className="text-center py-6 sm:py-12 text-gray-500">
            <p className="text-sm sm:text-base">
              Ask a question about this document to get started!
            </p>
            <p className="text-xs sm:text-sm mt-2">
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
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full animate-bounce"
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

      <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          placeholder="Ask a question about this document..."
          className="flex-1 border-none focus:outline-none text-sm sm:text-base"
          disabled={loading}
        />
        <button
          onClick={askQuestion}
          disabled={!question.trim() || loading}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors ${
            (!question.trim() || loading) && "opacity-50 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
