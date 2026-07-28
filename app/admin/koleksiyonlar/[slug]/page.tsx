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
      // koleksiyonun kendi stüdyo fotoğrafları — kapak asıl buradan seçilir
      media: { orderBy: { sortOrder: "asc" } },
      products: {
        // yayın durumundan BAĞIMSIZ: kapağı seçmeden koleksiyonu yayına
        // alamıyorsun, ürünleri de açmadan kapak seçemezsen kilitlenirsin
        include: {
          translations: { where: { locale: "uk" } },
          media: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
  if (!koleksiyon) notFound();

  /* Görsel havuzu üç kaynaktan gelir:
       1. koleksiyonun stüdyo fotoğrafları (CRM "studio" bölümü)
       2. içindeki ürünlerin dekupe görselleri
       3. hâlihazırda seçilmiş kapaklar
     Aynı adres birden çok yerde geçebildiği için tekilleştiriliyor. */
  const havuz = new Map<string, Gorsel>();

  for (const m of koleksiyon.media) {
    if (havuz.has(m.url)) continue;
    havuz.set(m.url, {
      url: m.url,
      kind: m.kind,
      width: m.width,
      height: m.height,
      kaynak: "katalog",
    });
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

  for (const url of [koleksiyon.image, koleksiyon.mobileImage]) {
    if (url && !havuz.has(url)) {
      havuz.set(url, { url, kind: "catalog", width: null, height: null, kaynak: "seçili kapak" });
    }
  }

  /* Katalog fotoğrafları önce, dekupeler sonra — kapak için uygun
     olanlar listenin başında dursun. */
  const gorseller = [...havuz.values()].sort((a, b) => {
    const p = (g: Gorsel) => (g.kind === "catalog" ? 0 : g.kind === "cutout" ? 2 : 1);
    return p(a) - p(b);
  });

  const yatay = gorseller.filter((g) => g.width && g.height && g.width > g.height).length;
  const dikey = gorseller.filter((g) => g.width && g.height && g.height > g.width).length;

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
            {koleksiyon.products.length} ürün · {gorseller.length} görsel ·{" "}
            {yatay} yatay, {dikey} dikey
          </p>
        </div>
      </header>

      <div className={styles.notice}>
        Görseller katalog sunucusundaki stüdyo çekimlerinden geliyor. Geniş
        ekran kapağı için <strong>yatay</strong>, telefon kapağı için{" "}
        <strong>dikey</strong> bir fotoğraf seç — telefon kapağı seçilmezse
        geniş ekran kapağı kullanılır. Seçimin katalog senkronunda korunur.
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
