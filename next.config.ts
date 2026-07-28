import type { NextConfig } from "next";

/**
 * Site kendi sunucumuzda (VPS) çalışacak.
 * `standalone` çıktısı, node_modules olmadan taşınabilir bir sürüm üretir —
 * sunucuya sadece .next/standalone klasörü kopyalanır.
 */

// Katalog görselleri muhasebe sunucusunda barınıyor; adres .env.local'den gelir
const katalogHost = process.env.CATALOG_API_URL
  ? new URL(process.env.CATALOG_API_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  output: "standalone",

  // sunucu imzasını gizle
  poweredByHeader: false,

  images: {
    // dış sunucudaki ürün görsellerine izin
    remotePatterns: katalogHost
      ? [{ protocol: "https", hostname: katalogHost }]
      : [],
    // mobil ağırlıklı trafik — küçük boyutlar önce
    deviceSizes: [360, 414, 640, 828, 1080, 1440, 1920],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
