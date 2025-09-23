"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // ✅ correct import in Swiper 12+
import "swiper/css";
import "swiper/css/navigation";

import { NewsItem } from "../page"; // using the type from page.tsx

type Props = {
  news: NewsItem[];
  onClick: (news: NewsItem) => void;
};

export default function HotSwiper({ news, onClick }: Props) {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      navigation
      modules={[Navigation]}
      className="rounded-lg"
    >
      {news.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            className="rounded-lg overflow-hidden cursor-pointer bg-gray-800 shadow-lg"
            onClick={() => onClick(item)}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            <h3 className="text-lg font-semibold text-white mt-2 px-3 py-2">
              {item.title}
            </h3>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
