"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "@/app/news.css";
import SwiperNews from "@/app/components/HotSwiper"; // import the new Swiper componentimport HotSwiper from "

type NewsItem = {
  title: string;
  file: string;
  content?: string;
  image?: string;
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"National" | "International">("National");
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const nationalFiles: NewsItem[] = [
    { title: "National Article 85", file: "/Articles/NationalNews/85.md" },
    { title: "National Article 86", file: "/Articles/NationalNews/86.md" },
  ];

  const internationalFiles: NewsItem[] = [
    { title: "International Article 82", file: "/Articles/InternationalNews/82.md" },
    { title: "International Article 83", file: "/Articles/InternationalNews/83.md" },
  ];

  const [nationalNews, setNationalNews] = useState<NewsItem[]>([]);
  const [internationalNews, setInternationalNews] = useState<NewsItem[]>([]);

  const newsToShow = activeTab === "National" ? nationalNews : internationalNews;

  // Fetch Markdown content
  useEffect(() => {
    const fetchMarkdown = async (files: NewsItem[], setter: any) => {
      const updatedNews = await Promise.all(
        files.map(async (item) => {
          try {
            const res = await fetch(item.file);
            let text = res.ok ? await res.text() : "Article not found.";

            // Extract first image
            const imageMatch = text.match(/!\[.*?\]\((.*?)\)/);
            const image = imageMatch ? imageMatch[1] : undefined;

            // Remove first image from content
            if (imageMatch) text = text.replace(imageMatch[0], "");

            return { ...item, content: text, image };
          } catch {
            return { ...item, content: "Unable to load article." };
          }
        })
      );
      setter(updatedNews);
    };

    fetchMarkdown(nationalFiles, setNationalNews);
    fetchMarkdown(internationalFiles, setInternationalNews);
  }, []);

  const getExcerpt = (content?: string) => {
    if (!content) return "";
    return content.split(/\s+/).slice(0, 10).join(" ") + "...";
  };

  // Article view
  if (selectedArticle) {
    return (
      <div className="min-h-screen p-6 bg-gray-900 text-white">
        <button
          className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          onClick={() => setSelectedArticle(null)}
        >
          &larr; Back
        </button>

        <h1 className="text-4xl font-bold mb-6 text-yellow-500 text-center">
          {selectedArticle.title}
        </h1>

        {selectedArticle.image && (
          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="mx-auto mb-6 rounded-lg max-h-96 object-cover"
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
    <div className="min-h-screen p-6 bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-6 text-yellow-500 text-center">
        Wize Wealth
      </h1>

      {/* Toggle Buttons */}
      <div className="flex gap-6 mb-8">
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-lg border-2 transition ${
            activeTab === "National"
              ? "border-yellow-500 text-yellow-500"
              : "border-gray-600 text-gray-300"
          }`}
          onClick={() => setActiveTab("National")}
        >
          National Finance
        </button>
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-lg border-2 transition ${
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
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 self-start">
        Hot Headlines <span className="text-sm text-gray-400">(Swipe Slides)</span>
      </h2>

      <div className="w-full mb-10">
        <SwiperNews news={newsToShow} onClick={setSelectedArticle} />
      </div>

      {/* What's Happening */}
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 self-start">
        What&apos;s Happening
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {newsToShow.slice(3).map((news, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-700 transition flex flex-col"
            onClick={() => setSelectedArticle(news)}
          >
            {news.image && (
              <img
                src={news.image}
                alt={news.title}
                className="mb-3 rounded-lg h-40 object-cover"
              />
            )}
            <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
            <p className="text-gray-300 text-sm">{getExcerpt(news.content)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
