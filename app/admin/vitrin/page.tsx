import { db } from "@/lib/db/client";
import { formatPrice } from "@/lib/catalog";
import styles from "../admin.module.css";
import VitrinClient from "./vitrin-client";

export const dynamic = "force-dynamic";

export default async function VitrinSayfasi() {
  const urunler = await db.product.findMany({
    where: { isActive: true },
    include: {
      translations: { where: { locale: "uk" } },
      collection: { include: { translations: { where: { locale: "uk" } } } },
      media: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { sortOrder: "asc" },
  });

  const bicimle = (p: (typeof urunler)[number]) => ({
    id: p.id,
    slug: p.slug,
    ad: p.translations[0]?.name ?? p.slug,
    koleksiyon: p.collection?.translations[0]?.name ?? "—",
    fiyat: formatPrice(Number(p.basePrice)),
    gorsel: p.media[0]?.url ?? null,
  });

  const vitrindekiler = urunler.filter((p) => p.isFeatured).map(bicimle);
  const digerUrunler = urunler.filter((p) => !p.isFeatured).map(bicimle);

  const koleksiyonlar = await db.collection.findMany({
    include: {
      translations: { where: { locale: "uk" } },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  const kategoriler = await db.category.findMany({
    include: {
      translations: { where: { locale: "uk" } },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Katalog · vitrin düzeni</p>
          <h1 className={styles.pageTitle}>Ön yüzde ne görünecek</h1>
          <p className={styles.pageLede}>
            Sürükleyerek sırala. Değişiklik anında kaydedilir ve site güncellenir.
            Bu düzen yereldir — katalog senkronu bozmaz.
          </p>
        </div>
        <div className={styles.tally}>
          <div>
            <span className={styles.tallyN}>{vitrindekiler.length}</span>
            <span className={styles.tallyL}>vitrinde</span>
          </div>
          <div>
            <span className={styles.tallyN}>{urunler.length}</span>
            <span className={styles.tallyL}>toplam ürün</span>
          </div>
        </div>
      </header>

      <VitrinClient
        vitrindekiler={vitrindekiler}
        digerUrunler={digerUrunler}
        koleksiyonlar={koleksiyonlar.map((k) => ({
          id: k.id,
          ad: k.translations[0]?.name ?? k.slug,
          alt: `${k._count.products} ürün · ${k.brand === "monett" ? "Monett" : "Gabba"}`,
          gorsel: k.image,
        }))}
        kategoriler={kategoriler.map((k) => ({
          id: k.id,
          ad: k.translations[0]?.name ?? k.slug,
          alt: `${k._count.products} ürün`,
          gorsel: k.image,
        }))}
      />
    </>
  );
}
