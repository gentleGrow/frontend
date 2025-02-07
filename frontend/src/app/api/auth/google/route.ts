import { getGoogleOAuth2Client } from "@/shared";
import { NextResponse } from "next/server";
import { serverEnv } from "@/shared/config/server-env";

export async function GET() {
  const client = getGoogleOAuth2Client();

  const authUrl = client.generateAuthUrl({
    access_type: "online",
    scope: ["openid"],
    prompt: "consent",
    redirect_uri: serverEnv.GOOGLE_REDIRECT_URI,
    state: serverEnv.STATE_STRING,
    client_id: serverEnv.GOOGLE_CLIENT_ID,
  });
  return NextResponse.redirect(authUrl);
}
