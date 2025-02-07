import { NextResponse } from "next/server";
import { serverEnv } from "@/shared/config/server-env";

export function GET() {
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${serverEnv.NAVER_CLIENT_ID}&redirect_uri=${serverEnv.NAVER_REDIRECT_URI}&state=${serverEnv.STATE_STRING}`;

  return NextResponse.redirect(naverAuthUrl);
}
