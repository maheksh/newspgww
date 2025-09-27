"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "@/app/news.css";
import HotSwiper from "./components/HotSwiper";

type NewsItem = {
  title: string;
  file: string;
  content?: string;
  image?: string;
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"National" | "International">("National");
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [nationalFiles, setNationalFiles] = useState<NewsItem[]>([]);
  const [internationalFiles, setInternationalFiles] = useState<NewsItem[]>([]);
  const [nationalNews, setNationalNews] = useState<NewsItem[]>([]);
  const [internationalNews, setInternationalNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const newsToShow = activeTab === "National" ? nationalNews : internationalNews;

  // Fetch file lists from API
  useEffect(() => {
    const fetchFileLists = async () => {
      setIsLoading(true);
      try {
        const nationalRes = await fetch('/api/news?type=national');
        const nationalData = await nationalRes.json();
        setNationalFiles(Array.isArray(nationalData) ? nationalData : []);

        const internationalRes = await fetch('/api/news?type=international');
        const internationalData = await internationalRes.json();
        setInternationalFiles(Array.isArray(internationalData) ? internationalData : []);
      } catch (error) {
        console.error('Error fetching file lists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileLists();
  }, []);

  // Fetch Markdown content once files are loaded
  useEffect(() => {
    if (nationalFiles.length === 0 && internationalFiles.length === 0) return;

    const fetchMarkdown = async (files: NewsItem[], setter: React.Dispatch<React.SetStateAction<NewsItem[]>>) => {
      const updatedNews = await Promise.all(
        files.map(async (item) => {
          try {
            const res = await fetch(item.file);
            let text = res.ok ? await res.text() : "Article not found.";

            // Extract title from first # heading if present, fallback to item.title
            const titleMatch = text.match(/^# (.*)$/m);
            const extractedTitle = titleMatch ? titleMatch[1].trim() : item.title;

            // Extract first image
            const imageMatch = text.match(/!\[.*?\]\((.*?)\)/);
            const image = imageMatch ? imageMatch[1] : undefined;

            // Remove first image from content
            if (imageMatch) text = text.replace(imageMatch[0], "");

            return { ...item, title: extractedTitle, content: text, image };
          } catch {
            return { ...item, content: "Unable to load article.", title: item.title };
          }
        })
      );
      setter(updatedNews);
    };

    fetchMarkdown(nationalFiles, setNationalNews);
    fetchMarkdown(internationalFiles, setInternationalNews);
  }, [nationalFiles, internationalFiles]);

  const getExcerpt = (content?: string) => {
    if (!content) return "";
    return content.split(/\s+/).slice(0, 10).join(" ") + "...";
  };

  // Article view
  if (selectedArticle) {
    return (
      <div className="min-h-screen p-4 sm:p-6 bg-gray-900 text-white">
        <button
          className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          onClick={() => setSelectedArticle(null)}
        >
          &larr; Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-yellow-500 text-center">
          {selectedArticle.title}
        </h1>

        {selectedArticle.image && (
          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="mx-auto mb-6 rounded-lg w-full max-h-80 sm:max-h-96 object-cover"
          />
        )}

        <div className="prose prose-invert max-w-3xl mx-auto">
          <ReactMarkdown>{selectedArticle.content || "Loading..."}</ReactMarkdown>
        </div>
      </div>
    );
  }

  // Home layout
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-yellow-500 text-center">
        Wize Wealth
      </h1>

      {/* Toggle Buttons */}
      <div className="flex gap-4 sm:gap-6 mb-8">
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg border-2 transition ${
            activeTab === "National"
              ? "border-yellow-500 text-yellow-500"
              : "border-gray-600 text-gray-300"
          }`}
          onClick={() => setActiveTab("National")}
        >
          National Finance
        </button>
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg border-2 transition ${
            activeTab === "International"
              ? "border-yellow-500 text-yellow-500"
              : "border-gray-600 text-gray-300"
          }`}
          onClick={() => setActiveTab("International")}
        >
          International Finance
        </button>
      </div>

      {/* Hot Headlines Swiper */}
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-4 self-start">
        Hot Headlines <span className="text-xs sm:text-sm text-gray-400">(Swipe Slides)</span>
      </h2>
      <div className="w-full mb-8 sm:mb-10">
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <HotSwiper news={newsToShow.slice(0, 3)} onClick={setSelectedArticle} />
        )}
      </div>

      {/* What's Happening */}
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-4 self-start">
        What's Happening
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
        {isLoading ? (
          <p className="text-center text-gray-400 col-span-full">Loading...</p>
        ) : newsToShow.slice(3).length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">No additional articles available.</p>
        ) : (
          newsToShow.slice(3).map((news, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-700 transition flex flex-col min-h-[48px]"
              onClick={() => setSelectedArticle(news)}
            >
              {news.image && (
                <img
                  src={news.image}
                  alt={news.title}
                  className="mb-3 rounded-lg w-full h-[30vw] sm:h-40 object-cover aspect-[4/3]"
                />
              )}
              <h3 className="text-base sm:text-lg font-semibold mb-2">{news.title}</h3>
              <p className="text-gray-300 text-sm">{getExcerpt(news.content)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}