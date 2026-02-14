import React from "react";
import Link from "next/link";

const ContactPage = () => {
  return (
    <>
      <header className="py-12 text-center">
        <nav className="text-sm text-gray-500 mb-2">
          Home <span className="mx-2">•</span> Contact
        </nav>
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600">
          Please use the below form. You can also call customer service on
        </p>
        <p className="font-semibold text-lg">+92 315 7378892</p>
      </header>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="map-container rounded-lg overflow-hidden shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51657.3481498165!2d-95.6601445!3d37.0094705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b80a4237d40f89%3A0x6b809a4746f3801a!2sFawn%20Creek%20Township%2C%20KS!5e0!3m2!1sen!2sus!4v1704481234567"
            height="450"
            // Fixed style syntax: React requires an object for styles
            style={{ border: 0, width: "100%" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div>
          <h2 className="text-2xl font-bold mb-6">Support Customer</h2>
          <p className="text-gray-600 mb-8">
            Have a question? Please contact us using the customer support
            channels below.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900">Customer Care:</h3>
              <p>Phone: +92 315 7378892</p>
              <p>Email: kristi@gmail.com</p>
              <p>Opening hours: Everyday 8:00am – 5:00pm</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900">Wholesale:</h3>
              <p>Email: kristi@gmail.com</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900">Support Email:</h3>
              <p>Email: Help@kristi.com</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Please submit all general enquiries in the contact form below and we
            look forward to hearing from you soon.
          </p>

          <form action="#" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full p-4 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <textarea
              rows="6"
              placeholder="Enter please your message"
              className="w-full p-6 border border-gray-200 rounded-3xl focus:outline-none focus:ring-1 focus:ring-black"
            ></textarea>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="privacy"
                className="w-4 h-4 accent-black"
              />
              {/* Use htmlFor instead of for in React */}
              <label htmlFor="privacy" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="#" className="underline font-semibold">
                  Privacy Policy
                </Link>{" "}
                of the website.
              </label>
            </div>

            <button
              type="submit"
              className="bg-black text-white px-10 py-3 rounded-full hover:bg-gray-800 transition duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default ContactPage;