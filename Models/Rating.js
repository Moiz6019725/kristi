import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewTitle: {
    type: String,
    trim: true,
  },
  reviewDisplayName: {
    type: String,
    trim: true,
  },
  reviewContent: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true, // Recommended if you want to prevent duplicates
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use email + item for uniqueness instead of user + item
ratingSchema.index({ email: 1, item: 1 }, { unique: true });

export const Rating =
  mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
