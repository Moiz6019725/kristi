import { Product } from "@/Models/Product";
import connectToDatabase from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDatabase();

  try {
    const products = await Product.find({}).populate("collection"); // Fetch all products
    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Server error while fetching products",
      },
      { status: 500 }
    );
  }
}