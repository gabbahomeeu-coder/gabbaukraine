import "server-only";
import { db } from "@/lib/db/client";

/**
 * KMP · Günlük kampanya
 *
 * Her gün, yayındaki ve stokta olan ürünlerden 70.000 ₴ altındaki üçüne
 * yalnızca internet satışında %20 indirim uygulanır.
 *
 * Seçim TARİH TOHUMLUDUR: aynı gün içinde kim ne zaman girerse girsin
 * aynı üç ürünü görür. Müşteri sabah gördüğü indirimi akşam bulamazsa
 * güven kaybolur.
 *
 * Uygun ürün yoksa boş liste döner ve bölüm ana sayfada hiç görünmez —
 * kırık ya da boş bir kampanya alanı bırakmaktansa yok saymak doğru.
 */

const UST_SINIR = 70_000;
const INDIRIM = 20;
const ADET = 3;

export type DailyDeal = {
  slug: string;
  name: string;
  collection: string;
  /** tam görsel adresi — dış katalog sunucusundan gelir */
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
};

/* Tarih tohumlu üreteç: aynı gün aynı sonuç */
function tohumluRastgele(tohum: number): () => number {
  let s = tohum % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function tarihTohumu(t: Date): number {
  return t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate();
}

export async function getDailyDeals(tarih: Date = new Date()): Promise<DailyDeal[]> {
  const adaylar = await db.product.findMany({
    where: {
      isActive: true,
      basePrice: { lt: UST_SINIR, gt: 0 },
      // görselsiz ürün kampanyada kart olarak duramaz
      media: { some: {} },
    },
    include: {
      translations: { where: { locale: "uk" } },
      collection: { include: { translations: { where: { locale: "uk" } } } },
      media: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { slug: "asc" }, // sıra sabit olmalı, yoksa tohum işe yaramaz
  });

  if (adaylar.length === 0) return [];

  /* Stok hareketlerinden gerçek adet — stokta olmayan ürün kampanyaya
     giremez, "indirim var ama yok" durumu oluşmasın. */
  const hareketler = await db.stockMove.groupBy({
    by: ["productId"],
    where: { productId: { in: adaylar.map((p) => p.id) } },
    _sum: { delta: true },
  });
  const stok = new Map(hareketler.map((h) => [h.productId, h._sum.delta ?? 0]));

  const uygun = adaylar.filter((p) => (stok.get(p.id) ?? 0) > 0);
  if (uygun.length === 0) return [];

  /* Tohumlu karıştırma — Fisher-Yates, sort() ile karıştırmak
     tarayıcıdan tarayıcıya farklı sonuç verebiliyor. */
  const rand = tohumluRastgele(tarihTohumu(tarih));
  const sirali = [...uygun];
  for (let i = sirali.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [sirali[i], sirali[j]] = [sirali[j], sirali[i]];
  }

  return sirali.slice(0, ADET).map((p) => {
    const fiyat = Number(p.basePrice);
    return {
      slug: p.slug,
      name: p.translations[0]?.name ?? p.slug,
      collection: p.collection?.translations[0]?.name ?? "",
      image: p.media[0]!.url,
      originalPrice: fiyat,
      discountedPrice: Math.round((fiyat * (100 - INDIRIM)) / 100),
      discount: INDIRIM,
    };
  });
}
