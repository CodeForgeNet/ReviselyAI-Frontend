import { useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface PDF {
  id: string; // Changed from number to string
  filename: string;
  created_at: string; // Changed from uploaded_at to created_at
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
      const res = await axios.get("/upload/list"); // Changed from /files/list to /upload/list
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

      const res = await axios.post("/upload/upload", formData, { // Changed from /files/upload to /upload/upload
        headers: {
          "Content-Type": "multipart/form-data", // Corrected Content-Type for FormData
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

  const generateQuiz = async (id: string) => { // Changed id from number to string
    try {
      const res = await axios.post(`/quiz/generate?pdf_id=${id}`);
      navigate(`/quiz/${res.data.quiz_id}`, { state: res.data });
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz");
    }
  };

  const openChat = (id: string) => { // Changed id from number to string
    navigate(`/chat/${id}`);
  };

  const handleDelete = async (id: string) => { // Changed id from number to string
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      try {
        await axios.delete(`/upload/${id}`); // Changed from /files/${id} to /upload/${id}
        setPdfs(pdfs.filter((pdf) => pdf.id !== id));
      } catch (error) {
        console.error("Error deleting PDF:", error);
        alert("Failed to delete PDF");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8">
      <div className="frosted-card p-6 rounded-lg shadow-lg text-black">
        <h1 className="text-2xl font-bold mb-6">Welcome to Revisely</h1>
        <p className="text-black mb-4">
          Upload your study materials and let AI help you learn more
          effectively.
        </p>

        <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-3">Upload PDF</h3>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3 border border-gray-600 rounded-md px-3 py-2 w-full"
            ref={fileInputRef}
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

      <div className="frosted-card p-6 rounded-lg shadow-lg text-black">
        <h2 className="text-xl font-bold mb-4">Your Study Materials</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-black">Loading your materials...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <p className="text-center py-8 text-black">
            No PDFs uploaded yet. Upload your first document to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="flex justify-between items-center border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium text-gray-800">{pdf.filename}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(pdf.created_at).toLocaleDateString()} {/* Changed uploaded_at to created_at */}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openChat(pdf.id)}
                    className="btn btn-primary px-3 py-1 rounded hover:bg-primary-100"
                  >
                    Ask Questions
                  </button>
                  <button
                    onClick={() => generateQuiz(pdf.id)}
                    className="btn btn-primary px-3 py-1 rounded hover:bg-blue-100"
                  >
                    Generate Quiz
                  </button>
                  <button
                    onClick={() => handleDelete(pdf.id)}
                    className="btn btn-danger px-3 py-1 rounded hover:bg-red-100"
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
