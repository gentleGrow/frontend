import { SERVICE_SERVER_URL, setCookieForJWT } from "@/shared";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "인증 코드가 없습니다." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code: code!,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      return NextResponse.json(
        { error: `토큰 요청 실패: ${errorData.error_description}` },
        { status: response.status },
      );
    }

    const tokenData = await response.json();
    const idToken = tokenData.id_token;

    const jwtResponse = await fetch(`${SERVICE_SERVER_URL}/api/auth/v1/kakao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!jwtResponse.ok) {
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
    console.error("카카오 인증 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "카카오 인증 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
