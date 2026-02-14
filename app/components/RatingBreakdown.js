"use client";
import React from "react";

export const RatingBreakdown = ({ reviews }) => {
  const total = reviews.length || 1; // Avoid division by zero

  // Count the number of each star
  const counts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r === star).length;
    return {
      star,
      count,
      percentage: (count / total) * 100,
    };
  });

  return (
    <div className="flex flex-col gap-2 w-64">
      {counts.map(({ star, count, percentage }) => (
        <div key={star} className="flex items-center gap-2">
          {/* Star SVGs */}
          <div className="w-16 flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < star ? "text-yellow-400" : "text-gray-300"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
              </svg>
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex-1 bg-gray-200 h-3 rounded overflow-hidden">
            <div
              className="bg-black h-3 rounded"
              style={percentage > 0 ? { width: `${percentage}%` } : { width: 0 }}
            ></div>
          </div>

          {/* Count */}
          <span className="w-5 text-sm text-gray-600">{count}</span>
        </div>
      ))}
    </div>
  );
};
