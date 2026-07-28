import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import styles from "../../admin.module.css";
import EditForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function UrunDuzenle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const urun = await db.product.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale: "uk" } },
      collection: { include: { translations: { where: { locale: "uk" } } } },
      media: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      fabrics: { include: { fabric: { include: { translations: { where: { locale: "uk" } } } } } },
    },
  });
  if (!urun) notFound();

  // stok = hareketlerin toplamı
  const hareketler = await db.stockMove.groupBy({
    by: ["variantId"],
    where: { productId: urun.id },
    _sum: { delta: true },
  });
  const stokHarita = new Map(
    hareketler.filter((h) => h.variantId).map((h) => [h.variantId!, h._sum.delta ?? 0])
  );

  const son = await db.auditLog.findMany({
    where: { entity: "Product", entityId: urun.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const ceviri = urun.translations[0];

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>
            <Link href="/admin/urunler" className={styles.backLink}>
              ← Ürünler
            </Link>
          </p>
          <h1 className={styles.pageTitle}>{ceviri?.name ?? urun.slug}</h1>
          <p className={styles.pageLede}>
            {urun.collection?.translations[0]?.name ?? "—"} · {urun.slug}
          </p>
        </div>
        {urun.media[0] && (
          <div className={styles.headMedia}>
            <Image src={urun.media[0].url} alt="" fill sizes="140px" className={styles.rowImg} />
          </div>
        )}
      </header>

      <div className={styles.twoCol}>
        <div>
          <EditForm
            slug={urun.slug}
            baslangic={{
              name: ceviri?.name ?? "",
              description: ceviri?.description ?? "",
              materials: ceviri?.materials ?? "",
              seoTitle: ceviri?.seoTitle ?? "",
              seoDesc: ceviri?.seoDesc ?? "",
              basePrice: Number(urun.basePrice),
              isFeatured: urun.isFeatured,
              isActive: urun.isActive,
              sortOrder: urun.sortOrder,
            }}
            varyantlar={urun.variants.map((v) => ({
              id: v.id,
              label: v.label,
              price: Number(v.price),
              stock: stokHarita.get(v.id) ?? 0,
            }))}
          />
        </div>

        <aside className={styles.side}>
          <section className={styles.sideBox}>
            <h3 className={styles.sideTitle}>Kumaşlar</h3>
            {urun.fabrics.length === 0 ? (
              <p className={styles.sideEmpty}>Bu ürüne kumaş tanımlanmamış.</p>
            ) : (
              <div className={styles.chipWrap}>
                {urun.fabrics.map((pf) => (
                  <span key={pf.fabricId} className={styles.chip}>
                    {pf.fabric.translations[0]?.name ?? pf.fabric.code}
                  </span>
                ))}
              </div>
            )}
            <p className={styles.sideNote}>
              Kumaş eşleşmeleri panelde tutulur, katalog senkronunda korunur.
            </p>
          </section>

          <section className={styles.sideBox}>
            <h3 className={styles.sideTitle}>Son değişiklikler</h3>
            {son.length === 0 ? (
              <p className={styles.sideEmpty}>Henüz kayıt yok.</p>
            ) : (
              <ul className={styles.auditList}>
                {son.map((a) => {
                  const once = a.before as Record<string, unknown> | null;
                  const sonra = a.after as Record<string, unknown> | null;
                  const fiyatDegisti =
                    once && sonra && once.basePrice !== sonra.basePrice;
                  return (
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
                      {fiyatDegisti && (
                        <span className={styles.auditDiff}>
                          fiyat {String(once?.basePrice)} → {String(sonra?.basePrice)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <a
            href={`/products/${urun.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sideLinkBtn}
          >
            Sitede görüntüle →
          </a>
        </aside>
      </div>
    </>
  );
}
