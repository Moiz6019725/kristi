"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Package, Trash2, Check, X, MessageSquare } from "lucide-react";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const x = await fetch("/api/rating");
      const res = await x.json();
      const reviewsArray = Array.isArray(res) ? res : res.ratings || [];
      setReviews(reviewsArray);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApproval = async (reviewId, isApproved) => {
    setUpdating(reviewId);
    try {
      const response = await fetch("/api/rating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId, isApproved }),
      });
      if (response.ok) await fetchReviews();
    } catch (error) {
      console.error("Error updating approval:", error);
    } finally {
      setUpdating(null);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const res = await fetch("/api/rating", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId }),
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const uniqueProducts = Array.isArray(reviews)
    ? reviews.reduce((acc, review) => {
        if (review?.item?._id && !acc.some((p) => p._id === review.item._id))
          acc.push(review.item);
        return acc;
      }, [])
    : [];

  const filteredReviews = selectedProduct
    ? reviews.filter((r) => r?.item?._id === selectedProduct._id)
    : [];

  const getProductStats = (productId) => {
    const productReviews = reviews.filter((r) => r?.item?._id === productId);
    const avgRating = productReviews.length
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
      : 0;
    return {
      count: productReviews.length,
      avgRating,
      approved: productReviews.filter((r) => r.isApproved).length,
      pending: productReviews.filter((r) => !r.isApproved).length,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!selectedProduct ? (
        <>
          {/* Header */}
          <div className="bg-white backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Product Reviews</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Manage customer feedback and ratings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-linear-to-br from-purple-50 to-pink-50 px-4 py-2 rounded-xl border border-purple-200">
                  <span className="text-sm font-semibold text-purple-900">
                    {reviews.length} Total Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {uniqueProducts.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueProducts.map((product) => {
                const stats = getProductStats(product._id);
                return (
                  <div
                    key={product._id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-linear-to-br from-slate-100 to-slate-50 overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={64} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-400 fill-yellow-400" size={20} />
                          <span className="font-bold text-gray-900">{stats.avgRating}</span>
                          <span className="text-gray-500 text-sm">({stats.count})</span>
                        </div>
                        {product.price && (
                          <span className="font-bold text-purple-600">
                            Rs. {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                          <Check size={14} />
                          {stats.approved} Approved
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                          <MessageSquare size={14} />
                          {stats.pending} Pending
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={40} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">Customer reviews will appear here once submitted</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Back Button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Products
          </button>

          {/* Product Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              {selectedProduct.images?.[0] && (
                <div className="w-full md:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Product Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center gap-6">
                  {selectedProduct.price && (
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-xl font-bold text-purple-600">
                        Rs. {selectedProduct.price.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Average Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={20} />
                      <span className="text-xl font-bold text-gray-900">
                        {getProductStats(selectedProduct._id).avgRating}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({getProductStats(selectedProduct._id).count} reviews)
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        {getProductStats(selectedProduct._id).approved} Approved
                      </span>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                        {getProductStats(selectedProduct._id).pending} Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="text-purple-600" size={24} />
              Customer Reviews
            </h2>

            {filteredReviews.length ? (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <article
                    key={review._id}
                    className="bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border-2 border-gray-100 hover:border-purple-200 transition-all duration-200"
                  >
                    <div className="flex justify-between gap-6">
                      {/* Left Side: Review Content */}
                      <div className="flex-1">
                        {/* Reviewer Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {(review.reviewDisplayName || "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.reviewDisplayName || "Anonymous"}
                            </p>
                            <time className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                        </div>

                        {/* Star Rating & Title */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={`${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm font-semibold text-gray-700 ml-1">
                              {review.rating}.0
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {review.reviewTitle}
                          </h3>
                        </div>

                        {/* Review Content */}
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {review.reviewContent}
                        </p>

                        {/* Approval Status Badge */}
                        <div className="inline-flex items-center gap-2">
                          {review.isApproved ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <Check size={14} />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                              <MessageSquare size={14} />
                              Pending Approval
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Admin Actions */}
                      <div className="flex flex-col gap-3 min-w-[160px]">
                        <select
                          value={review.isApproved ? "Approve" : "Not Approve"}
                          onChange={(e) =>
                            updateApproval(review._id, e.target.value === "Approve")
                          }
                          disabled={updating === review._id}
                          className={`px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                            updating === review._id
                              ? "bg-gray-100 cursor-not-allowed border-gray-200"
                              : "bg-white border-gray-200 hover:border-purple-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
                          }`}
                        >
                          <option>Approve</option>
                          <option>Not Approve</option>
                        </select>

                        {updating === review._id && (
                          <div className="flex items-center gap-2 text-xs text-purple-600">
                            <div className="w-3 h-3 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                            Updating...
                          </div>
                        )}

                        <button
                          onClick={() => deleteReview(review._id)}
                          className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 border-rose-200 hover:border-rose-300"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">
                  This product hasn't received any reviews yet
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsPage;