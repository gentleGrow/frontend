import { SERVICE_SERVER_URL } from "@/shared";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log(cookies().getAll());
    const refreshToken = req.cookies.get("refrechToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "리프레시 토큰이 존재하지 않습니다." },
        { status: 400 },
      );
    }
    const response = await fetch(`${SERVICE_SERVER_URL}/api/auth/v1/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      return NextResponse.json(
        `리프레시 토큰 요청을 실패했습니다: ${response.status}`,
        { status: response.status, statusText: response.statusText },
      );
    }
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {}
}
