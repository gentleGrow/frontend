import { getGoogleOAuth2Client } from "@/shared";
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
    const response = await fetch(
      "http://www.gaemischool.com:8000/api/auth/v1/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      },
    );
    if (!response.ok) {
      console.log(response.statusText);
      console.log(response.status);
      const responseBody = await response.text();
      console.log(responseBody);
      return NextResponse.json(
        {
          error: "서비스 서버에서 오류가 발생했습니다.",
        },
        { status: response.status },
      );
    }
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "토큰 교환에 실패했습니다." },
      { status: 500 },
    );
  }
}
