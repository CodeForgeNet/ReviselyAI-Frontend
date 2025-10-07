import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface PDF {
  id: number;
  filename: string;
  created_at: string;
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/files/list");
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

      const res = await axios.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPdfs([...pdfs, res.data]);
      setFile(null);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  const generateQuiz = async (id: number) => {
    try {
      const res = await axios.post(`/quiz/generate?pdf_id=${id}`);
      navigate(`/quiz/${res.data.quiz_id}`, { state: res.data });
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz");
    } 
  };

  const openChat = (id: number) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Welcome to Revisely</h1>
        <p className="text-gray-600 mb-4">
          Upload your study materials and let AI help you learn more
          effectively.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-3">Upload PDF</h3>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3"
          />
          <button
            onClick={uploadPDF}
            disabled={!file || uploading}
            className="btn btn-primary"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Study Materials</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading your materials...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No PDFs uploaded yet. Upload your first document to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{pdf.filename}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(pdf.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openChat(pdf.id)}
                    className="bg-primary-50 text-primary-600 px-3 py-1 rounded hover:bg-primary-100"
                  >
                    Ask Questions
                  </button>
                  <button
                    onClick={() => generateQuiz(pdf.id)}
                    className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  >
                    Generate Quiz
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
