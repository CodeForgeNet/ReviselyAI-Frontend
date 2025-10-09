import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axiosInstance from "../api/axiosInstance";
import { getAuth } from "firebase/auth";
import { isAxiosError } from "axios";

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfId: string; // Changed from number to string
  onError?: (error: Error) => void;
}

export default function PdfViewer({ pdfId, onError }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfId) return;

      setLoading(true);
      setError(null);
      setPdfData(null);

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User not authenticated. Please log in again.");
        }

        console.log("Fetching PDF content for ID:", pdfId);
        await user.getIdToken(true); // Force refresh

        const response = await axiosInstance.get(`/upload/file/${pdfId}`, { // Changed from /files/${pdfId}/download to /upload/file/${pdfId}
          responseType: "arraybuffer",
        });

        setPdfData(response.data);
        console.log("PDF loaded successfully");
      } catch (err) {
        console.error("Error loading PDF:", err);
        let errorToSet: Error;
        if (isAxiosError(err)) {
          console.error("Error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          errorToSet = new Error(
            `Failed to load PDF: ${err.response?.statusText || err.message}`
          );
        } else if (err instanceof Error) {
          errorToSet = err;
        } else {
          errorToSet = new Error("An unknown error occurred while loading the PDF.");
        }
        setError(errorToSet);
        if (onError) onError(errorToSet);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfId, onError]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
    setPageNumber(1);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF document:", error);
    setError(error);
    if (onError) onError(error);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading PDF...</div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p className="font-semibold">Failed to load PDF file</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!pdfData) {
    return (
      <div className="flex items-center justify-center h-full">
        No PDF data to display.
      </div>
    );
  }

  return (
    <div className="pdf-container flex flex-col items-center w-full">
      <Document
        file={pdfData}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="pdf-document max-h-full overflow-y-auto w-full"
      >
        {numPages && (
          <Page
            pageNumber={pageNumber}
            width={Math.min(window.innerWidth - 40, 800)}
            className="shadow-md mx-auto"
          />
        )}
      </Document>

      {numPages && (
        <div className="pdf-controls flex items-center justify-between w-full max-w-md p-4">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="btn btn-secondary"
          >
            Previous
          </button>

          <span>
            Page {pageNumber} of {numPages || "--"}
          </span>

          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
            }
            disabled={pageNumber >= (numPages || 1)}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
