import React, { useState, useEffect } from 'react';
import axios from "../api/axiosInstance";

interface ReviseChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ReviseChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: ReviseChatMessage[];
  created_at: string;
  updated_at: string;
}

interface ChatHistoryDrawerProps {
  onSelectSession: (session: ReviseChatSession | null) => void;
  currentSessionId: string | null;
}

const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  onSelectSession,
  currentSessionId,
}) => {
  const [sessions, setSessions] = useState<ReviseChatSession[]>([]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get<ReviseChatSession[]>("/revisechat/history");
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleNewChat = () => {
    onSelectSession(null); // Clear current session to start a new one
  };

  const handleSelectSession = (session: ReviseChatSession) => {
    onSelectSession(session);
  };

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r border-gray-200 flex flex-col">
      <button
        onClick={handleNewChat}
        className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        New Chat
      </button>
      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      <ul className="space-y-2 flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <p className="text-gray-500">No chat history yet.</p>
        ) : (
          sessions.map((session) => (
            <li key={session.id}>
              <button
                onClick={() => handleSelectSession(session)}
                className={`w-full text-left p-2 rounded-lg ${
                  currentSessionId === session.id
                    ? "bg-blue-200 text-blue-800"
                    : "hover:bg-gray-200"
                }`}
              >
                {session.title || "Untitled Chat"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ChatHistoryDrawer;
