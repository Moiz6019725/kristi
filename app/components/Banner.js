"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const banners = [
  {
    id: 1,
    image: "/Header-1.jpg",
    alt: "Latest Mobile Accessories",
  },
  {
    id: 2,
    image: "/Header-2.jpg",
    alt: "Premium Headphones & Earbuds",
  },
];

const Banner = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      slidesPerView={1}
      loop
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      style={{
    "--swiper-navigation-color": "#484848",
    "--swiper-pagination-color": "#484848",
  }}
      className="w-full"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <img
            src={banner.image}
            alt={banner.alt}
            className="w-full aspect-[21/7.6] object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
