import React from "react";
import {
  LocationShare01Icon,
  CallIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons/index";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#111111] text-white">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-2 gap-6 px-4 py-6 lg:py-8 md:grid-cols-[2fr_1fr_1fr_1fr_2fr]">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-heading">
                About Us
              </h2>
              <p className="text-sm text-gray-400">
                We only carry designs we believe in ethically and aesthetically
                – original, authentic pieces that are made to last.{" "}
                <Link className="text-white underline font-bold" href="">
                  Learn more
                </Link>
              </p>
              <div className="text-white font-medium my-4 flex text-sm flex-col gap-2">
                <span className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={LocationShare01Icon}
                    className="w-5 h-5 shrink-0"
                  />
                  Malikpur Aiwan E Khas, Sheikhupura Road, Faisalabad.
                </span>

                <span className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CallIcon}
                    className="w-5 h-5 shrink-0"
                  />
                  +92 315 7378892
                </span>

                <span className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="w-5 h-5 shrink-0"
                  />
                  kristi@gmail.com
                </span>
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-heading">
                Shop Categories
              </h2>
              <ul className="text-sm text-gray-400">
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Gents
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Ladies Suits
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Bags & Watches
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Shoes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-heading">
                Customer Care
              </h2>
              <ul className="text-sm text-gray-400">
                <li className="mb-3">
                  <Link href="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    FAQ's
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-heading">
                Our Policies
              </h2>
              <ul className="text-sm text-gray-400">
                <li className="mb-3">
                  <Link href="/terms-of-service" className="hover:underline">
                    Terms Of Service
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Shipping Policy
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Refund Policy
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Return Policy
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    FAQ's
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-heading">
                Subscribe to get 10% OFF
              </h2>
              <p className="text-gray-400 text-sm">
                Subscribe for store updates and discounts.
              </p>
              <input
                className="w-full my-4 border border-[#9e9e9e] rounded-[20px] p-2"
                type="text"
                placeholder="Enter your email..."
              />
              <p className="text-gray-400 text-sm">
                ***By entering the e-mail you accept the{" "}
                <span className="text-white font-bold">
                  terms and conditions
                </span>{" "}
                and the{" "}
                <span className="font-bold text-white">privacy policy.</span>
              </p>
            </div>
          </div>
          <div className="px-4 py-6 bg-neutral-secondary-soft md:flex md:items-center md:justify-between">
            <span className="text-sm text-body sm:text-center text-gray-400">
              © 2026 <Link href="https://flowbite.com/">Kristi™</Link>. All Rights
              Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center md:mt-0 space-x-4 rtl:space-x-reverse">
              {/* Facebook */}
              <Link href="#" className="text-body hover:text-heading border border-gray-700 rounded-full p-2">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>

              {/* Instagram */}
              <Link href="#" className="text-body hover:text-heading border border-gray-700 rounded-full p-2">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Z" />
                  <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>

              {/* TikTok */}
              <Link href="#" className="text-body hover:text-heading border border-gray-700 rounded-full p-2">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.5 3c.7 1.8 2.2 3.2 4 3.7V10c-1.8 0-3.4-.6-4.8-1.6V15a6 6 0 1 1-6-6c.3 0 .6 0 .9.1V12a3 3 0 1 0 3 3V3h2.9Z" />
                </svg>
                <span className="sr-only">TikTok</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
