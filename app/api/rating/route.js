import { NextResponse } from "next/server";
import { Rating } from "@/Models/Rating";
import connectToDatabase from "@/lib/dbConnect";

export async function PUT(request) {
  await connectToDatabase();
  const data = await request.json();

  // Check if this is an update request (has id for approval) or a create request
  if (data.id && typeof data.isApproved === "boolean") {
    // Update approval status
    const { id, isApproved } = data;
    try {
      const updatedRating = await Rating.findByIdAndUpdate(
        id,
        { isApproved },
        { new: true }, // Return the updated document
      );
      if (!updatedRating) {
        return NextResponse.json(
          { error: "Review not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { message: "Approval updated successfully", rating: updatedRating },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update approval" },
        { status: 500 },
      );
    }
  } else {
    // Create a new rating (existing logic)
    const rating = new Rating(data);
    await rating.save();
    return NextResponse.json(
      { message: "Rating created successfully" },
      { status: 201 },
    );
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const ratings = await Rating.find({})
      .populate("item") // 👈 THIS LINE
      .sort({ createdAt: -1 });

    return NextResponse.json({ ratings }, { status: 200 });
  } catch (error) {
    console.error("RATINGS API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const data = await request.json();
  await connectToDatabase();
  const review = await Rating.deleteOne({_id:data.id});
  if (!review) {
    return NextResponse.json({
      message: "Unable to delete review",
      status: 400,
    });
  }
  return NextResponse.json({
    message: "Review deleted successfully.",
    status: 200,
  });
}
