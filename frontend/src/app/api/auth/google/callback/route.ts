import {
  fetchWithTimeout,
  getGoogleOAuth2Client,
  SERVICE_SERVER_URL,
} from "@/shared";
import setJWTCookie from "@/shared/utils/setJWTCookie";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  try {
    const client = getGoogleOAuth2Client();
    const authenticationCode = requestUrl.searchParams.get("code");

    if (!authenticationCode) {
      throw new Error("Google 계정 인증코드가 없습니다.");
    }
    const { tokens } = await client.getToken(authenticationCode);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error("Google로부터 ID 토큰을 가져오는 작업을 실패했습니다.");
    }

    const jwtResponse = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/auth/v1/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      },
    );

    if (!jwtResponse.ok)
      throw new Error("서비스 서버에서 오류가 발생했습니다.");

    const jwtData = await jwtResponse.json();

    setJWTCookie(jwtData.access_token, jwtData.refresh_token);

    const redirectUrl = new URL("/", requestUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    const redirectUrl = new URL("/", requestUrl);
    redirectUrl.searchParams.set("error", (error as Error)?.message ?? "");
    return NextResponse.redirect(redirectUrl);
  }
}
