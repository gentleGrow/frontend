import {
  fetchWithTimeout,
  getGoogleOAuth2Client,
  SERVICE_SERVER_URL,
} from "@/shared";
import setJWTCookie from "@/shared/utils/setJWTCookie";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const client = getGoogleOAuth2Client();
    const requestUrl = new URL(req.url);
    const authenticationCode = requestUrl.searchParams.get("code");

    if (!authenticationCode) {
      throw new Error("Google 계정 인증코드가 없습니다.");
      // return NextResponse.json(
      //   { error: "Google 계정 인증코드 발급이 실패했습니다." },
      //   { status: RESPONSE_STATUS.BAD_REQUEST },
      // );
    }
    const { tokens } = await client.getToken(authenticationCode);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error("Google로부터 ID 토큰을 가져오는 작업을 실패했습니다.");
      // return NextResponse.json(
      //   { error: "Google로부터 ID 토큰을 가져오는 작업을 실패했습니다." },
      //   { status: RESPONSE_STATUS.INTERNAL_SERVER_ERROR },
      // );
    }

    let jwtResponse;

    jwtResponse = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/auth/v1/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      },
    );

    if (!jwtResponse.ok)
      throw new Error(
        `서비스 서버에서 오류가 발생했습니다.: ${await jwtResponse.text()}`,
      );

    if (!jwtResponse.ok) {
      throw new Error(
        `서비스 서버에서 오류가 발생했습니다.: ${await jwtResponse.text()}`,
      );
      // const tokenResponseErrorText = await jwtResponse.text();
      // return NextResponse.json(
      //   {
      //     error: `서비스 서버에서 오류가 발생했습니다.: ${tokenResponseErrorText}`,
      //   },
      //   { status: jwtResponse.status },
      // );
    }

    const jwtData = await jwtResponse.json();
    setJWTCookie(jwtData.access_token, jwtData.refresh_token);
    const redirectUrl = new URL("/", requestUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    const redirectUrl = new URL("/?login=failed");
    return NextResponse.redirect(redirectUrl);
  }
}
