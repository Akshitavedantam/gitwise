
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


const publicRoutes = [
  "/",
  "/register",
  "/login",
  "/how-it-works",
  "/api/auth", 
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }


  const token = await getToken({ req });
  if (!token) {

    const loginUrl = new URL("/register", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
