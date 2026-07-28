import "server-only";
import { db } from "@/lib/db/client";
import type {
  VaryantDTO,
  UrunDTO,
  KoleksiyonDTO,
  KumasDTO,
} from "./types";

export type { VaryantDTO, UrunDTO, KoleksiyonDTO, KumasDTO };

/**
 * KAT · Katalog okuma katmanı
 *
 * Sayfalar artık `lib/catalog.ts` dosyasından değil buradan okuyor.
 * O dosya yalnızca ilk tohumlama için duruyor.
 *
 * Stok, `StockMove` hareketlerinin toplamıdır — tek bir sayı alanı
 * tutmuyoruz ki "stok neden azaldı" sorusunun cevabı kaybolmasın.
 */

const UK = "uk";

/* ── yardımcılar ───────────────────────────────────────────── */

const sayi = (v: unknown): number => (v == null ? 0 : Number(v));
const sayiOpt = (v: unknown): number | undefined =>
  v == null ? undefined : Number(v);

/** Ürün ve varyant bazında stok toplamları */
async function stokHaritasi(urunIdleri: string[]) {
  if (urunIdleri.length === 0) {
    return { urun: new Map<string, number>(), varyant: new Map<string, number>() };
  }

  const hareketler = await db.stockMove.groupBy({
    by: ["productId", "variantId"],
    where: { productId: { in: urunIdleri } },
    _sum: { delta: true },
  });

  const urun = new Map<string, number>();
  const varyant = new Map<string, number>();

  for (const h of hareketler) {
    const adet = h._sum.delta ?? 0;
    urun.set(h.productId, (urun.get(h.productId) ?? 0) + adet);
    if (h.variantId) varyant.set(h.variantId, adet);
  }
  return { urun, varyant };
}

type UrunKaydi = Awaited<ReturnType<typeof urunleriCek>>[number];

function urunSorgusu(locale: string) {
  return {
    where: { isActive: true },
    include: {
      translations: { where: { locale } },
      collection: { include: { translations: { where: { locale } } } },
      category: true,
      supplier: true,
      media: { orderBy: { sortOrder: "asc" as const } },
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" as const },
      },
      fabrics: { include: { fabric: true }, orderBy: { sortOrder: "asc" as const } },
    },
    orderBy: { sortOrder: "asc" as const },
  };
}

async function urunleriCek(locale: string) {
  return db.product.findMany(urunSorgusu(locale));
}

function bicimle(
  p: UrunKaydi,
  stok: { urun: Map<string, number>; varyant: Map<string, number> }
): UrunDTO {
  const ceviri = p.translations[0];
  const kolCeviri = p.collection?.translations[0];
  const gorseller = p.media.map((m) => m.url);

  const variants: VaryantDTO[] = p.variants.map((v) => ({
    id: v.sku ?? v.id,
    label: v.label,
    price: sayi(v.price),
    stock: stok.varyant.get(v.id) ?? 0,
    widthCm: sayiOpt(v.widthCm),
    depthCm: sayiOpt(v.depthCm),
    heightCm: sayiOpt(v.heightCm),
  }));

  const toplamStok = stok.urun.get(p.id) ?? 0;

  return {
    id: p.id,
    slug: p.slug,
    name: ceviri?.name ?? p.slug,
    description: ceviri?.description ?? "",
    materials: ceviri?.materials ?? "",
    collection: kolCeviri?.name ?? "",
    collectionSlug: p.collection?.slug ?? "",
    category: p.category?.slug ?? "",
    brand: p.collection?.brand ?? "gabba",
    price: sayi(p.basePrice),
    image: gorseller[0] ?? "",
    images: gorseller,
    inStock: variants.length > 0 ? variants.some((v) => v.stock > 0) : toplamStok > 0,
    isFeatured: p.isFeatured,
    widthCm: sayiOpt(p.widthCm),
    depthCm: sayiOpt(p.depthCm),
    heightCm: sayiOpt(p.heightCm),
    leadTimeDays: p.supplier?.leadTimeDays ?? 21,
    variants,
    fabricCodes: p.fabrics.map((f) => f.fabric.code),
  };
}

/* ── genel okuma ───────────────────────────────────────────── */

export async function tumUrunler(locale = UK): Promise<UrunDTO[]> {
  const kayitlar = await urunleriCek(locale);
  const stok = await stokHaritasi(kayitlar.map((p) => p.id));
  return kayitlar.map((p) => bicimle(p, stok));
}

export async function urun(slug: string, locale = UK): Promise<UrunDTO | null> {
  const kayit = await db.product.findUnique({
    where: { slug },
    include: urunSorgusu(locale).include,
  });
  if (!kayit || !kayit.isActive) return null;
  const stok = await stokHaritasi([kayit.id]);
  return bicimle(kayit as UrunKaydi, stok);
}

export async function koleksiyonUrunleri(
  koleksiyonSlug: string,
  locale = UK
): Promise<UrunDTO[]> {
  const hepsi = await tumUrunler(locale);
  return hepsi.filter((p) => p.collectionSlug === koleksiyonSlug);
}

export async function tumKoleksiyonlar(locale = UK): Promise<KoleksiyonDTO[]> {
  const kayitlar = await db.collection.findMany({
    where: { isActive: true },
    include: {
      translations: { where: { locale } },
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return kayitlar.map((c) => ({
    slug: c.slug,
    name: c.translations[0]?.name ?? c.slug,
    description: c.translations[0]?.description ?? "",
    brand: c.brand,
    image: c.image ?? "",
    productCount: c._count.products,
  }));
}

export async function koleksiyon(
  slug: string,
  locale = UK
): Promise<KoleksiyonDTO | null> {
  const hepsi = await tumKoleksiyonlar(locale);
  return hepsi.find((c) => c.slug === slug) ?? null;
}

/* ── kumaşlar ──────────────────────────────────────────────── */

/** Renk yedeği: fotoğraf yüklenene kadar kumaş kodundan üretilen sabit ton */
const YEDEK_RENKLER: Record<string, string> = {
  bukle: "#DDD2C0",
  velvet: "#B99C94",
  linen: "#D2C9B8",
  leather: "#8A5230",
};

export async function urunKumaslari(
  urunSlug: string,
  locale = UK
): Promise<KumasDTO[]> {
  const kayitlar = await db.productFabric.findMany({
    where: { product: { slug: urunSlug } },
    include: {
      fabric: {
        include: {
          translations: { where: { locale } },
          group: { include: { translations: { where: { locale } } } },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return kayitlar.map(({ fabric: f }) => ({
    code: f.code,
    groupCode: f.group.code,
    groupName: f.group.translations[0]?.name ?? f.group.code,
    name: f.translations[0]?.name ?? f.code,
    composition: f.translations[0]?.composition ?? undefined,
    swatchUrl: f.swatchUrl ?? undefined,
    color: YEDEK_RENKLER[f.group.code] ?? "#CFC6B8",
    priceDelta: sayi(f.priceDelta),
    extraLeadDays: f.extraLeadDays ?? 0,
    inStock: f.isActive,
  }));
}
