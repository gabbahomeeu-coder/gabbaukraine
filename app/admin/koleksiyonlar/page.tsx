import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function KoleksiyonlarSayfasi() {
  const koleksiyonlar = await db.collection.findMany({
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
          <p className={styles.eyebrow}>Katalog · KAT-02</p>
          <h1 className={styles.pageTitle}>Koleksiyonlar</h1>
          <p className={styles.pageLede}>
            Her koleksiyonun kapak görselini buradan seçiyorsun. Seçim katalog
            senkronunda korunur — dış sunucudan gelen veri kapağı değiştirmez.
          </p>
        </div>
        <div className={styles.tally}>
          <div>
            <span className={styles.tallyN}>{koleksiyonlar.length}</span>
            <span className={styles.tallyL}>koleksiyon</span>
          </div>
          <div>
            <span className={styles.tallyN}>
              {koleksiyonlar.filter((k) => k.mobileImage).length}
            </span>
            <span className={styles.tallyL}>telefon kapağı</span>
          </div>
        </div>
      </header>

      <div className={styles.rowList}>
        {koleksiyonlar.map((k) => (
          <Link
            key={k.slug}
            href={`/admin/koleksiyonlar/${k.slug}`}
            className={styles.row}
          >
            <div className={styles.rowMedia}>
              {k.image && (
                <Image src={k.image} alt="" fill sizes="72px" className={styles.rowImg} />
              )}
            </div>

            <div className={styles.rowMain}>
              <span className={styles.rowName}>
                {k.translations[0]?.name ?? k.slug}
              </span>
              <span className={styles.rowMeta}>
                {k.brand === "monett" ? "Monett" : "Gabba"} · {k.slug}
              </span>
            </div>

            <div className={styles.rowCol}>
              <span className={styles.rowK}>ürün</span>
              <span className={styles.rowV}>{k._count.products}</span>
            </div>

            <div className={styles.rowCol}>
              <span className={styles.rowK}>kapak</span>
              <span className={k.image ? styles.rowV : styles.rowVWarn}>
                {k.image ? "var" : "yok"}
              </span>
            </div>

            <div className={styles.rowCol}>
              <span className={styles.rowK}>telefon</span>
              <span className={styles.rowV}>{k.mobileImage ? "özel" : "ortak"}</span>
            </div>

            <div className={styles.rowTags}>
              {!k.isActive && <span className={styles.tagMuted}>yayında değil</span>}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
