import { fetchWithTimeout, setCookieForJWT } from "@/shared";
import { NextRequest, NextResponse } from "next/server";
import { fetchWithRetry } from "@/shared/utils/fetchWithRetry";
import { getServiceServerUrl } from "@/shared/utils/getServiceServerUrl";
import { Agent } from "https";

const keepAliveAgent = new Agent({
  keepAlive: true,
  keepAliveMsecs: 3000,
  maxSockets: 160,
  timeout: 60000,
});

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);

  try {
    if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_REDIRECT_URI) {
      throw new Error("환경 변수 설정이 올바르지 않습니다.");
    }
    const authenticationCode = requestUrl.searchParams.get("code");

    if (!authenticationCode) {
      throw new Error("카카오 계정 인증코드가 없습니다.");
    }

    const idTokenResponse = await fetchWithTimeout(
      "https://kauth.kakao.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Connection: "keep-alive",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code: authenticationCode,
        }),
        agent: keepAliveAgent,
      },
    );

    if (!idTokenResponse.ok) {
      throw new Error("카카오 로그인에 실패했습니다.");
    }

    const idTokenData = await idTokenResponse.json();
    const idToken = idTokenData.id_token;

    const jwtResponse = await fetchWithRetry(
      `${getServiceServerUrl()}/api/auth/v1/kakao`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
        timeout: 29000,
      },
    );

    if (!jwtResponse.ok) {
      throw new Error("서비스 서버에서 오류가 발생했습니다.");
    }

    const jwtData = await jwtResponse.json();
    setCookieForJWT(jwtData.access_token, jwtData.refresh_token);

    const redirectUrl = new URL("/", requestUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    const redirectUrl = new URL("/", requestUrl);
    redirectUrl.searchParams.set(
      "error",
      (error as Error)?.message ?? "알 수 없는 오류가 발생했습니다.",
    );
    return NextResponse.redirect(redirectUrl);
  }
}
