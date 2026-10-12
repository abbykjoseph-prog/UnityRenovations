/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a second dev server run alongside the main one without sharing build output
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
