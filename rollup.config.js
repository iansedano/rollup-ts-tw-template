import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import path from "path";
import analyze from "rollup-plugin-analyzer";
import gzipPlugin from "rollup-plugin-gzip";
import includePaths from "rollup-plugin-includepaths";

const INCLUDED_FILE_EXTENSIONS = [".js", ".ts", ".jsx", ".tsx"];
const JS_ROOT = "src";

const root = path.resolve(__dirname, JS_ROOT);
const isProduction = process.env.NODE_ENV === "production";
const includePathOptions = {
  paths: [root],
  extensions: INCLUDED_FILE_EXTENSIONS,
};

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",
  treeshake: "recommended",
  plugins: [
    nodeResolve({ extensions: INCLUDED_FILE_EXTENSIONS }),
    includePaths(includePathOptions), // So you can use absolute imports from main js folder
    json(), // So you can import json files
    babel({ extensions: INCLUDED_FILE_EXTENSIONS, babelHelpers: "bundled" }),
    commonjs({ requireReturnsDefault: "auto" }),
    !isProduction && analyze({ summaryOnly: true }),
  ],
  output: [
    {
      file: "dist/index.js",
      format: "iife",
      plugins: [isProduction && terser(), isProduction && gzipPlugin()],
      sourcemap: true,
    },
    {
      file: "dist/index.mjs",
      format: "es",
      plugins: [isProduction && terser(), isProduction && gzipPlugin()],
      sourcemap: true,
    },
  ],
};

export default config;
