import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

export function POST() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;
    if (!accessToken) throw new Error();
    const decoded = jwt.decode(accessToken) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);

    if (
      typeof decoded !== "string" &&
      decoded?.exp &&
      (decoded.exp as number) < currentTime
    ) {
      return NextResponse.json(
        { hasAccessToken: false, error: "토큰이 만료되었습니다." },
        { status: 401 },
      );
    }

    return NextResponse.json({ hasAccessToken: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { hasAccessToken: false, error: "액세스 토큰이 만료되었습니다." },
      { status: 401 },
    );
  }
}
