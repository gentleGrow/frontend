import { NextResponse } from "next/server";
import { serverEnv } from "@/shared/config/server-env";

export function GET() {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${serverEnv.KAKAO_CLIENT_ID}&redirect_uri=${serverEnv.KAKAO_REDIRECT_URI}&response_type=code&scope=openid`;
  return NextResponse.redirect(kakaoAuthUrl);
}
