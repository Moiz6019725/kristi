"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();

        // 👇 handle different API response formats
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
    <div className="flex gap-16 justify-center overflow-x-auto whitespace-nowrap py-4 px-2 scrollbar-hide">
      {collections.map((collection) => (
        <Link key={collection._id} href={`/collection/${collection._id}`}>
          <div
            key={collection._id}
            className="shrink-0 hover:scale-[1.03] transition-all ease-in-out text-center cursor-pointer flex flex-col items-center justify-center"
          >
            {/* Circular Image */}
            <div className="w-42 h-42 rounded-full overflow-hidden shadow-sm">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <p className="mt-2 text-sm font-medium">{collection.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Collections;
