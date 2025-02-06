"use client";

import { z } from "zod";

const clientEnvSchema = z.object({
  // OAuth 관련
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI: z.string().url(),
  NEXT_PUBLIC_KAKAO_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_KAKAO_REDIRECT_URI: z.string().url(),
  NEXT_PUBLIC_NAVER_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_NAVER_REDIRECT_URI: z.string().url(),
  NEXT_PUBLIC_NAVER_STATE_STRING: z.string().min(1),

  // 서버 URL
  NEXT_PUBLIC_SERVER_URL: z.string().url(),

  // 분석 도구
  NEXT_PUBLIC_GA_ID: z.string().min(1),
});

function validateClientEnv() {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      NEXT_PUBLIC_GOOGLE_REDIRECT_URI:
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      NEXT_PUBLIC_KAKAO_CLIENT_ID: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
      NEXT_PUBLIC_KAKAO_REDIRECT_URI:
        process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
      NEXT_PUBLIC_NAVER_CLIENT_ID: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      NEXT_PUBLIC_NAVER_REDIRECT_URI:
        process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
      NEXT_PUBLIC_NAVER_STATE_STRING:
        process.env.NEXT_PUBLIC_NAVER_STATE_STRING,
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { fieldErrors } = error.flatten();
      const errorMessage = Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
        .join("\n");

      throw new Error(
        `❌ Invalid client environment variables:\n${errorMessage}\n\nPlease check your .env file`,
      );
    }
    throw error;
  }
}

export const clientEnv = validateClientEnv();

export type ClientEnv = z.infer<typeof clientEnvSchema>;
