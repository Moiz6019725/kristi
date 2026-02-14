import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  message: {
    type: String, // URL to the uploaded image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Report = mongoose.models.Report || mongoose.model("Report",reportSchema)