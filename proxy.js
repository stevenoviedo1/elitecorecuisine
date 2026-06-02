import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// NextAuth v5 compatible middleware (getToken still works in edge runtime)
export default async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const path = req.nextUrl.pathname
  const method = req.method

  // Full protection for the staff dashboard page
  if (path.startsWith("/orders")) {
    if (!token || !["owner", "worker"].includes(token.role)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // API protection (POS / customer ordering aware):
  // - POST /api/orders is PUBLIC (customer self-serve checkouts from the website)
  // - GET and PATCH /api/orders are STAFF-ONLY (used by the /orders dashboard)
  if (path.startsWith("/api/orders")) {
    if (method === "POST") {
      // Allow public customer order creation. The route handler has its own validation.
      return NextResponse.next()
    }

    // Staff-only for dashboard operations (list, status updates, payment toggles, etc.)
    if (!token || !["owner", "worker"].includes(token.role)) {
      return NextResponse.json(
        { error: "Unauthorized. Staff login required for this action." },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/orders/:path*", "/api/orders/:path*"],
}