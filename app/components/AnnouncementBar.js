"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {TiktokIcon,Facebook02Icon,InstagramIcon} from "@hugeicons/core-free-icons"
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
    }, 3000); // rotates every 3s
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-black sticky text-white text-sm py-2 px-4 flex items-center justify-between">
      {/* Left: Social icons */}
      <div className="flex items-center gap-2 basis-[33%]">
        <span>Welcome to KristLink store!</span>
        <Link href="#"><HugeiconsIcon icon={Facebook02Icon} size={18} /></Link>
        <Link href="#"><HugeiconsIcon icon={InstagramIcon} size={18} /></Link>
        <Link href="#"><HugeiconsIcon icon={TiktokIcon} size={18} /></Link>
      </div>

      {/* Center: Announcement with arrows */}
      <div className="flex items-center gap-2 basis-[33%] justify-center">
        <button onClick={handlePrev}><ChevronLeft size={16} /></button>
        <span className="mx-2">{announcements[index]}</span>
        <button onClick={handleNext}><ChevronRight size={16} /></button>
      </div>
      <div className="flex items-center gap-2 basis-[33%]">
      </div>
    </div>
  );
};

export default AnnouncementBar;
