import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import styles from "../../admin.module.css";
import GorselSecici, { type Gorsel } from "./gorsel-secici";

export const dynamic = "force-dynamic";

export default async function KoleksiyonDuzenle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const koleksiyon = await db.collection.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale: "uk" } },
      products: {
        where: { isActive: true },
        include: {
          translations: { where: { locale: "uk" } },
          media: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
  if (!koleksiyon) notFound();

  /* Görsel havuzu: koleksiyonun kendi kapakları + içindeki ürünlerin
     tüm görselleri. Aynı adres birden çok üründe geçebildiği için
     tekilleştiriliyor. */
  const havuz = new Map<string, Gorsel>();

  for (const url of [koleksiyon.image, koleksiyon.mobileImage]) {
    if (url && !havuz.has(url)) {
      havuz.set(url, { url, kind: "catalog", width: null, height: null, kaynak: "koleksiyon" });
    }
  }

  for (const urun of koleksiyon.products) {
    const ad = urun.translations[0]?.name ?? urun.slug;
    for (const m of urun.media) {
      if (havuz.has(m.url)) continue;
      havuz.set(m.url, {
        url: m.url,
        kind: m.kind,
        width: m.width,
        height: m.height,
        kaynak: ad,
      });
    }
  }

  /* Ortam fotoğrafları önce: kapak için uygun olanlar üstte dursun */
  const gorseller = [...havuz.values()].sort((a, b) => {
    const p = (g: Gorsel) => (g.kind === "catalog" ? 0 : g.kind === "cutout" ? 2 : 1);
    return p(a) - p(b);
  });

  const son = await db.auditLog.findMany({
    where: { entity: "Collection", entityId: koleksiyon.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>
            <Link href="/admin/koleksiyonlar" className={styles.backLink}>
              ← Koleksiyonlar
            </Link>
          </p>
          <h1 className={styles.pageTitle}>
            {koleksiyon.translations[0]?.name ?? koleksiyon.slug}
          </h1>
          <p className={styles.pageLede}>
            {koleksiyon.products.length} ürün · {gorseller.length} görsel seçeneği
          </p>
        </div>
      </header>

      <div className={styles.notice}>
        Havuzdaki görseller bu koleksiyondaki ürünlerden toplanıyor. Katalog
        sunucusu bağlandığında dikey ortam fotoğrafları da buraya düşecek —
        telefon kapağı için onları seçebileceksin.
      </div>

      <GorselSecici
        slug={koleksiyon.slug}
        gorseller={gorseller}
        kapak={koleksiyon.image}
        mobilKapak={koleksiyon.mobileImage}
      />

      {son.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Son değişiklikler</h2>
          <ul className={styles.auditList}>
            {son.map((a) => (
              <li key={a.id}>
                <span className={styles.auditTime}>
                  {a.createdAt.toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={styles.auditDiff}>
                  {a.action === "koleksiyon.mobil_kapak"
                    ? "telefon kapağı değişti"
                    : "kapak değişti"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
