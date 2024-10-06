import {
  fetchWithTimeout,
  RESPONSE_STATUS,
  SERVICE_SERVER_URL,
  setCookieForJWT,
} from "@/shared";
import { th } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);

  try {
    const authenticationCode = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");

    if (!authenticationCode) {
      throw new Error("Naver 계정 인증코드가 없습니다.");
      //  return NextResponse.json(
      //    { error: "Naver 계정 인증코드가 없습니다." },
      //    { status: RESPONSE_STATUS.BAD_REQUEST },
      //  );
    }

    if (
      !process.env.NAVER_CLIENT_ID ||
      !process.env.NAVER_CLIENT_SECRET ||
      !process.env.NAVER_REDIRECT_URI
    ) {
      throw new Error("환경 변수 설정이 올바르지 않습니다.");
      //  return NextResponse.json(
      //    { error: "환경 변수 설정이 올바르지 않습니다." },
      //    { status: RESPONSE_STATUS.INTERNAL_SERVER_ERROR },
      //  );
    }

    const accessTokenResponse = await fetchWithTimeout(
      "https://nid.naver.com/oauth2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          redirect_uri: process.env.NAVER_REDIRECT_URI,
          code: authenticationCode,
          state: state || "",
        }),
      },
    );

    if (!accessTokenResponse.ok) {
      throw new Error(
        `Naver로부터 액세스 토큰을 가져오는 작업이 실패했습니다.: ${await accessTokenResponse.text()}`,
      );
      // const accessTokenErrorBody = await accessTokenResponse.json();
      // return NextResponse.json(
      //   {
      //     error: `Naver로부터 액세스 토큰을 가져오는 작업이 실패했습니다: ${accessTokenErrorBody.error_description || "알 수 없는 오류"}`,
      //   },
      //   { status: accessTokenResponse.status },
      // );
    }

    const accessTokenData = await accessTokenResponse.json();
    const accessToken = accessTokenData.access_token;

    const jwtResponse = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/auth/v1/naver`,
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
    const redirectUrl = new URL("/?login=failed", requestUrl);
    return NextResponse.redirect(redirectUrl);
  }
}
