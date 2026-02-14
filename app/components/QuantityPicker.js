"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateQuantity } from "@/redux/cart/cartSlice";

export default function QuantityPicker({ id, initialQty = 1 }) {
  const [qty, setQty] = useState(initialQty);
  const dispatch = useDispatch();

  // Sync with Redux if initialQty changes
  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  const updateQty = (val) => {
    const newQty = Math.max(1, val);
    setQty(newQty);

    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  return (
    <div className="flex items-center bg-[#F2F2F2] w-max rounded-md">
      <button
        onClick={() => updateQty(qty - 1)}
        className="px-3 py-1 text-lg hover:bg-gray-300 rounded-l"
        disabled={qty === 1} // optional
      >
        −
      </button>

      <span className="px-5 py-1 font-semibold">{qty}</span>

      <button
        onClick={() => updateQty(qty + 1)}
        className="px-3 py-1 text-lg hover:bg-gray-300 rounded-r"
      >
        +
      </button>
    </div>
  );
}
