import { z } from "zod";

const serverEnvSchema = z.object({
  // OAuth 관련
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  KAKAO_CLIENT_ID: z.string().min(1),
  KAKAO_CLIENT_SECRET: z.string().min(1),
  KAKAO_REDIRECT_URI: z.string().url(),
  NAVER_CLIENT_ID: z.string().min(1),
  NAVER_CLIENT_SECRET: z.string().min(1),
  NAVER_REDIRECT_URI: z.string().url(),

  // 서버 URL
  NEXT_SERVER_URL: z.string().url(),

  // API 키 및 토큰
  SENTRY_AUTH_TOKEN: z.string().min(1),
  KR_HOLIDAYS_API_KEY: z.string().min(1),
  GA_ID: z.string().min(1),

  // 기타
  NAVER_STATE_STRING: z.string().min(1),
});

function validateServerEnv() {
  try {
    return serverEnvSchema.parse({
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
      KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
      KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
      NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
      NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
      NAVER_REDIRECT_URI: process.env.NAVER_REDIRECT_URI,
      NEXT_SERVER_URL: process.env.NEXT_SERVER_URL,
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
      KR_HOLIDAYS_API_KEY: process.env.KR_HOLIDAYS_API_KEY,
      GA_ID: process.env.GA_ID,
      NAVER_STATE_STRING: process.env.NAVER_STATE_STRING,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { fieldErrors } = error.flatten();
      const errorMessage = Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
        .join("\n");

      throw new Error(
        `❌ Invalid server environment variables:\n${errorMessage}\n\nPlease check your .env file`,
      );
    }
    throw error;
  }
}

export const serverEnv = validateServerEnv();

export type ServerEnv = z.infer<typeof serverEnvSchema>;
