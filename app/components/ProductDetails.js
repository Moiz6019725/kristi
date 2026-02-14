"use client";

import { useRouter } from "next/navigation";
import ProductGallery from "@/app/components/ProductGallery";
import QuantityPicker from "@/app/components/QuantityPicker";
import { addItem } from "@/redux/cart/cartSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  TiktokIcon,
  Facebook02Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function ProductDetails(props) {
  const product = JSON.parse(props.product);
  const dispatch = useDispatch();
  const router = useRouter();
  const [report, setReport] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [addingId, setAddingId] = useState(null);

  // Variant selection state
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
// Find matching variant based on selected options
  const findMatchingVariant = (options) => {
    if (!product.variants) return null;
    
    return product.variants.find((variant) => {
      return Object.keys(options).every((key) => {
        return variant[key] === options[key];
      });
    });
  };

  // Initialize selected options with first values
  useState(() => {
    if (product.hasVariants && product.options) {
      const initialOptions = {};
      product.options.forEach((option, index) => {
        initialOptions[`option${index + 1}`] = option.values[0] || "";
      });
      setSelectedOptions(initialOptions);
      
      // Find matching variant
      if (product.variants && product.variants.length > 0) {
        const variant = findMatchingVariant(initialOptions);
        setSelectedVariant(variant);
      }
    }
  }, []);

  
  // Handle option selection
  const handleOptionChange = (optionIndex, value) => {
    const optionKey = `option${optionIndex + 1}`;
    const newOptions = {
      ...selectedOptions,
      [optionKey]: value,
    };
    setSelectedOptions(newOptions);
    
    // Find and set matching variant
    const variant = findMatchingVariant(newOptions);
    setSelectedVariant(variant);
  };

  // Get current price (from variant or base product)
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product.price;
  };

  // Get current compare at price
  const getCurrentComparePrice = () => {
    if (selectedVariant) {
      return selectedVariant.compareAtPrice;
    }
    return product.compareAtPrice;
  };

  // Get selected variant display text
  const getVariantText = () => {
    if (!selectedVariant) return "";
    const values = [
      selectedVariant.option1,
      selectedVariant.option2,
      selectedVariant.option3,
    ].filter(Boolean);
    return values.join(" / ");
  };

  const handleBuyNow = () => {
    const currentPrice = getCurrentPrice();
    const currentComparePrice = getCurrentComparePrice();
    
    // Store product in localStorage for the checkout page
    localStorage.setItem(
      "checkoutProduct",
      JSON.stringify([
        {
          id: product._id,
          title: product.title,
          price: currentPrice,
          compareAtPrice: currentComparePrice,
          quantity: 1,
          image: product.images?.[0] || "",
          variant: product.hasVariants ? getVariantText() : null,
          sku: selectedVariant?.sku || null,
        },
      ])
    );
    // Navigate to checkout page
    router.push("/checkout");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    const currentPrice = getCurrentPrice();
    const currentComparePrice = getCurrentComparePrice();

    dispatch(
      addItem({
        id: product._id,
        title: product.title,
        price: currentPrice,
        compareAtPrice: currentComparePrice,
        image: product.images?.[0] || "",
        variant: product.hasVariants ? getVariantText() : null,
        sku: selectedVariant?.sku || null,
      })
    );

    setAddingId(product._id);
    setTimeout(() => setAddingId(null), 1200);
  };

  const handleChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
      productId: product._id,
    });
  };

  const handleReportSubmit = () => {
    if (!report.reason) {
      alert("Please select a reason");
      return;
    }

    console.log(report);

    setReport({});
    setShowReport(false);
    alert("Product reported successfully");
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this product: ${product.title}`;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={product.images} />

        <div>
          <h1 className="text-3xl font-semibold">{product.title}</h1>

          <div className="flex gap-4 mt-5 items-center">
            <span className="text-[24px] text-[#E84E4E]">
              Rs. {getCurrentPrice()}
            </span>
            {getCurrentComparePrice() > getCurrentPrice() && (
              <span className="text-sm text-gray-400 line-through">
                Rs. {getCurrentComparePrice()}
              </span>
            )}
            {getCurrentComparePrice() > getCurrentPrice() && (
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-md">
                {(
                  ((getCurrentComparePrice() - getCurrentPrice()) /
                    getCurrentComparePrice()) *
                  100
                ).toFixed(0)}
                % OFF
              </span>
            )}
          </div>

          {/* Variant Selection */}
          {product.hasVariants && product.options && (
            <div className="mt-6 space-y-4">
              {product.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value, valueIndex) => {
                      const isSelected =
                        selectedOptions[`option${optionIndex + 1}`] === value;
                      
                      return (
                        <button
                          key={valueIndex}
                          onClick={() => handleOptionChange(optionIndex, value)}
                          className={`px-4 py-2 cursor-pointer rounded-lg border-2 font-medium transition-all ${
                            isSelected
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Selected Variant Info */}
              {selectedVariant && selectedVariant.sku && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">SKU:</span> {selectedVariant.sku}
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 flex gap-12">
            <QuantityPicker id={product._id} />
            <button
              onClick={handleAddToCart}
              className="flex-1 border cursor-pointer hover:scale-[1.03] transition-all ease border-black rounded-xl text-black h-11 font-bold"
            >
              {addingId === product._id ? "Added ✓" : "Add to Cart"}
            </button>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 cursor-pointer rounded-xl hover:scale-[1.03] transition-all ease-in-out bg-black text-white h-11 font-bold"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <button>♡ Add to Wishlist</button>
            <button
              onClick={() => setShowReport(true)}
              className="text-red-500 cursor-pointer"
            >
              🚩 Report Product
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 text-sm text-gray-600">
            {/* Share section */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wide text-gray-400">
                Social Share :
              </span>

              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3A559F] flex h-9 w-9 items-center justify-center hover:-translate-y-0.5 rounded-full hover:bg-[#304987] transition"
                title="Share on Facebook"
              >
                <HugeiconsIcon icon={Facebook02Icon} fill="#fff" size={20} />
              </Link>

              <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black flex h-9 w-9 items-center justify-center hover:-translate-y-0.5 rounded-full hover:bg-[#111111] transition"
                title="Share on Twitter"
              >
                <HugeiconsIcon color="#fff" icon={TiktokIcon} size={20} />
              </Link>

              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${shareText} ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-bl from-[#54539D] via-[#CF2F5A] to-[#F6B539] flex h-9 w-9 items-center justify-center rounded-full hover:-translate-y-0.5 hover:bg-gray-100 transition"
                title="Share on WhatsApp"
              >
                <HugeiconsIcon color="#fff" icon={InstagramIcon} size={20} />
              </Link>
            </div>
          </div>

          <img className="px-13 py-10" src={"/trust-badges.png"} alt="" />
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Report Product</h2>

            <select
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-2 mb-4"
              name="reason"
            >
              <option value="">Select reason</option>
              <option value="Fake product">Fake / Counterfeit</option>
              <option value="Wrong pricing">Wrong pricing</option>
              <option value="Inappropriate content">
                Inappropriate content
              </option>
              <option value="Other">Other</option>
            </select>

            <textarea
              onChange={handleChange}
              name="message"
              placeholder="Additional details (optional)"
              className="w-full border border-gray-300 rounded-lg p-2 h-24 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowReport(false)}
                className="flex-1 cursor-pointer hover:scale-[1.03] transition-all h-10 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="flex-1 cursor-pointer hover:scale-[1.03] transition-all h-10 bg-black text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}