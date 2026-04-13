"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  TiktokIcon,
  Facebook02Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const announcements = [
  "Summer Sale Live Now 35%. Shop Sale",
  "Free Shipping on Orders Over Rs. 3000",
  "New Arrivals in Girls Outfits",
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setIndex(
      (prev) => (prev - 1 + announcements.length) % announcements.length,
    );
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-black sticky z-20 text-white text-xs md:text-sm py-2 px-3 md:px-4 flex items-center justify-between gap-2">
      {/* Left: Welcome + social icons — hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 basis-[33%]">
        <span className="whitespace-nowrap">Welcome to KristLink store!</span>
        <Link href="#">
          <HugeiconsIcon icon={Facebook02Icon} size={18} />
        </Link>
        <Link href="#">
          <HugeiconsIcon icon={InstagramIcon} size={18} />
        </Link>
        <Link href="#">
          <HugeiconsIcon icon={TiktokIcon} size={18} />
        </Link>
      </div>

      {/* Center: Announcement with arrows */}
      <div className="flex items-center gap-1 md:gap-2 flex-1 md:basis-[33%] justify-center">
        <button
          onClick={handlePrev}
          className="shrink-0 opacity-70 hover:opacity-100 transition"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-center leading-tight px-1 line-clamp-1">
          {announcements[index]}
        </span>
        <button
          onClick={handleNext}
          className="shrink-0 opacity-70 hover:opacity-100 transition"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Right: Social icons on mobile only, empty on desktop */}
      <div className="flex md:hidden items-center gap-2">
        <Link href="#">
          <HugeiconsIcon icon={InstagramIcon} size={16} />
        </Link>
        <Link href="#">
          <HugeiconsIcon icon={TiktokIcon} size={16} />
        </Link>
      </div>

      {/* Spacer on desktop to keep center balanced */}
      <div className="hidden md:flex basis-[33%]" />
    </div>
  );
};

export default AnnouncementBar;
