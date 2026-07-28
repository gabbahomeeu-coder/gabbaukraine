import Link from "next/link";
import Image from "next/image";
import { ImageOff, Search } from "lucide-react";
import {
  panelUrunleri,
  panelKoleksiyonlari,
  type PanelDurum,
} from "@/lib/db/catalog";
import { formatPrice } from "@/lib/catalog";
import YayinAnahtari from "./yayin-anahtari";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

const DURUMLAR: { deger: PanelDurum; etiket: string }[] = [
  { deger: "hepsi", etiket: "Hepsi" },
  { deger: "yayinda", etiket: "Yayında" },
  { deger: "kapali", etiket: "Kapalı" },
  { deger: "gorselsiz", etiket: "Görselsiz" },
];

type Arama = {
  q?: string;
  durum?: string;
  koleksiyon?: string;
  sayfa?: string;
};

/** Süzgeçleri koruyarak adres üretir — sayfa değişince arama kaybolmasın */
function adres(mevcut: Arama, degisen: Partial<Arama>) {
  const p = new URLSearchParams();
  const birlesik = { ...mevcut, ...degisen };
  for (const [k, v] of Object.entries(birlesik)) {
    if (v && v !== "hepsi" && !(k === "sayfa" && v === "1")) p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `/admin/urunler?${s}` : "/admin/urunler";
}

export default async function UrunlerSayfasi({
  searchParams,
}: {
  searchParams: Promise<Arama>;
}) {
  const sp = await searchParams;
  const durum = (DURUMLAR.find((d) => d.deger === sp.durum)?.deger ??
    "hepsi") as PanelDurum;

  const [sonuc, koleksiyonlar] = await Promise.all([
    panelUrunleri({
      arama: sp.q ?? "",
      durum,
      koleksiyon: sp.koleksiyon ?? "",
      sayfa: Number(sp.sayfa) || 1,
    }),
    panelKoleksiyonlari(),
  ]);

  const suzuluyor =
    Boolean(sp.q) || durum !== "hepsi" || Boolean(sp.koleksiyon);

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Katalog · KAT-01</p>
          <h1 className={styles.pageTitle}>Ürünler</h1>
          <p className={styles.pageLede}>
            Yayın anahtarı siteye anında yansır. Her değişiklik denetim
            günlüğüne öncesi/sonrasıyla yazılır.
          </p>
        </div>
        <div className={styles.tally}>
          <div>
            <span className={styles.tallyN}>{sonuc.toplam}</span>
            <span className={styles.tallyL}>ürün</span>
          </div>
          <div>
            <span className={styles.tallyN}>{sonuc.yayindaSayisi}</span>
            <span className={styles.tallyL}>yayında</span>
          </div>
          <div>
            <span className={styles.tallyN}>{sonuc.gorselsizSayisi}</span>
            <span className={styles.tallyL}>görselsiz</span>
          </div>
        </div>
      </header>

      {sonuc.yayindaSayisi === 0 && (
        <div className={styles.notice}>
          Katalogdaki {sonuc.toplam} ürünün tamamı yayına kapalı — site şu an
          ürünsüz görünüyor. Aşağıdan &quot;kapalı&quot; düğmesine basarak
          istediğin ürünü yayına al.
        </div>
      )}

      {/* ── süzgeçler: sade GET formu, JavaScript gerektirmez ── */}
      <form method="get" action="/admin/urunler" className={styles.suzgec}>
        <div className={styles.aramaKutu}>
          <Search size={14} strokeWidth={2} className={styles.aramaIkon} />
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Ürün, koleksiyon veya adres ara…"
            className={styles.aramaGirdi}
          />
        </div>

        <select name="koleksiyon" defaultValue={sp.koleksiyon ?? ""} className={styles.secim}>
          <option value="">Tüm koleksiyonlar</option>
          {koleksiyonlar.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.ad} ({k.urunSayisi})
            </option>
          ))}
        </select>

        <select name="durum" defaultValue={durum} className={styles.secim}>
          {DURUMLAR.map((d) => (
            <option key={d.deger} value={d.deger}>
              {d.etiket}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.btnGhost}>
          Uygula
        </button>
        {suzuluyor && (
          <Link href="/admin/urunler" className={styles.suzgecSifirla}>
            Temizle
          </Link>
        )}
      </form>

      <p className={styles.sonucSayisi}>
        {sonuc.bulunan === 0
          ? "Süzgece uyan ürün yok."
          : `${sonuc.bulunan} ürün · sayfa ${sonuc.sayfa}/${sonuc.sayfaSayisi}`}
      </p>

      <div className={styles.rowList}>
        {sonuc.satirlar.map((u) => (
          <div key={u.slug} className={`${styles.row} ${styles.rowUrun}`}>
            <Link href={`/admin/urunler/${u.slug}`} className={styles.rowMedia}>
              {u.gorsel ? (
                <Image src={u.gorsel} alt="" fill sizes="72px" className={styles.rowImg} />
              ) : (
                <span className={styles.rowBos}>
                  <ImageOff size={15} strokeWidth={1.6} />
                </span>
              )}
            </Link>

            <Link href={`/admin/urunler/${u.slug}`} className={styles.rowMain}>
              <span className={styles.rowName}>{u.ad}</span>
              <span className={styles.rowMeta}>
                {u.koleksiyon || "—"}
                {u.kategori && ` · ${u.kategori}`}
              </span>
            </Link>

            <div className={styles.rowCol}>
              <span className={styles.rowK}>fiyat</span>
              <span className={styles.rowV}>{formatPrice(u.fiyat)}</span>
            </div>

            <div className={styles.rowCol}>
              <span className={styles.rowK}>stok</span>
              <span className={u.stok === 0 ? styles.rowVWarn : styles.rowV}>
                {u.stok === 0 ? "sipariş" : u.stok}
              </span>
            </div>

            <div className={styles.rowTags}>
              {u.gorselSayisi === 0 && (
                <span className={styles.tagWarn}>görsel yok</span>
              )}
              {u.kaynakKapali && <span className={styles.tagMuted}>kaynak kapalı</span>}
              {u.vitrinde && <span className={styles.tagGold}>vitrin</span>}
            </div>

            <YayinAnahtari
              slug={u.slug}
              baslangic={u.yayinda}
              gorselYok={u.gorselSayisi === 0}
            />
          </div>
        ))}
      </div>

      {sonuc.sayfaSayisi > 1 && (
        <nav className={styles.sayfalama} aria-label="Sayfalar">
          <Link
            href={adres(sp, { sayfa: String(sonuc.sayfa - 1) })}
            className={styles.sayfaBtn}
            aria-disabled={sonuc.sayfa === 1}
            style={sonuc.sayfa === 1 ? { pointerEvents: "none", opacity: 0.4 } : undefined}
          >
            ← Önceki
          </Link>
          <span className={styles.sayfaBilgi}>
            {sonuc.sayfa} / {sonuc.sayfaSayisi}
          </span>
          <Link
            href={adres(sp, { sayfa: String(sonuc.sayfa + 1) })}
            className={styles.sayfaBtn}
            aria-disabled={sonuc.sayfa === sonuc.sayfaSayisi}
            style={
              sonuc.sayfa === sonuc.sayfaSayisi
                ? { pointerEvents: "none", opacity: 0.4 }
                : undefined
            }
          >
            Sonraki →
          </Link>
        </nav>
      )}
    </>
  );
}
