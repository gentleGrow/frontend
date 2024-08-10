import run from "@gaemi-school/esbuild-config";
import pkg from "./package.json" assert { type: "json" };

run({pkg});           