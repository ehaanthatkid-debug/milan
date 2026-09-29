import type { NextConfig } from "next";

// On GitHub Pages the site lives under /<repo-name>; the deploy workflow passes
// that prefix in as BASE_PATH. Locally it's empty, so the site runs at "/".
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Build to plain HTML/CSS/JS in /out — no server needed, so it can be hosted anywhere.
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    // Unsplash's CDN resizes images itself, so we hand it the width/quality
    // instead of relying on a Next.js image server.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;
