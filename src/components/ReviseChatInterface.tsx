import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";
import ReactMarkdown from "react-markdown";

interface ReviseChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ReviseChatSession {
  _id: string;
  user_id: string;
  title: string;
  messages: ReviseChatMessage[];
  created_at: string;
  updated_at: string;
}

interface ReviseChatInterfaceProps {
  currentSession: ReviseChatSession | null;
  onSessionUpdate: (session: ReviseChatSession) => void;
}

const ReviseChatInterface: React.FC<ReviseChatInterfaceProps> = ({
  currentSession,
  onSessionUpdate,
}) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ReviseChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages);
    } else {
      setMessages([]);
    }
  }, [currentSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askQuestion = async () => {
    console.log("Send button clicked or Enter pressed"); // Added log
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion("");
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
        timestamp: new Date().toISOString(),
      },
    ]);
    setLoading(true);

    console.log(
      "ReviseChatInterface: Sending question with session_id:",
      currentSession?._id
    );

    try {
      const res = await axios.post("/revise-chat/ask", {
        question: userQuestion,
        session_id: currentSession?._id || null,
      });

      console.log(
        "ReviseChatInterface: Received response with session_id:",
        res.data.session_id
      );

      const newAiMessage: ReviseChatMessage = {
        role: "assistant",
        content: res.data.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newAiMessage]);

      if (res.data.session_id && !currentSession) {
        console.log(
          "ReviseChatInterface: New session created, passing ID to onSessionUpdate:",
          res.data.session_id
        );
        onSessionUpdate({
          _id: res.data.session_id,
          user_id: "",
          title:
            userQuestion.substring(0, 50) +
            (userQuestion.length > 50 ? "..." : ""),
          messages: [
            ...messages,
            {
              role: "user",
              content: userQuestion,
              timestamp: new Date().toISOString(),
            },
            newAiMessage,
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else if (currentSession) {
        console.log(
          "ReviseChatInterface: Updating existing session, passing ID to onSessionUpdate:",
          currentSession._id
        );
        onSessionUpdate({
          ...currentSession,
          messages: [
            ...messages,
            {
              role: "user",
              content: userQuestion,
              timestamp: new Date().toISOString(),
            },
            newAiMessage,
          ],
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm sorry, I encountered an error while processing your question. Please try again.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <p className="text-sm sm:text-base">
              Start a conversation with your AI companion!
            </p>
            <p className="text-xs sm:text-sm mt-2 px-4">
              For example: "Explain quantum physics" or "Summarize the French
              Revolution"
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
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
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 sm:px-4 py-2">
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

      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askQuestion()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            disabled={loading}
          />
          <button
            onClick={askQuestion}
            disabled={!question.trim() || loading}
            className={`px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base transition-colors hover:bg-blue-600 ${
              !question.trim() && "opacity-50 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviseChatInterface;
