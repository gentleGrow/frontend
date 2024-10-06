import {
  fetchWithTimeout,
  RESPONSE_STATUS,
  SERVICE_SERVER_URL,
  setCookieForJWT,
} from "@/shared";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);

  try {
    if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_REDIRECT_URI) {
      throw new Error("환경 변수 설정이 올바르지 않습니다.");
      // return NextResponse.json(
      //   { error: "환경 변수 설정이 올바르지 않습니다." },
      //   { status: RESPONSE_STATUS.INTERNAL_SERVER_ERROR },
      // );
    }
    const authenticationCode = requestUrl.searchParams.get("code");

    if (!authenticationCode) {
      throw new Error("Kakao 계정 인증코드가 없습니다.");
      // return NextResponse.json(
      //   { error: "Kakao 계정 인증코드가 없습니다." },
      //   { status: RESPONSE_STATUS.BAD_REQUEST },
      // );
    }

    const idTokenResponse = await fetchWithTimeout(
      "https://kauth.kakao.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code: authenticationCode,
        }),
      },
    );

    if (!idTokenResponse.ok) {
      throw new Error(
        `Kakao로부터 ID 토큰을 가져오는 작업이 실패했습니다.: ${await idTokenResponse.text()}`,
      );
      // const idTokenErrorBody = await idTokenResponse.json();
      // return NextResponse.json(
      //   {
      //     error: `Kakao로부터 ID 토큰을 가져오는 작업이 실패했습니다: ${idTokenErrorBody.error_description || "알 수 없는 오류"}`,
      //   },
      //   { status: idTokenResponse.status },
      // );
    }

    const idTokenData = await idTokenResponse.json();
    const idToken = idTokenData.id_token;

    const jwtResponse = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/auth/v1/kakao`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      },
    );

    if (!jwtResponse.ok) {
      throw new Error(
        `서비스 서버에서 오류가 발생했습니다.: ${await jwtResponse.text()}`,
      );
      // const jwtResponseErrorText = await jwtResponse.text();
      // return NextResponse.json(
      //   {
      //     error: `서비스 서버에서 오류가 발생했습니다.: ${jwtResponseErrorText || "알 수 없는 오류"}`,
      //   },
      //   { status: jwtResponse.status },
      // );
    }

    const jwtData = await jwtResponse.json();
    setCookieForJWT(jwtData.access_token, jwtData.refresh_token);

    const redirectUrl = new URL("/", requestUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    const redirectUrl = new URL("/?login=failed", requestUrl);
    return NextResponse.redirect(redirectUrl);
  }
}
