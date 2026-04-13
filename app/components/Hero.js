import React from "react";

const Hero = () => {
  return (
    <section
      className="relative w-full h-[70vh] md:h-150 flex items-center bg-gray-900 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.6)), url('/hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 w-full z-10">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
          
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-white leading-tight uppercase tracking-tight mb-6 md:mb-8">
            Comfort, Style, and Ease.
          </h1>

          <button className="bg-white text-black font-semibold px-6 md:px-10 py-3 md:py-4 rounded-full hover:bg-gray-200 transition-colors duration-300 text-sm md:text-base">
            Discover Collection
          </button>

        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
    </section>
  );
};

export default Hero;
