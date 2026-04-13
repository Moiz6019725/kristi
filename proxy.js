import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 🔒 Protect admin dashboard
  if (!token && pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (!token) {
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, secret);

    // ✅ Logged-in admin should not access login again
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    if (pathname.startsWith("/admin/dashboard")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
