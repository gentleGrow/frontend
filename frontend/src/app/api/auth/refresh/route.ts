import { SERVICE_SERVER_URL } from "@/shared";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refrechToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "리프레시 토큰이 존재하지 않습니다." },
        { status: NextResponse.status.BAD_REQUEST },
      );
    }
    const refreshResponse = await fetch(
      `${SERVICE_SERVER_URL}/api/auth/v1/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
    );
    if (!refreshResponse.ok) {
      return NextResponse.json(
        `새로운 액세스 토큰 요청이 실패했습니다: ${refreshResponse.status}`,
        {
          status: refreshResponse.status,
          statusText: refreshResponse.statusText,
        },
      );
    }
    const refreshData = await refreshResponse.json();
    const newAccessToken = refreshData.access_token;
    return NextResponse.json(newAccessToken, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "새로운 액세스 토큰 요청이 알 수 없는 이유로 실패했습니다.",
      },
      { status: NextResponse.status.BAD_REQUEST },
    );
  }
}
