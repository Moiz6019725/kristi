import React from "react";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="w-full font-sans">

      {/* Hero Section */}
      <div className="w-full bg-linear-to-r from-gray-500 to-black text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Kristi</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Fashion for Every Style. From elegant ladies’ suits to casual jeans, trendy purses, and chic accessories — Kristi brings style, quality, and comfort under one roof.
        </p>
      </div>

      {/* Our Story Section */}
      <section className="py-16 px-6 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <img 
            src="/about.png" 
            alt="Kristi Fashion Story" 
            className="w-full rounded-xl shadow-lg object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              Kristi began with a passion for fashion and a vision to make stylish, high-quality apparel accessible to everyone. From trendy womenswear to casual menswear, we celebrate individuality and comfort in every outfit.
            </p>
            <p>
              Our curated collections of suits, jeans, purses, and accessories are designed to inspire confidence and elegance. Every product is selected with care to meet our standards of style, quality, and durability.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-6 bg-gray-50 text-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What We Believe In</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300">
              <h3 className="font-semibold text-xl mb-2">Style & Trends</h3>
              <p>We bring the latest fashion trends and timeless classics for men and women.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300">
              <h3 className="font-semibold text-xl mb-2">Quality & Comfort</h3>
              <p>Our products are carefully crafted to ensure comfort, fit, and long-lasting quality.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300">
              <h3 className="font-semibold text-xl mb-2">Customer Happiness</h3>
              <p>We prioritize your shopping experience with easy browsing, secure checkout, and prompt support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team / CTA Section */}
      <section className="py-16 px-6 bg-white text-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-6">Meet Kristi</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          A passionate team of designers, stylists, and fashion enthusiasts working to bring you the best in clothing and accessories for men and women. Our mission is to make style effortless and shopping joyful.
        </p>
        <Link 
          href="/shop" 
          className="bg-[#111111] text-white px-10 py-3 cursor-pointer hover:translate-y-1 hover:bg-black hover:text-white transition-all duration-300 uppercase text-sm font-bold tracking-tighter"
        >
          Shop Now
        </Link>
      </section>

    </div>
  );
};

export default AboutUs;
