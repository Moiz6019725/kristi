"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCollections(data);
        } else if (Array.isArray(data.collections)) {
          setCollections(data.collections);
        } else if (Array.isArray(data.data)) {
          setCollections(data.data);
        } else {
          setCollections([]);
        }
      } catch (error) {
        console.error(error);
        setCollections([]);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 md:gap-8 justify-center overflow-x-auto whitespace-nowrap py-4 px-4 md:px-6 scrollbar-hide">
      {collections.map((collection) => (
        <Link key={collection._id} href={`/collection/${collection._id}`}>
          <div className="shrink-0 relative hover:scale-[1.03] transition-all ease-in-out text-center cursor-pointer flex flex-col items-center justify-center">
            {/* Circular Image */}
            <div className="w-29 h-29 sm:w-36 rounded-sm sm:h-36 md:w-52 md:h-52 overflow-hidden">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <div className="mt-2 flex justify-between items-center rounded-sm w-11/12 absolute bottom-2 bg-[#ffffffc9] backdrop-blur-md text-xs sm:text-sm md:text-lg font-medium leading-tight px-4">
              {collection.name}
              <ArrowRight size={14} className="inline-block ml-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Collections;
