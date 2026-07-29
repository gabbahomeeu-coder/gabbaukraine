import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { db } from "@/lib/db/client";
import KoleksiyonYayinAnahtari from "./yayin-anahtari";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function KoleksiyonlarSayfasi() {
  const koleksiyonlar = await db.collection.findMany({
    include: {
      translations: { where: { locale: "uk" } },
      _count: {
        select: {
          products: true,
          // ikinci sayaç için ayrı sorgu gerekiyor; aşağıda toplanıyor
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // koleksiyon başına YAYINDAKİ ürün sayısı
  const yayindakiler = await db.product.groupBy({
    by: ["collectionId"],
    where: { isActive: true },
    _count: { _all: true },
  });
  const yayindaHarita = new Map(
    yayindakiler.map((y) => [y.collectionId, y._count._all])
  );

  const yayindaKoleksiyon = koleksiyonlar.filter((k) => k.isActive).length;
  const kapaksiz = koleksiyonlar.filter((k) => !k.image).length;

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Katalog · KAT-02</p>
          <h1 className={styles.pageTitle}>Koleksiyonlar</h1>
          <p className={styles.pageLede}>
            Kapak görselini koleksiyona girerek seçiyorsun; seçim katalog
            senkronunda korunur. Koleksiyon yayına alınmadan sayfası açılmaz —
            içindeki ürünler yayında olsa bile.
          </p>
        </div>
        <div className={styles.tally}>
          <div>
            <span className={styles.tallyN}>{koleksiyonlar.length}</span>
            <span className={styles.tallyL}>koleksiyon</span>
          </div>
          <div>
            <span className={styles.tallyN}>{yayindaKoleksiyon}</span>
            <span className={styles.tallyL}>yayında</span>
          </div>
          <div>
            <span className={styles.tallyN}>{kapaksiz}</span>
            <span className={styles.tallyL}>kapaksız</span>
          </div>
        </div>
      </header>

      {kapaksiz > 0 && (
        <div className={styles.notice}>
          {kapaksiz} koleksiyonun kapak görseli yok. Koleksiyona girip katalog
          fotoğraflarından kapak seçmeden yayına alamazsın.
        </div>
      )}

      <div className={styles.rowList}>
        {koleksiyonlar.map((k) => {
          const yayindaUrun = yayindaHarita.get(k.id) ?? 0;
          return (
            <div key={k.slug} className={`${styles.row} ${styles.rowKoleksiyon}`}>
              <Link
                href={`/admin/koleksiyonlar/${k.slug}`}
                className={styles.rowMedia}
              >
                {k.image ? (
                  <Image src={k.image} alt="" fill sizes="72px" className={styles.rowImg} />
                ) : (
                  <span className={styles.rowBos}>
                    <ImageOff size={15} strokeWidth={1.6} />
                  </span>
                )}
              </Link>

              <Link
                href={`/admin/koleksiyonlar/${k.slug}`}
                className={styles.rowMain}
              >
                <span className={styles.rowName}>
                  {k.translations[0]?.name ?? k.slug}
                </span>
                <span className={styles.rowMeta}>
                  {k.brand} · {k.slug}
                </span>
              </Link>

              <div className={styles.rowCol}>
                <span className={styles.rowK}>ürün</span>
                <span className={styles.rowV}>
                  {yayindaUrun}
                  <em className={styles.rowFrom}>/ {k._count.products}</em>
                </span>
              </div>

              <div className={styles.rowCol}>
                <span className={styles.rowK}>telefon</span>
                <span className={styles.rowV}>{k.mobileImage ? "özel" : "ortak"}</span>
              </div>

              <div className={styles.rowTags}>
                {!k.image && <span className={styles.tagWarn}>kapak yok</span>}
                {k.isActive && yayindaUrun === 0 && (
                  <span className={styles.tagWarn}>ürünsüz</span>
                )}
              </div>

              <KoleksiyonYayinAnahtari
                slug={k.slug}
                baslangic={k.isActive}
                kapakYok={!k.image}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
