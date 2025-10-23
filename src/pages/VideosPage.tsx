import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosInstance";

interface YoutubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
}

export default function VideosPage() {
  const { pdf_id } = useParams<{ pdf_id: string }>();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!pdf_id) return;
      setLoading(true);
      try {
        const response = await axios.get(`/youtube/search?pdf_id=${pdf_id}`);
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [pdf_id]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2">Loading videos...</p>
        </div>
      ) : videos.length === 0 ? (
        <p className="text-center">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={video.thumbnail} alt={video.title} className="w-full" />
              <div className="p-4">
                <p className="font-semibold">{video.title}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
