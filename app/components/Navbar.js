"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateQuantity } from "../../redux/cart/cartSlice"; // Adjust the path to your cartSlice file
import {
  Search01Icon,
  ShoppingCart02Icon,
  Cancel01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items); // Redux cart items
  const totalPrice = useSelector((state) => state.cart.totalPrice); // Use Redux totalPrice for subtotal
  const totalQuantity = useSelector((state) => state.cart.totalQuantity); // Use Redux totalQuantity

  // 🔒 SAFETY: always work with array
  const safeCart = Array.isArray(cartItems) ? cartItems : [];

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  const linkClass = (path) =>
    `relative pb-1 ${
      pathname === path
        ? "after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-black"
        : ""
    }`;

  // ➕ increase qty
  const increaseQty = (id) => {
    const item = safeCart.find((item) => item.id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.quantity + 1 }));
    }
  };

  // ➖ decrease qty
  const decreaseQty = (id) => {
    const item = safeCart.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id, quantity: item.quantity - 1 }));
    } else if (item && item.quantity === 1) {
      dispatch(removeItem(id)); // Remove if quantity reaches 0
    }
  };

  // ❌ remove item
  const removeItemFromCart = (id) => {
    dispatch(removeItem(id));
  };

  const handleCheckout = () => {
    localStorage.setItem("checkoutProduct", JSON.stringify(safeCart));
    setIsDrawerOpen(false);
    router.push("/checkout");
  };

  // Search functionality: Fetch from /api/getProducts
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      // Assuming the API accepts a query param, e.g., /api/getProducts?q=query
      const response = await fetch(
        `/api/getProducts?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Assuming data is an array of products: [{ id, title, price, ... }]
      const products = Array.isArray(data) ? data : data.products || [];
      // Filter client-side if API doesn't filter (optional, but since API might handle it)
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
    } catch (err) {
      setSearchError("Error fetching products: " + err.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // Debounce to avoid too many requests

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex h-24 items-center justify-between sticky top-0 z-20 border-b border-b-[#e7e7e7] bg-white">
        <div className="px-8">
          <Link href={"/"}>
            <img width={100} src="/Logo.png" alt="Logo" />
          </Link>
        </div>

        <ul className="flex gap-8 font-semibold">
          {[
            ["/", "Home"],
            ["/shop", "Shop"],
            ["/arrivals", "New Arrivals"],
            ["/orders", "Orders"],
            ["/contact", "Contact"],
          ].map(([path, label]) => (
            <li key={path}>
              <Link href={path} className={linkClass(path)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex gap-6 px-6 items-center">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="cursor-pointer relative hover:scale-[1.08] transition" 
          >
            <HugeiconsIcon icon={Search01Icon} size={26} />
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="cursor-pointer relative hover:scale-[1.08] transition"
          >
            <HugeiconsIcon icon={ShoppingCart02Icon} size={26} />
            {safeCart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24">
          <div className="w-full bg-white max-w-3xl mx-4 rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-white rounded-md focus:outline-none"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="cursor-pointer hover:scale-[1.4] hover:rotate-180 transition"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
              </button>
            </div>
            {searchLoading ? (
              <p className="text-gray-500">Searching...</p>
            ) : searchError ? (
              <p className="text-red-500">{searchError}</p>
            ) : searchResults.length > 0 ? (
              <ul className="space-y-2 max-h-80 grid grid-cols-4 gap-2 overflow-y-auto">
                {searchResults.map((product) => (
                  <li
                    key={product._id}
                    className="p-2 border-b border-gray-200"
                  >
                    <Link
                      href={`/product/${product._id}`}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                      }}
                    >
                      <img src={product.images[0]} alt="" />
                      <div className="font-semibold line-clamp-2">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        Rs. {product.price}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : searchQuery ? (
              <p className="text-gray-500">No products found.</p>
            ) : null}
          </div>
        </div>
      )}

      {/* OVERLAY */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 z-40 h-screen w-105 bg-white shadow-xl transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5">
          <h3 className="flex items-center gap-3 text-[32px] font-bold">
            Cart
            <span className="h-7 min-w-7 flex items-center justify-center rounded-full bg-gray-200 text-sm font-medium px-1">
              {totalQuantity}
            </span>
          </h3>

          <button
            className="cursor-pointer hover:scale-[1.2] hover:-translate-z-0.5 transition"
            onClick={() => setIsDrawerOpen(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="px-6 py-4 overflow-y-auto h-[calc(100vh-220px)]">
          {safeCart.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-3xl text-[#3b3b3b] font-bold mb-4">
                Your cart is empty
              </p>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="cursor-pointer px-6 py-3 bg-black text-sm font-semibold rounded-xl hover:bg-[#303030] text-white transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {safeCart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-5">
                  <img
                    src={item.image}
                    className="w-14 h-14 object-cover bg-gray-100"
                  />

                  <div className="">
                    <h4 className="text-base font-semibold line-clamp-3">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-900 mt-2">
                      Rs. {item.price}
                    </p>
                    <p className="text-sm line-through text-gray-500 mb-2">
                      Rs. {item.compareAtPrice}
                    </p>

                    <div className="flex gap-8">
                      <div className="flex items-center gap-2 border border-[#e7e7e7] w-fit px-2 py-1">
                        <button
                          className="cursor-pointer"
                          onClick={() => decreaseQty(item.id)}
                        >
                          <HugeiconsIcon icon={MinusSignIcon} size={14} />
                        </button>

                        <span className="text-sm font-medium min-w-5 text-center">
                          {item.quantity}
                        </span>

                        <button
                          className="cursor-pointer"
                          onClick={() => increaseQty(item.id)}
                        >
                          <HugeiconsIcon icon={PlusSignIcon} size={14} />
                        </button>
                      </div>
                      <button
                        className="cursor-pointer"
                        onClick={() => removeItemFromCart(item.id)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="font-normal text-base">
                    Rs.{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {safeCart.length > 0 && (
          <div className="px-6 py-5 space-y-4 sticky bottom-0 bg-white">
            <div className="flex justify-between text-sm font-semibold">
              <div className="flex flex-col">
                <span className="text-[#303030]">Estimated total</span>
                <p className="text-[11px] text-gray-500 text-center">
                  Taxes & shipping calculated at checkout
                </p>
              </div>
              <span className="text-3xl font-normal">
                Rs. {totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full cursor-pointer bg-black text-white py-3 text-sm rounded-xl tracking-wide hover:opacity-90 transition"
            >
              Check Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
