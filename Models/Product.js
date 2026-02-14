import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  option1: String,
  option2: String,
  option3: String,
  price: {
    type: Number,
    required: true,
  },
  compareAtPrice: Number,
  sku: String,
  inventory: {
    type: Number,
    default: 0,
  },
});

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "Collection",
    },
    price: {
      type: Number,
      required: true,
    },
    compareAtPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
    },
    vendor: {
      type: String,
      default: "",
    },
    productType: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
      },
    ],
    hasVariants: {
      type: Boolean,
      default: false,
    },
    options: [
      {
        name: String,
        values: [String],
      },
    ],
    variants: [VariantSchema],
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);