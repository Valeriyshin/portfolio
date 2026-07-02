import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Скриншоты проектов добавляются через админку по произвольным https-ссылкам
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
