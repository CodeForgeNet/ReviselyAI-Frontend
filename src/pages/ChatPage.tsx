import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import PdfViewer from "../components/PdfViewer";
import ChatInterface from "../components/ChatInterface";

interface PdfInfo {
  id: string;
  title: string;
  user_id: string;
  is_indexed: boolean;
  created_at: string;
  file_id: string;
  full_url?: string;
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>(); // Specify id as string
  const navigate = useNavigate();
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchPdfInfo = useCallback(async () => {
    if (!id) {
      console.log("No ID available");
      return;
    }
    try {
      console.log("Fetching PDF info for ID:", id);
      const res = await axios.get(`/upload/${id}`);
      console.log("PDF info received:", res.data);
      setPdfInfo(res.data);
    } catch (error) {
      console.error("Error fetching PDF info:", error);
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPdfInfo();
  }, [fetchPdfInfo]);

  const handlePdfError = useCallback((error: Error) => {
    console.error("PDF Viewer Error:", error);
    // Optionally display an error message to the user
  }, []);

  return (
    <div className="flex h-[86vh] overflow-hidden">
      {/* Left Pane: PDF Viewer */}
      <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
        {pdfInfo?.file_id ? (
          <PdfViewer pdfFileId={pdfInfo.file_id} onError={handlePdfError} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">PDF is loading or unavailable...</p>
          </div>
        )}
      </div>

      {/* Right Pane: Chat Interface */}
      <ChatInterface
        pdfInfo={pdfInfo}
        messagesEndRef={messagesEndRef}
        id={id}
      />
    </div>
  );
}
