import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // อนุญาตให้เปิดตอน dev ผ่าน tunnel (ngrok / cloudflared) และ IP ในวง Wi-Fi
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.dev", "*.trycloudflare.com"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
