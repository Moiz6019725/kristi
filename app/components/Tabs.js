"use client";
import { useState } from "react";
import Link from "next/link";

const ProductTabs = ({ description, reviews }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-center border-b gap-14 border-gray-200">
        <button
          onClick={() => setActiveTab("description")}
          className={`py-2 px-4 font-semibold ${
            activeTab === "description"
              ? "text-black border-b-2  border-black"
              : "text-gray-500 border-b-2  border-transparent hover:text-black hover:border-black"
          }`}
        >
          Description
        </button>

        <button
          onClick={() => setActiveTab("shipping&return")}
          className={`py-2 px-4 font-semibold ${
            activeTab === "shipping&return"
              ? "text-black border-b-2 border-black"
              : "text-gray-500 border-b-2 border-transparent hover:text-black hover:border-black"
          }`}
        >
          Shipping & Return
        </button>
      </div>

      {/* Tabs Content */}
      <div className="mt-4">
        {activeTab === "description" && (
          <p className="text-gray-600 whitespace-pre-line">{description}</p>
        )}

        {activeTab === "shipping&return" && (
          <div className="text-gray-600 space-y-6">
            <p>
              Thank you for shopping with <strong>Kristi</strong>! We are
              committed to providing you with a seamless experience. Please
              review our policies below.
            </p>

            <hr className="border-gray-200" />

            {/* Shipping Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Shipping Policy
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Processing Time:</strong> Orders are typically
                  processed within 1 business day after payment confirmation.
                </li>
                <li>
                  <strong>Shipping Method:</strong> We offer reliable standard
                  shipping for all orders. You will receive a tracking number
                  via email once shipped.
                </li>
                <li>
                  <strong>Delivery Time:</strong> Generally 2 to 3 business
                  days, depending on your location.
                </li>
              </ul>
            </section>

            {/* Return Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Return Policy
              </h3>
              <p className="mb-2">
                We offer a <strong>7-day return policy</strong> on all tech
                products.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Eligibility:</strong> Items must be unused, undamaged,
                  and include all original parts/accessories.
                </li>
                <li>
                  <strong>Exclusions:</strong> Sale or clearance items are final
                  sale and cannot be returned.
                </li>
                <li>
                  <strong>Refunds:</strong> Processed within 10 business days to
                  your original payment method (Credit Card, Bank Transfer, or
                  local Pakistani payment methods).
                </li>
              </ul>
            </section>

            {/* How to Return */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <blockquote class="p-4 my-4 border-s-4 border-default bg-neutral-secondary-soft">
                <p class="text-xl italic font-medium leading-relaxed text-heading">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">
                    How to Return a Product
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>
                      Contact us within 7 days of delivery with your order
                      number.
                    </li>
                    <li>We will provide you with a return shipping label.</li>
                    <li>Pack the product securely and ship it back.</li>
                  </ol>
                </p>
              </blockquote>
            </section>

            {/* Contact */}
            <p className="text-sm italic">
              Questions? Contact our team at:{" "}
              <Link
                href="mailto:Support@talhareviews.store"
                className="text-blue-600 underline"
              >
                Support@kristi.com
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
