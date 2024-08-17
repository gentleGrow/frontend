import { getGoogleOAuth2Client, SERVICE_SERVER_URL } from "@/shared";
import setJWTCookie from "@/shared/utils/setJWTCookie";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const client = getGoogleOAuth2Client();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "인증 코드가 없습니다." },
      { status: 400 },
    );
  }

  try {
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken) {
      return NextResponse.json(
        { error: "ID 토큰을 가져올 수 없습니다." },
        { status: 500 },
      );
    }
    const response = await fetch(`${SERVICE_SERVER_URL}/api/auth/v1/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });
    if (!response.ok) {
      const responseBody = await response.text();
      return NextResponse.json(
        {
          error: `서비스 서버에서 오류가 발생했습니다.: ${responseBody}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    setJWTCookie(data.access_token, data.refresh_token);
    const redirectUrl = new URL("/", url);
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    return NextResponse.json(
      { error: `토큰 교환에 실패했습니다.: ${error}` },
      { status: 500 },
    );
  }
}
