import type { NextConfig } from "next";

/**
 * Site kendi sunucumuzda (VPS) çalışacak.
 * `standalone` çıktısı, node_modules olmadan taşınabilir bir sürüm üretir —
 * sunucuya sadece .next/standalone klasörü kopyalanır.
 */

/**
 * Katalog görselleri muhasebe sunucusunda barınıyor.
 *
 * Görsel alanı API alanından FARKLI olabilir — şu an API crm.gabbahome.eu,
 * görseller img.gabbahome.eu. Bu yüzden ikisi ayrı okunur; burada tanımlı
 * olmayan alandan gelen görsel `next/image` tarafından reddedilir ve sayfa
 * 500 verir. Yeni bir görsel alanı eklenirse CATALOG_IMAGE_HOSTS'a yazılmalı.
 */
const katalogHostlari = [
  ...(process.env.CATALOG_IMAGE_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean),
  ...(process.env.CATALOG_API_URL
    ? [new URL(process.env.CATALOG_API_URL).hostname]
    : []),
].filter((h, i, hepsi) => hepsi.indexOf(h) === i);

const nextConfig: NextConfig = {
  output: "standalone",

  // sunucu imzasını gizle
  poweredByHeader: false,

  images: {
    // dış sunucudaki ürün görsellerine izin
    remotePatterns: katalogHostlari.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
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
