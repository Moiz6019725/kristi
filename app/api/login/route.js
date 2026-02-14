import connectToDatabase from "@/lib/dbConnect";
import { Admin } from "@/Models/Admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  await connectToDatabase();

  const existingUser = await Admin.findOne({ username: data.username });

  if (!existingUser) {
    return NextResponse.json({ message: "Admin not found" }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);

  if (!isPasswordValid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: existingUser._id, username: existingUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  const response = NextResponse.json({ message: "Login successful" ,status: 200 });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
