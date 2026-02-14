
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    text: "I was hesitant to buy a formal dress online, but the detailed sizing guide gave me confidence. The dress arrived flawlessly packed, and the stitching and detailing were exquisite. It truly felt like a designer piece. I received compliments all night long!",
    author: "Fariha N.",
  },
  {
    id: 2,
    text: "The bespoke suit service exceeded my expectations. From the fabric quality to the final fit, everything was handled with extreme professionalism. A truly premium experience for any gentleman.",
    author: "Shaista A.",
  },
  {
    id: 3,
    text: "Fantastic quality and even better customer service. The delivery was on time, and the packaging was very high-end. Highly recommended for luxury formal wear.",
    author: "Sara K.",
  }
];

export default function TestimonialSlider() {
  return (
    <section className="my-16 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-base tracking-[0.3em] text-gray-800 font-normal uppercase block mb-9">
          WHAT OUR CUSTOMERS SAY
        </span>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          pagination={{ 
            clickable: true,
            el: '.custom-pagination', // Custom element for dots
          }}
          className="relative"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex flex-col items-center">
                <p className="text-base leading-relaxed text-gray-800 max-w-3xl mb-5">
                  {item.text}
                </p>
                <h4 className="text-sm font-medium tracking-widest text-gray-900 uppercase mb-6">
                  {item.author}
                </h4>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Dots Container - Yeh ab name ke niche aayega */}
          <div className="custom-pagination flex justify-center gap-3"></div>
        </Swiper>
      </div>

      <style jsx global>{`
        /* Default dots ko hide karke custom dots ko style karna */
        .custom-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background-color: #d1d5db; /* Light gray */
          opacity: 1;
          margin: 0 !important;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background-color: #111 !important; /* Dark black */
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}