"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addItem } from "@/redux/cart/cartSlice";
import { useDispatch } from "react-redux";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    fetch("/api/getProducts")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products.slice(0, 4)); // ✅ FIX
      });
  }, []);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}>
            <div className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden ">
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-[#f3f3f3]">
                <img
                  src={product.images?.[1] || product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />

                {/* Sale Badge */}
                {product.compareAtPrice > product.price && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    Sale
                  </span>
                )}

                {/* Add to Cart */}
                <div className="absolute  inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setAddingId(product._id);
                      dispatch(addItem({
                        id: product._id,
                        title: product.title,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        image: product.images?.[0] || ''
                      }));
                      setTimeout(() => setAddingId(null), 1200);
                    }}
                    className={`w-full cursor-pointer py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
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
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-900 transition-colors">
                  {product.title}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-1 mb-3 max-w-[90%] uppercase tracking-tighter">
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
}
