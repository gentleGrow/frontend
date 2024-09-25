import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*", // 프록시를 사용할 경로
        destination: "http://api.gaemischool.com:8000/api/v1/:path*", // 실제 API 서버 주소
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"), // @를 src 폴더로 매핑
    };
    return config;
  },
};

export default withVanillaExtract(nextConfig);
