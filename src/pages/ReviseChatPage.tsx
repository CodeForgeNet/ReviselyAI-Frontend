import React, { useState } from "react";
import ReviseChatInterface from "../components/ReviseChatInterface";
import ChatHistoryDrawer from "../components/ChatHistoryDrawer";

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

const ReviseChatPage: React.FC = () => {
  const [currentSession, setCurrentSession] =
    useState<ReviseChatSession | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectSession = (session: ReviseChatSession | null) => {
    setCurrentSession(session);
    setIsDrawerOpen(false); // Close drawer after selection on mobile
  };

  const handleSessionUpdate = (session: ReviseChatSession) => {
    console.log(
      "ReviseChatPage: handleSessionUpdate - updated session ID:",
      session._id
    );
    setCurrentSession(session);
    setRefreshTrigger((prev) => {
      const newTrigger = prev + 1;
      console.log("ReviseChatPage: refreshTrigger incremented to:", newTrigger);
      return newTrigger;
    });
    console.log("ReviseChatPage: currentSession after update:", session._id);
  };

  return (
    <div className="relative h-[88vh] overflow-hidden flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="lg:hidden absolute top-2 left-2 z-50 bg-primary-600 text-white p-2 rounded-lg shadow-md hover:bg-primary-700 transition-colors"
        aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isDrawerOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Chat History Drawer */}
      <div
        className={`
          fixed lg:relative 
          w-[280px] sm:w-[320px] lg:w-[300px] xl:w-[380px]
          h-full 
          transition-transform duration-300 ease-in-out
          ${
            isDrawerOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          shadow-lg lg:shadow-none
          z-50 lg:z-0
          bg-white
          top-0 left-0
          pt-14 lg:pt-0
        `}
      >
        {/* Close button for mobile/tablet */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close drawer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <ChatHistoryDrawer
          onSelectSession={handleSelectSession}
          currentSessionId={currentSession?._id || null}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Chat Interface */}
      <div
        className={`
          flex-1
          transition-all duration-300 ease-in-out
          relative
          ${!isDrawerOpen ? "pl-14" : "pl-0"}
        `}
      >
        <div
          className={`
            w-full h-full
            transition-opacity duration-300
            ${isDrawerOpen ? "opacity-50 lg:opacity-100" : "opacity-100"}
            ${
              isDrawerOpen
                ? "pointer-events-none lg:pointer-events-auto"
                : "pointer-events-auto"
            }
          `}
        >
          <ReviseChatInterface
            currentSession={currentSession}
            onSessionUpdate={handleSessionUpdate}
          />
        </div>
      </div>

      {/* Overlay for mobile/tablet */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
};

export default ReviseChatPage;
