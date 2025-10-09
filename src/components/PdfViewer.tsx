import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axiosInstance from "../api/axiosInstance";
import { getAuth } from "firebase/auth";

// Set worker path to public directory
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfFileId: string;
  onError?: (error: Error) => void;
}

export default function PdfViewer({ pdfFileId, onError }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("PdfViewer mounted/updated with pdfFileId:", pdfFileId);
  }, [pdfFileId]);

  const loadPdf = useCallback(async () => {
    if (!pdfFileId) {
      console.log("No pdfFileId provided");
      return;
    }

    console.log("Starting PDF load process for ID:", pdfFileId);
    setLoading(true);
    setError(null);
    setPdfData(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Current user:", user.uid);
      console.log("Fetching PDF content for ID:", pdfFileId);

      const token = await user.getIdToken(true);
      console.log("Got fresh token:", token.substring(0, 10) + "...");

      console.log("Making request to:", `/upload/file/${pdfFileId}`);
      const response = await axiosInstance.get(`/upload/file/${pdfFileId}`, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Response data type:", typeof response.data);
      console.log("Response data size:", response.data.byteLength, "bytes");

      if (response.status !== 200) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }

      if (!response.data) {
        throw new Error("Empty response received");
      }

      console.log("Setting PDF data...");
      setPdfData(response.data);
      console.log("PDF data set successfully");
      setLoading(false);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      if (onError) onError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [pdfFileId, onError]);

  useEffect(() => {
    loadPdf();
  }, [loadPdf]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF document:", error);
    setError(error);
    if (onError) onError(error);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading PDF...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <p>Error loading PDF: {error.message}</p>
        <button 
          onClick={loadPdf} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      {pdfData && (
        <>
          <Document
            file={pdfData}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="pdf-document"
          >
            <Page 
              pageNumber={pageNumber} 
              width={600}
              className="pdf-page"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
          
          {numPages && (
            <div className="pdf-controls mt-4 flex items-center justify-center space-x-4">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              >
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages}
              </span>
              <button
                disabled={pageNumber >= numPages!}
                onClick={() => setPageNumber(pageNumber + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
