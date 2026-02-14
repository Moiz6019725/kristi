"use client";

import { useEffect, useState } from "react";
import OrderForm from "@/app/components/OrderForm";
import { Package } from "lucide-react";

export default function CheckoutPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProduct = localStorage.getItem("checkoutProduct");
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
      localStorage.removeItem("checkoutProduct");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!product || product.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-medium mb-2">No product found</p>
          <p className="text-gray-500 mb-6">
            Please go back and add a product to checkout.
          </p>
          <a
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const subtotal = product.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate total savings
  const totalSavings = product.reduce((acc, item) => {
    if (item.compareAtPrice && item.compareAtPrice > item.price) {
      return acc + (item.compareAtPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">
        Complete your order details below
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Product Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {product.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-none"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                    {item.quantity > 1 && (
                      <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    
                    {/* Variant Display */}
                    {item.variant && (
                      <p className="text-xs text-gray-500 mb-1 bg-gray-100 inline-block px-2 py-0.5 rounded">
                        {item.variant}
                      </p>
                    )}
                    
                    {/* SKU Display */}
                    {item.sku && (
                      <p className="text-xs text-gray-400 mb-2">
                        SKU: {item.sku}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          Rs. {item.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">You save</span>
                  <span className="font-medium text-green-600">
                    - Rs. {totalSavings.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-semibold text-lg">Total</span>
                <div className="text-right">
                  <span className="font-bold text-2xl text-[#E84E4E]">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                  {totalSavings > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      Saved Rs. {totalSavings.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>Secure checkout • SSL encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Billing Details</h2>
            <OrderForm products={product} />
          </div>
        </div>
      </div>
    </div>
  );
}