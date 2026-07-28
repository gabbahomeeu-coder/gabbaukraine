import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Veritabanı istemcisi — tüm modüller buradan okur/yazar.
 *
 * Prisma 7 doğrudan bağlantı için bir sürücü bağdaştırıcısı ister.
 * Geliştirme sırasında Next.js modülleri sık sık yeniden yüklediği için
 * istemciyi global'de saklıyoruz; yoksa her değişiklikte yeni bağlantı
 * havuzu açılır ve veritabanı bağlantı sınırına takılır.
 */

const connectionString = process.env.DATABASE_URL;

function createClient() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL tanımlı değil. .env.local dosyasına Supabase bağlantı adresini ekleyin."
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
