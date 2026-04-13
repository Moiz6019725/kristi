"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cart/cartSlice";
import { ChevronDown, ChevronUp } from "lucide-react";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);

  // FILTER STATES (multi-select)
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sort, setSort] = useState("");

  // Accordion open states
  const [openFilter, setOpenFilter] = useState({
    collections: false,
    vendors: false,
    types: false,
  });

  const dispatch = useDispatch();

  const fetchProducts = async () => {
    const res = await fetch("/api/getProducts");
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // UNIQUE FILTER OPTIONS
  const collections = [
    ...new Set(products.map((p) => p.collection?.name || "Uncategorized")),
  ];
  const vendors = [...new Set(products.map((p) => p.vendor || "Unknown"))];
  const types = [...new Set(products.map((p) => p.productType || "Unknown"))];

  // FILTER LOGIC
  let filteredProducts = products.filter((p) => {
    const colMatch =
      selectedCollections.length === 0 ||
      selectedCollections.includes(p.collection?.name || "Uncategorized");
    const vendorMatch =
      selectedVendors.length === 0 ||
      selectedVendors.includes(p.vendor || "Unknown");
    const typeMatch =
      selectedTypes.length === 0 ||
      selectedTypes.includes(p.productType || "Unknown");
    return colMatch && vendorMatch && typeMatch;
  });

  if (sort === "low-high") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filteredProducts.sort((a, b) => b.price - a.price);

  // HANDLERS
  const toggleSelection = (value, selected, setSelected) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCollections([]);
    setSelectedVendors([]);
    setSelectedTypes([]);
    setSort("");
  };

  const toggleAccordion = (filterName) => {
    setOpenFilter((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  return (
    <div className="w-[96%] mx-auto mt-10 flex flex-col lg:flex-row gap-6">
      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-64  p-5 rounded-xl h-fit">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

        {/* COLLECTIONS */}
        <div className="mb-5">
          <button
            onClick={() => toggleAccordion("collections")}
            className="flex justify-between w-full font-semibold text-gray-700 uppercase mb-2 hover:text-blue-600 transition-colors"
          >
            Collections{" "}
            {openFilter.collections ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openFilter.collections ? "max-h-96" : "max-h-0"}`}
          >
            {collections.map((c, i) => (
              <label
                key={i}
                className="flex items-center gap-2 text-gray-700 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCollections.includes(c)}
                  onChange={() =>
                    toggleSelection(
                      c,
                      selectedCollections,
                      setSelectedCollections,
                    )
                  }
                  className="accent-black"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* VENDORS */}
        <div className="mb-5">
          <button
            onClick={() => toggleAccordion("vendors")}
            className="flex justify-between w-full font-semibold text-gray-700 uppercase mb-2 hover:text-blue-600 transition-colors"
          >
            Vendors{" "}
            {openFilter.vendors ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openFilter.vendors ? "max-h-96" : "max-h-0"}`}
          >
            {vendors.map((v, i) => (
              <label
                key={i}
                className="flex items-center gap-2 text-gray-700 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(v)}
                  onChange={() =>
                    toggleSelection(v, selectedVendors, setSelectedVendors)
                  }
                  className="accent-black"
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* TYPES */}
        <div className="mb-5">
          <button
            onClick={() => toggleAccordion("types")}
            className="flex justify-between w-full font-semibold text-gray-700 uppercase mb-2 hover:text-blue-600 transition-colors"
          >
            Types{" "}
            {openFilter.types ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openFilter.types ? "max-h-96" : "max-h-0"}`}
          >
            {types.map((t, i) => (
              <label
                key={i}
                className="flex items-center gap-2 text-gray-700 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={() =>
                    toggleSelection(t, selectedTypes, setSelectedTypes)
                  }
                  className="accent-black"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* SORT */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 uppercase">
            Sort By
          </h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Default</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </select>
        </div>

        {/* CLEAR BUTTON */}
        <button
          onClick={clearAllFilters}
          className="bg-[#111111] w-full text-white px-5 py-2 cursor-pointer hover:scale-[1.07] hover:bg-black hover:text-white transition-all duration-300 uppercase text-sm font-bold tracking-tighter"
        >
          Clear All
        </button>
      </aside>

      {/* RIGHT PRODUCTS GRID */}
      <main className="flex-1">
        {/* Active Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCollections.map((c) => (
            <span
              key={c}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition"
              onClick={() =>
                setSelectedCollections(
                  selectedCollections.filter((v) => v !== c),
                )
              }
            >
              {c} ✕
            </span>
          ))}
          {selectedVendors.map((v) => (
            <span
              key={v}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-green-200 transition"
              onClick={() =>
                setSelectedVendors(selectedVendors.filter((val) => val !== v))
              }
            >
              {v} ✕
            </span>
          ))}
          {selectedTypes.map((t) => (
            <span
              key={t}
              className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-purple-200 transition"
              onClick={() =>
                setSelectedTypes(selectedTypes.filter((val) => val !== t))
              }
            >
              {t} ✕
            </span>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden ">
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-[#f3f3f3]">
                  <img
                    src={product.images?.[0] || product.images?.[1]}
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
                        dispatch(
                          addItem({
                            id: product._id,
                            title: product.title,
                            price: product.price,
                            compareAtPrice: product.compareAtPrice,
                            image: product.images?.[0] || "",
                          }),
                        );
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
      </main>
    </div>
  );
};

export default Page;
