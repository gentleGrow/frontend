import { fetchWithTimeout, getServiceUrl, setCookieForJWT } from "@/shared";
import { NextRequest, NextResponse } from "next/server";
import { Agent } from "https";
import { fetchWithRetry } from "@/shared/utils/fetchWithRetry";

const keepAliveAgent = new Agent({
  keepAlive: true,
  keepAliveMsecs: 3000,
  maxSockets: 160,
  timeout: 60000,
});

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);

  try {
    const authenticationCode = requestUrl.searchParams.get("code");

    if (!authenticationCode) {
      throw new Error("Naver 계정 인증코드가 없습니다.");
    }

    if (
      !process.env.NAVER_CLIENT_ID ||
      !process.env.NAVER_CLIENT_SECRET ||
      !process.env.NAVER_REDIRECT_URI
    ) {
      throw new Error("환경 변수 설정이 올바르지 않습니다.");
    }

    const accessTokenResponse = await fetchWithRetry(
      "https://nid.naver.com/oauth2.0/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Connection: "keep-alive",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          redirect_uri: process.env.NAVER_REDIRECT_URI,
          code: authenticationCode,
          state: process.env.NAVER_STATE_STRING || "",
        }),
        agent: keepAliveAgent,
        timeout: 29000,
      },
    );

    if (!accessTokenResponse.ok) {
      throw new Error(
        `Naver로부터 액세스 토큰을 가져오는 작업이 실패했습니다.: ${await accessTokenResponse.text()}`,
      );
    }

    const accessTokenData = await accessTokenResponse.json();
    const accessToken = accessTokenData.access_token;

    const jwtResponse = await fetchWithTimeout(
      `${getServiceUrl()}/api/auth/v1/naver`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      },
    );

    if (!jwtResponse.ok) {
      throw new Error(
        `서비스 서버에서 오류가 발생했습니다.: ${await jwtResponse.text()}`,
      );
    }

    const jwtData = await jwtResponse.json();
    setCookieForJWT(jwtData.access_token, jwtData.refresh_token);

    const redirectUrl = new URL("/", requestUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Naver OAuth Error:", error);

    // 구체적인 에러 메시지 생성
    let errorMessage = "네이버 로그인 중 오류가 발생했습니다.";
    if (error instanceof Error) {
      if (error.message.includes("ECONNRESET")) {
        errorMessage = "네트워크 연결이 불안정합니다. 다시 시도해 주세요.";
      }
    }

    const redirectUrl = new URL("/", requestUrl);
    redirectUrl.searchParams.set("error", errorMessage);
    return NextResponse.redirect(redirectUrl);
  }
}
