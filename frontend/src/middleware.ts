import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "./entities";

export async function middleware(request: NextRequest) {
  const user = await getUser();
  if (user && !user.isActivated) {
    return NextResponse.redirect(new URL("/?join=true"));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
  runtime: "nodejs",
};
