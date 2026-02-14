"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cart/cartSlice";

const ProductAddCard = (props) => {
  const dispatch = useDispatch();
  const [addingId, setAddingId] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const products = JSON.parse(props.products);

  // 🔹 SORT LOGIC (UI unchanged)
  const sortedProducts = useMemo(() => {
    let list = [...products];

    if (sortBy === "low-high") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high-low") {
      list.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return list;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen">

      {/* 🔗 Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6 text-sm text-gray-500">
        Home / Collections / <span className="text-black">{props.title}</span>
      </div>

      {/* 🏷 Collection Header */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{props.title}</h1>
          <p className="text-gray-600 mt-2">
            Premium products curated for you
          </p>
        </div>

        {/* 🔍 Sort Dropdown (same UI, added logic only) */}
        <select
          className="mt-4 md:mt-0 rounded-lg px-4 py-2 bg-gray-50"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* 🧱 Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {sortedProducts.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}>
            <div className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden">

              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-[#f3f3f3]">
                <img
                  src={product.images?.[0] || product.images?.[1]}
                  alt={product.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />

                {product.compareAtPrice > product.price && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    Sale
                  </span>
                )}

                {/* Add to Cart */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setAddingId(product._id);
                      dispatch(
                        addItem({
                          id: product._id,
                          title: product.title,
                          price: product.price,
                          compareAtPrice: product.compareAtPrice,
                          image: product.images?.[0] || "",
                        })
                      );
                      setTimeout(() => setAddingId(null), 1200);
                    }}
                    className={`w-full py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      addingId === product._id
                        ? "bg-black text-white scale-95 ring-2 ring-green-300"
                        : "bg-black text-white hover:scale-[0.98]"
                    }`}
                  >
                    {addingId === product._id ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col items-center text-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Premium Selection
                </span>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                  {product.title}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-1 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center gap-3">
                  {product.compareAtPrice > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      Rs.{product.compareAtPrice}
                    </span>
                  )}
                  <span className="text-sm font-black text-black">
                    Rs.{product.price}
                  </span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductAddCard;
