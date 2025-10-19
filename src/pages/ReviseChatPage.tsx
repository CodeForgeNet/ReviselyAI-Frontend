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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refreshTrigger state

  const handleSelectSession = (session: ReviseChatSession | null) => {
    setCurrentSession(session);
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
    <div className="flex h-[88vh] overflow-hidden">
      <ChatHistoryDrawer
        onSelectSession={handleSelectSession}
        currentSessionId={currentSession?._id || null}
        refreshTrigger={refreshTrigger} // Pass refreshTrigger
      />

      <ReviseChatInterface
        currentSession={currentSession}
        onSessionUpdate={handleSessionUpdate}
      />
    </div>
  );
};

export default ReviseChatPage;
