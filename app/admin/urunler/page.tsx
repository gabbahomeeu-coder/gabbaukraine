import Link from "next/link";
import Image from "next/image";
import { tumUrunler } from "@/lib/db/catalog";
import { formatPrice } from "@/lib/catalog";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function UrunlerSayfasi() {
  const urunler = await tumUrunler();

  const stokToplam = urunler.reduce(
    (t, u) => t + u.variants.reduce((s, v) => s + v.stock, 0),
    0
  );
  const oneCikan = urunler.filter((u) => u.isFeatured).length;

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Katalog · KAT-01</p>
          <h1 className={styles.pageTitle}>Ürünler</h1>
          <p className={styles.pageLede}>
            Buradan yapılan değişiklik siteye anında yansır. Her kayıt denetim
            günlüğüne öncesi/sonrasıyla yazılır.
          </p>
        </div>
        <div className={styles.tally}>
          <div>
            <span className={styles.tallyN}>{urunler.length}</span>
            <span className={styles.tallyL}>ürün</span>
          </div>
          <div>
            <span className={styles.tallyN}>{oneCikan}</span>
            <span className={styles.tallyL}>öne çıkan</span>
          </div>
          <div>
            <span className={styles.tallyN}>{stokToplam}</span>
            <span className={styles.tallyL}>toplam stok</span>
          </div>
        </div>
      </header>

      <div className={styles.notice}>
        Fiyat ve stok yakında katalog sunucusundan gelecek. O zaman bu alanlar
        salt okunur olacak; SEO metni, öne çıkanlar ve kumaş eşleşmeleri panelde
        kalmaya devam edecek.
      </div>

      <div className={styles.rowList}>
        {urunler.map((u) => {
          const stok = u.variants.length
            ? u.variants.reduce((s, v) => s + v.stock, 0)
            : null;
          const enDusuk = u.variants.length
            ? Math.min(...u.variants.map((v) => v.price))
            : u.price;

          return (
            <Link key={u.slug} href={`/admin/urunler/${u.slug}`} className={styles.row}>
              <div className={styles.rowMedia}>
                {u.image && (
                  <Image src={u.image} alt="" fill sizes="72px" className={styles.rowImg} />
                )}
              </div>

              <div className={styles.rowMain}>
                <span className={styles.rowName}>{u.name}</span>
                <span className={styles.rowMeta}>
                  {u.collection || "—"} · {u.slug}
                </span>
              </div>

              <div className={styles.rowCol}>
                <span className={styles.rowK}>fiyat</span>
                <span className={styles.rowV}>
                  {formatPrice(enDusuk)}
                  {u.variants.length > 1 && <em className={styles.rowFrom}>&apos;den</em>}
                </span>
              </div>

              <div className={styles.rowCol}>
                <span className={styles.rowK}>ölçü</span>
                <span className={styles.rowV}>
                  {u.variants.length || "tek"}
                </span>
              </div>

              <div className={styles.rowCol}>
                <span className={styles.rowK}>stok</span>
                <span className={stok === 0 ? styles.rowVWarn : styles.rowV}>
                  {stok ?? "—"}
                </span>
              </div>

              <div className={styles.rowTags}>
                {u.isFeatured && <span className={styles.tagGold}>öne çıkan</span>}
                {u.fabricCodes.length > 0 && (
                  <span className={styles.tagMuted}>{u.fabricCodes.length} kumaş</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
