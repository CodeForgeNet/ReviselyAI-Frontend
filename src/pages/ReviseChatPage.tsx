import React, { useState } from 'react';
import ReviseChatInterface from "../components/ReviseChatInterface";
import ChatHistoryDrawer from "../components/ChatHistoryDrawer";

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

const ReviseChatPage: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<ReviseChatSession | null>(null);

  const handleSelectSession = (session: ReviseChatSession | null) => {
    setCurrentSession(session);
  };

  const handleSessionUpdate = (session: ReviseChatSession) => {
    setCurrentSession(session);
  };

  return (
    <div className="flex h-[88vh] overflow-hidden">
      {/* Left Drawer for Chat History */}
      <ChatHistoryDrawer
        onSelectSession={handleSelectSession}
        currentSessionId={currentSession?.id || null}
      />

      {/* Main Chat Window and Input Box */}
      <ReviseChatInterface
        currentSession={currentSession}
        onSessionUpdate={handleSessionUpdate}
      />
    </div>
  );
};

export default ReviseChatPage;
