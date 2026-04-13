import React from "react";

export default function HighlightSection() {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-3">
      
      {/* Left */}
      <div className="relative h-72 md:h-auto">
        <img
          src="/highlight-1.jpg"
          alt="Bespoke Men's Suits"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-4 md:px-8 text-white">
          <span className="text-xs md:text-sm mb-2 tracking-widest">
            PREMIUM COLLECTION
          </span>
          <h2 className="text-xl md:text-3xl font-semibold italic">
            The Gentleman's Choice
          </h2>
          <p className="text-xs md:text-sm mt-2">
            Tailored to perfection. Shop the luxury.
          </p>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center justify-center text-center px-6 md:px-10 py-10 md:py-0 bg-[#F7F7F7]">
        <span className="text-xs tracking-widest text-gray-500 mb-3">
          EXCLUSIVELY YOURS
        </span>

        <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4 text-gray-900">
          Timeless Elegance for Every Occasion
        </h2>

        <p className="text-gray-600 max-w-sm mb-6 leading-relaxed text-sm md:text-base">
          From sophisticated business suits to glamorous evening dresses. 
          Experience the pinnacle of high-end fashion.
        </p>

        <button className="bg-[#111111] text-white rounded-full px-8 md:px-10 py-3 cursor-pointer hover:translate-y-1 hover:bg-black transition-all duration-300 uppercase text-xs md:text-sm font-bold tracking-tighter">
          Explore Collection
        </button>
      </div>

      {/* Right */}
      <div className="relative h-72 md:h-auto">
        <img
          src="/highlight-2.jpg"
          alt="Luxury Fancy Dresses"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-4 md:px-8 text-white">
          <span className="text-xs md:text-sm mb-2 tracking-widest">
            NEW ARRIVALS
          </span>
          <h2 className="text-xl md:text-3xl font-semibold">
            Couture Elegance
          </h2>
          <p className="text-xs md:text-sm mt-2">
            Make an entrance with our fancy collection.
          </p>
        </div>
      </div>

    </section>
  );
}