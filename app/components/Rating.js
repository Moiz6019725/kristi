"use client";
import React, { useState, useEffect, useRef } from "react";
import { StarRating } from "./RatingStars";
import { RatingBreakdown } from "./RatingBreakdown";

const Rating = ({ item }) => {
  const [showRatingModel, setShowRatingModel] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingForm, setRatingForm] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const reviewsRef = useRef(null);
  const formRef = useRef(null);

  const product = JSON.parse(item);

  // Sync the 'rating' star component with the form state
  useEffect(() => {
    setRatingForm((prev) => ({ ...prev, rating: rating, item: product._id }));
  }, [rating, product._id]);

  const handleRatingChange = (e) => {
    setRatingForm({
      ...ratingForm,
      [e.target.name]: e.target.value,
    });
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const x = await fetch(`/api/rating?id=${product._id}`);
      const res = await x.json();
      // res.ratings comes from your GET handler NextResponse.json({ ratings })
      const productReviews = (res.ratings || []).filter(
        (r) => r.item?._id === product._id && r.isApproved === true,
      );

      setReviews(productReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Calculate dynamic stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
      ).toFixed(1)
    : 0;

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/rating", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingForm),
      });

      if (response.ok) {
        setShowRatingModel(false);
        setRating(0);
        setRatingForm({});
        fetchReviews(); // Refresh the list
        setTimeout(() => {
          reviewsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 0);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header / Summary Section */}
      <div className="flex flex-col md:flex-row justify-evenly border-b py-10 border-b-gray-300 items-center gap-8">
        <div>
          <div className="flex items-center gap-2">
            <StarRating rating={Number(averageRating)} />
            <span className="text-xl font-bold">{averageRating} out of 5</span>
          </div>
          <span className="text-gray-600">Based on {totalReviews} reviews</span>
        </div>

        <div className="flex gap-2 flex-col">
          <h1 className="text-3xl text-black font-semibold">
            Customer reviews
          </h1>
          <RatingBreakdown reviews={reviews.map((r) => r.rating)} />
        </div>

        <button
          ref={reviewsRef}
          onClick={() => {
            setShowRatingModel(!showRatingModel);
            setTimeout(() => {
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 0);
          }}
          className="bg-[#111111] scroll-mt-45 text-white px-10 py-3 cursor-pointer hover:translate-y-1 hover:bg-black hover:text-white transition-all duration-300 uppercase text-sm font-bold tracking-tighter"
        >
          {showRatingModel ? "Cancel review" : "Write a review"}
        </button>
      </div>

      {/* Write a Review Form */}
      {showRatingModel ? (
        <div ref={formRef} className="w-full scroll-mt-28 my-8 flex items-center flex-col gap-4 rounded-lg">
          <h2 className="text-2xl text-black font-medium">Write a review</h2>

          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold">Your Rating</span>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <h4 className="font-normal text-base self-start md:self-center w-full md:w-1/2">
            Review title
          </h4>
          <input
            onChange={handleRatingChange}
            name="reviewTitle"
            type="text"
            className="border border-gray-300 focus:border-black w-full md:w-1/2 py-2 px-4 outline-none"
            placeholder="Give your review a title"
          />

          <h4 className="font-normal text-base self-start md:self-center w-full md:w-1/2">
            Review content
          </h4>
          <textarea
            onChange={handleRatingChange}
            name="reviewContent"
            className="border outline-none focus:border-black border-gray-300 w-full md:w-1/2 h-32 py-2 px-4"
            placeholder="Start writing here..."
          ></textarea>

          <h4 className="font-normal text-base self-start md:self-center w-full md:w-1/2">
            Display name
          </h4>
          <input
            onChange={handleRatingChange}
            name="reviewDisplayName"
            type="text"
            className="border border-gray-300 focus:border-black w-full md:w-1/2 py-2 px-4 outline-none"
            placeholder="Publicly displayed name"
          />

          <h4 className="font-normal text-base self-start md:self-center w-full md:w-1/2">
            Email address
          </h4>
          <input
            onChange={handleRatingChange}
            name="email"
            type="email"
            className="border border-gray-300 focus:border-black w-full md:w-1/2 py-2 px-4 outline-none"
            placeholder="Your email address"
          />

          <p className="w-full md:w-1/2 text-center text-xs text-gray-500">
            How we use your data: We'll only contact you about the review you
            left, and only if necessary. By submitting your review, you agree to
            Judge.me's terms, privacy and content policies.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowRatingModel(false);
                setTimeout(() => {
                  reviewsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 0);
              }}
              className="text-black border px-5 py-2 cursor-pointer hover:translate-y-1 hover:border-gray-400 hover:text-gray-400 transition-all duration-300 uppercase text-sm font-bold tracking-tighter"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#111111] text-white px-5 py-2 cursor-pointer hover:translate-y-1 hover:bg-black hover:text-white transition-all duration-300 uppercase text-sm font-bold tracking-tighter"
            >
              Submit review
            </button>
          </div>
        </div>
      ) : (
        /* Review List Display */
        <div className="max-w-4xl mx-auto py-12">
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : reviews.length > 0 ? (
            <div className="flex flex-col gap-10">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-gray-200 pb-8">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <StarRating rating={rev.rating} />
                      <h3 className="font-bold text-lg mt-2 text-gray-900">
                        {rev.reviewTitle}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {rev.reviewContent}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                      {rev.reviewDisplayName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {rev.reviewDisplayName}
                    </span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20  rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No reviews yet for this product.</p>
              <button
                onClick={() => setShowRatingModel(true)}
                className="mt-4 text-black underline cursor-pointer font-bold"
              >
                Be the first to write one!
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rating;
