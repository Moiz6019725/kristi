import React from "react";

const Hero = () => {
  return (
    <section
      className="relative w-full h-150 flex items-center bg-gray-900 overflow-hidden"
      style={{
        // Replace the URL below with your actual image path
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight uppercase tracking-tight mb-8">
            Comfort, Style, and Ease.
          </h1>

          <button className="bg-white text-black font-semibold px-10 py-4 rounded-full hover:bg-gray-200 transition-colors duration-300 text-sm md:text-base">
            Discover Collection
          </button>
        </div>
      </div>

      {/* Optional: Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
    </section>
  );
};

export default Hero;
