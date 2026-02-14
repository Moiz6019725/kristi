"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function ProductGallery({ images }) {
  const [thumbs, setThumbs] = useState(null);

  return (
    <div className="space-y-4">
      {/* Main slider */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbs }}
        className="bg-gray-100"
        style={{
          "--swiper-navigation-color": "#484848",
          "--swiper-pagination-color": "#484848",
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} className="w-full h-105 object-cover" alt="" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbs}
        slidesPerView={4}
        spaceBetween={10}
        watchSlidesProgress
        className="opacity-70"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              className="h-24 w-full object-cover rounded-lg cursor-pointer hover:opacity-100"
              alt=""
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
