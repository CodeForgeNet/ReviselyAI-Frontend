import { useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface PDF {
  id: string;
  title: string;
  user_id: string;
  is_indexed: boolean;
  created_at: string;
  file_id: string;
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/upload/list");
      setPdfs(res.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPDF = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPdfs([...pdfs, res.data]);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  const generateQuiz = (id: string) => {
    navigate(`/quiz/config/${id}`);
  };

  const openChat = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const openVideos = (id: string) => {
    navigate(`/videos/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      try {
        await axios.delete(`/upload/${id}`);
        setPdfs(pdfs.filter((pdf) => pdf.id !== id));
      } catch (error) {
        console.error("Error deleting PDF:", error);
        alert("Failed to delete PDF");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 px-4 sm:px-6 py-4 sm:py-6 md:py-8">
      <div className="frosted-card p-4 sm:p-6 rounded-lg shadow-lg text-black">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6">
          Welcome to Revisely
        </h1>
        <p className="text-black mb-4 text-sm sm:text-base">
          Upload your study materials and let AI help you learn more
          effectively.
        </p>

        <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 sm:p-6 text-center">
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            Upload PDF
          </h3>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3 border border-gray-600 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 w-full text-sm sm:text-base"
            ref={fileInputRef}
            disabled={uploading}
          />
          <button
            onClick={uploadPDF}
            disabled={!file || uploading}
            className="btn btn-primary text-sm sm:text-base w-full sm:w-auto"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <div className="frosted-card p-4 sm:p-6 rounded-lg shadow-lg text-black">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Your Study Materials
        </h2>

        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-black text-sm sm:text-base">
              Loading your materials...
            </p>
          </div>
        ) : pdfs.length === 0 ? (
          <p className="text-center py-6 sm:py-8 text-black text-sm sm:text-base">
            No PDFs uploaded yet. Upload your first document to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-lg p-3 sm:p-4 gap-3 sm:gap-4"
              >
                <div className="w-full sm:w-auto">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    {pdf.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(pdf.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openChat(pdf.id)}
                    className="btn btn-primary px-2 sm:px-3 py-1 rounded hover:bg-primary-100 text-xs sm:text-sm flex-1 sm:flex-none"
                    disabled={uploading}
                  >
                    Ask Questions
                  </button>
                  <button
                    onClick={() => generateQuiz(pdf.id)}
                    className="btn btn-primary px-2 sm:px-3 py-1 rounded hover:bg-blue-100 text-xs sm:text-sm flex-1 sm:flex-none"
                    disabled={uploading}
                  >
                    Generate Quiz
                  </button>
                  <button
                    onClick={() => openVideos(pdf.id)}
                    className="btn btn-primary px-2 sm:px-3 py-1 rounded hover:bg-green-100 text-xs sm:text-sm flex-1 sm:flex-none"
                    disabled={uploading}
                  >
                    Videos
                  </button>
                  <button
                    onClick={() => handleDelete(pdf.id)}
                    className="btn btn-danger px-2 sm:px-3 py-1 rounded hover:bg-red-100 text-xs sm:text-sm flex-1 sm:flex-none"
                    disabled={uploading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
