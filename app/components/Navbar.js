"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateQuantity } from "../../redux/cart/cartSlice";
import {
  Search01Icon,
  ShoppingCart02Icon,
  Cancel01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const safeCart = Array.isArray(cartItems) ? cartItems : [];

  useEffect(() => {
    if (isDrawerOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen, isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const linkClass = (path) =>
    `relative pb-1 ${
      pathname === path
        ? "after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-black"
        : ""
    }`;

  const mobileLinkClass = (path) =>
    `text-2xl font-semibold py-3 border-b border-gray-100 w-full text-left ${
      pathname === path ? "text-black" : "text-gray-600"
    }`;

  const increaseQty = (id) => {
    const item = safeCart.find((item) => item.id === id);
    if (item) dispatch(updateQuantity({ id, quantity: item.quantity + 1 }));
  };

  const decreaseQty = (id) => {
    const item = safeCart.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id, quantity: item.quantity - 1 }));
    } else if (item && item.quantity === 1) {
      dispatch(removeItem(id));
    }
  };

  const removeItemFromCart = (id) => dispatch(removeItem(id));

  const handleCheckout = () => {
    localStorage.setItem("checkoutProduct", JSON.stringify(safeCart));
    setIsDrawerOpen(false);
    router.push("/checkout");
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `/api/getProducts?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products || [];
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
    const debounceTimer = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const navLinks = [
    ["/", "Home"],
    ["/shop", "Shop"],
    ["/arrivals", "New Arrivals"],
    ["/orders", "Orders"],
    ["/contact", "Contact"],
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex h-18 md:h-24 items-center justify-between sticky top-0 z-20 border-b border-b-[#e7e7e7] bg-white px-4 md:px-0">
        {/* LOGO */}
        <div className="md:px-8">
          <Link href={"/"}>
            <img
              width={80}
              className="md:w-25"
              src="/Logo.png"
              alt="Logo"
            />
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <ul className="hidden md:flex gap-8 font-semibold">
          {navLinks.map(([path, label]) => (
            <li key={path}>
              <Link href={path} className={linkClass(path)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex gap-4 md:gap-6 px-0 md:px-6 items-center">
          {/* Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="cursor-pointer relative hover:scale-[1.08] transition"
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={22}
              className="md:w-6.5 md:h-6.5"
            />
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="cursor-pointer relative hover:scale-[1.08] transition"
          >
            <HugeiconsIcon
              icon={ShoppingCart02Icon}
              size={22}
              className="md:w-6.5 md:h-6.5"
            />
            {safeCart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden cursor-pointer hover:scale-[1.08] transition"
            aria-label="Open menu"
          >
            <HugeiconsIcon icon={Menu01Icon} size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-white shadow-xl transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <Link href={"/"} onClick={() => setIsMobileMenuOpen(false)}>
            <img width={80} src="/Logo.png" alt="Logo" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="cursor-pointer hover:scale-[1.2] transition"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
        </div>

        <ul className="flex flex-col px-6 pt-4">
          {navLinks.map(([path, label]) => (
            <li key={path}>
              <Link
                href={path}
                className={mobileLinkClass(path)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-16 md:pt-24 px-3 md:px-0">
          <div className="w-full bg-white max-w-3xl rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-2 bg-white rounded-md focus:outline-none text-sm md:text-base"
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
              <p className="text-gray-500 text-sm p-2">Searching...</p>
            ) : searchError ? (
              <p className="text-red-500 text-sm p-2">{searchError}</p>
            ) : searchResults.length > 0 ? (
              <ul className="max-h-72 md:max-h-80 grid grid-cols-2 md:grid-cols-4 gap-2 overflow-y-auto mt-2">
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
                      <img src={product.images[0]} alt="" className="w-full" />
                      <div className="font-semibold line-clamp-2 text-sm mt-1">
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
              <p className="text-gray-500 text-sm p-2">No products found.</p>
            ) : null}
          </div>
        </div>
      )}

      {/* CART OVERLAY */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* CART DRAWER */}
      <div
        className={`fixed top-0 right-0 z-40 h-screen w-full sm:w-105 bg-white shadow-xl transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 md:px-6 py-4 md:py-5">
          <h3 className="flex items-center gap-3 text-2xl md:text-[32px] font-bold">
            Cart
            <span className="h-7 min-w-7 flex items-center justify-center rounded-full bg-gray-200 text-sm font-medium px-1">
              {totalQuantity}
            </span>
          </h3>
          <button
            className="cursor-pointer hover:scale-[1.2] transition"
            onClick={() => setIsDrawerOpen(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="px-4 md:px-6 py-4 overflow-y-auto h-[calc(100vh-180px)] md:h-[calc(100vh-220px)]">
          {safeCart.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-2xl md:text-3xl text-[#3b3b3b] font-bold mb-4">
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
                <div
                  key={item.id}
                  className="flex gap-3 md:gap-4 pb-5 border-b border-gray-100"
                >
                  <img
                    src={item.image}
                    className="w-16 h-16 md:w-14 md:h-14 object-cover bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-semibold line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-900 mt-1">
                      Rs. {item.price}
                    </p>
                    <p className="text-xs line-through text-gray-500 mb-2">
                      Rs. {item.compareAtPrice}
                    </p>
                    <div className="flex gap-6 items-center">
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
                  <div className="font-normal text-sm md:text-base flex-shrink-0">
                    Rs.{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {safeCart.length > 0 && (
          <div className="px-4 md:px-6 py-4 md:py-5 space-y-4 sticky bottom-0 bg-white border-t border-gray-100">
            <div className="flex justify-between items-start text-sm font-semibold">
              <div className="flex flex-col">
                <span className="text-[#303030]">Estimated total</span>
                <p className="text-[11px] text-gray-500">
                  Taxes & shipping calculated at checkout
                </p>
              </div>
              <span className="text-2xl md:text-3xl font-normal">
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
