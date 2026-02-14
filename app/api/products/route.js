import fs from "fs";
import path from "path";
import connectToDatabase from "@/lib/dbConnect";
import { Product } from "@/Models/Product";
import { Collection } from "@/Models/Collection";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToDatabase();

  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const price = formData.get("price");
    const compareAtPrice = formData.get("compareAtPrice");
    const description = formData.get("description");
    const status = formData.get("status") || "active";
    const vendor = formData.get("vendor") || "";
    const productType = formData.get("productType") || "";
    const collection = formData.get("collection") || "";
    const hasVariants = formData.get("hasVariants") === "true";

    // Get variants and options if they exist
    let options = [];
    let variants = [];

    if (hasVariants) {
      const optionsData = formData.get("options");
      const variantsData = formData.get("variants");

      if (optionsData) {
        options = JSON.parse(optionsData);
      }

      if (variantsData) {
        variants = JSON.parse(variantsData);
      }
    }

    // Handle multiple image files
    const files = formData.getAll("uploads");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No images uploaded" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageUrls = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, buffer);
      imageUrls.push(`/uploads/${fileName}`);
    }

    // Create product data object
    const productData = {
      title,
      description,
      compareAtPrice: Number(compareAtPrice),
      images: imageUrls,
      price: Number(price),
      status,
      vendor,
      productType,
      collection,
      hasVariants,
    };

    // Add variants data if product has variants
    if (hasVariants) {
      productData.options = options;
      productData.variants = variants;
    }

    // Save product in DB
    const product = await Product.create(productData);

    // If a collection is selected, add the product to the collection's products list
    if (collection) {
      await Collection.findByIdAndUpdate(collection, {
        $push: { products: product._id },
      });
    }

    return NextResponse.json(
      {
        message: "Product added successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product upload error:", error);
    return NextResponse.json(
      { message: "Failed to add product", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the product first to get image URLs and collection
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete all product images from the file system
    const uploadDir = path.join(process.cwd(), "public");

    for (const imageUrl of product.images) {
      const imagePath = path.join(uploadDir, imageUrl);

      try {
        if (fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath);
        }
      } catch (error) {
        console.error(`Failed to delete image: ${imagePath}`, error);
        // Continue even if image deletion fails
      }
    }

    // Remove product from collection if it belongs to one
    if (product.collection) {
      await Collection.findByIdAndUpdate(product.collection, {
        $pull: { products: product._id },
      });
    }

    // Delete the product from database
    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        deletedProduct: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}