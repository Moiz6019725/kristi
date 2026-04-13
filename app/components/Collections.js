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

        setCollections(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.collections)
            ? data.collections
            : Array.isArray(data?.data)
            ? data.data
            : []
        );
      } catch (err) {
        console.error(err);
        setCollections([]);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-4">

      {/* IMPORTANT: fixed uniform grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">

        {collections.map((collection) => (
          <Link key={collection._id} href={`/collection/${collection._id}`}>
            
            {/* FORCE SAME SIZE CARD */}
            <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">

              {/* IMAGE FIXED */}
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm text-white px-2 py-2 flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium truncate">
                  {collection.name}
                </span>
                <ArrowRight size={14} />
              </div>

            </div>
          </Link>
        ))}

      </div>
    </div>
  );
};

export default Collections;
