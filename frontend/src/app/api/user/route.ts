import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

export function POST() {
  try {
    const cookieStore = cookies();
    const decoded = jwt.decode(
      cookieStore.get(ACCESS_TOKEN)?.value as string,
    ) as JwtPayload;

    const currentTime = Math.floor(Date.now() / 1000);

    if (
      typeof decoded !== "string" &&
      decoded?.exp &&
      (decoded.exp as number) < currentTime
    ) {
      return NextResponse.json(
        { error: "토큰이 만료되었습니다." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        email: "example@example.com",
        nickname: "개미",
        userId: decoded.id,
        isLoggedIn: true,
      },

      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "액세스 토큰이 존재하지 않습니다." },
      { status: 401 },
    );
  }
}
