import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";

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

interface ChatHistoryDrawerProps {
  onSelectSession: (session: ReviseChatSession | null) => void;
  currentSessionId: string | null;
  refreshTrigger: number;
}

const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  onSelectSession,
  currentSessionId,
  refreshTrigger,
}) => {
  const [sessions, setSessions] = useState<ReviseChatSession[]>([]);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedSessionForDeletion, setSelectedSessionForDeletion] = useState<
    string | null
  >(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenuVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get<ReviseChatSession[]>(
        "/revise-chat/history"
      );
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleNewChat = () => {
    onSelectSession(null);
  };

  const handleSelectSession = (session: ReviseChatSession) => {
    onSelectSession(session);
    setContextMenuVisible(false); // Close context menu on session select
  };

  const handleContextMenu = (event: React.MouseEvent, sessionId: string) => {
    event.preventDefault(); // Prevent default browser context menu
    setContextMenuVisible(true);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedSessionForDeletion(sessionId);
  };

  const handleDeleteSession = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop event propagation
    if (selectedSessionForDeletion) {
      try {
        await axios.delete(`/revise-chat/${selectedSessionForDeletion}`);
        fetchChatHistory(); // Refresh history after deletion
        if (currentSessionId === selectedSessionForDeletion) {
          onSelectSession(null); // Clear current session if deleted
        }
      } catch (error) {
        console.error("Error deleting chat session:", error); // Added log
      } finally {
        setContextMenuVisible(false);
        setSelectedSessionForDeletion(null);
      }
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-3 sm:p-4 border-r border-gray-200 flex flex-col">
      <button
        onClick={handleNewChat}
        className="mb-3 sm:mb-4 w-full px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base hover:bg-blue-600 transition-colors"
      >
        New Chat
      </button>
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
        Chat History
      </h2>
      <ul className="space-y-2 flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">
            No chat history yet.
          </p>
        ) : (
          sessions.map((session) => (
            <li
              key={session._id}
              onContextMenu={(e) => handleContextMenu(e, session._id)}
              className="min-w-0" // Prevent text overflow
            >
              <button
                onClick={() => handleSelectSession(session)}
                className={`w-full text-left p-2 rounded-lg text-sm sm:text-base truncate ${
                  currentSessionId === session._id
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

      {contextMenuVisible && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white shadow-lg rounded-md py-1 z-10"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <button
            onClick={handleDeleteSession}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            Delete Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryDrawer;
