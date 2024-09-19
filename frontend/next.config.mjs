// next.config.mjs
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import path from "path";
import { fileURLToPath } from "url";

const withVanillaExtract = createVanillaExtractPlugin();

// __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default withVanillaExtract(nextConfig);
