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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchPdfInfo = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const res = await axios.get(`/upload/${id}`);
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
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-[86vh] overflow-hidden">
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full p-2 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto">
        {pdfInfo?.file_id ? (
          <PdfViewer pdfFileId={pdfInfo.file_id} onError={handlePdfError} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm sm:text-base">
              PDF is loading or unavailable...
            </p>
          </div>
        )}
      </div>

      <ChatInterface
        pdfInfo={pdfInfo}
        messagesEndRef={messagesEndRef}
        id={id}
      />
    </div>
  );
}
