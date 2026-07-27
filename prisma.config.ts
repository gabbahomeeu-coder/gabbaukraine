import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma CLI, Next.js gibi .env.local'i kendiliğinden okumaz
loadEnv({ path: ".env.local", quiet: true });

/**
 * Prisma 7 yapılandırması.
 * Bağlantı adresi artık schema.prisma içinde değil burada tutuluyor.
 *
 * DATABASE_URL değeri .env.local dosyasından gelir — o dosya git'e girmez.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "prisma/migrations",
  },
});
