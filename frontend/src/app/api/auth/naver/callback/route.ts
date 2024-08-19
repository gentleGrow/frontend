import { SERVICE_SERVER_URL, setCookieForJWT } from "@/shared";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code") as string;
    const state = url.searchParams.get("state");

    if (!code) {
      return NextResponse.json(
        { error: "인증코드가 없습니다." },
        { status: 400 },
      );
    }

    const response = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NAVER_CLIENT_ID as string,
        client_secret: process.env.NAVER_CLIENT_SECRET as string,
        redirect_uri: process.env.NAVER_REDIRECT_URI as string,
        code: code as string,
        state: state as string,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(data);
      return NextResponse.json(
        { error: "액세스 토큰 발급이 실패했습니다." },
        { status: response.status },
      );
    }

    const data = await response.json();
    const token = data.access_token;

    const jwtResponse = await fetch(`${SERVICE_SERVER_URL}/api/auth/v1/naver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: token,
      }),
    });
    if (!jwtResponse.ok) {
      const data = await jwtResponse.json();
      console.error(data);
      return NextResponse.json(
        { error: "JWT 토큰 발급이 실패했습니다." },
        { status: 400 },
      );
    }

    const jwtData = await jwtResponse.json();
    const accessToken = jwtData.access_token;
    const refreshToken = jwtData.refresh_token;

    setCookieForJWT(accessToken, refreshToken);
    const redirectUrl = new URL("/", url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "네이버 인증 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
