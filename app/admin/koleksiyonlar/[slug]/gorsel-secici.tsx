"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Check, Monitor, Smartphone, X } from "lucide-react";
import { kapakSec, mobilKapakTemizle } from "../actions";
import styles from "../../admin.module.css";

export type Gorsel = {
  url: string;
  kind: string | null;
  width: number | null;
  height: number | null;
  kaynak: string;
};

type GrupAnahtari = "yatay" | "dikey" | "dekupe";

/** Sıra kasıtlı: kapak için en uygun olan üstte durur. */
const GRUPLAR: { anahtar: GrupAnahtari; baslik: string; aciklama: string }[] = [
  {
    anahtar: "yatay",
    baslik: "Yatay stüdyo fotoğrafları",
    aciklama: "Geniş ekran kapağı için — bilgisayardan bakan müşteri bunu görür.",
  },
  {
    anahtar: "dikey",
    baslik: "Dikey stüdyo fotoğrafları",
    aciklama:
      "Telefon kapağı için — trafiğin çoğu mobil olduğundan asıl önemli olan bu.",
  },
  {
    anahtar: "dekupe",
    baslik: "Ürün dekupeleri",
    aciklama:
      "Beyaz zeminde tek ürün. Kapak olarak kullanılabilir ama koleksiyon kartı vitrin gibi değil katalog gibi görünür.",
  },
];

export default function GorselSecici({
  slug,
  gorseller,
  kapak,
  mobilKapak,
}: {
  slug: string;
  gorseller: Gorsel[];
  kapak: string | null;
  mobilKapak: string | null;
}) {
  const [bekliyor, basla] = useTransition();
  const [durum, setDurum] = useState<{ ok: boolean; mesaj: string } | null>(null);
  const [secili, setSecili] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<"hepsi" | GrupAnahtari>("hepsi");

  function sec(url: string, hedef: "genis" | "mobil") {
    setSecili(url);
    basla(async () => {
      const s = await kapakSec(slug, url, hedef);
      setDurum(s.ok ? { ok: true, mesaj: s.mesaj } : { ok: false, mesaj: s.hata });
      setSecili(null);
    });
  }

  function temizle() {
    basla(async () => {
      const s = await mobilKapakTemizle(slug);
      setDurum(s.ok ? { ok: true, mesaj: s.mesaj } : { ok: false, mesaj: s.hata });
    });
  }

  const yon = (g: Gorsel) =>
    g.width && g.height ? (g.height > g.width ? "dikey" : "yatay") : "—";

  /* Üç grup. Dekupe fotoğraflar beyaz zeminde tek ürün gösterir —
     kapak için uygun değildir, o yüzden en sonda durur. */
  const grup = (g: Gorsel): GrupAnahtari =>
    g.kind === "cutout" ? "dekupe" : yon(g) === "dikey" ? "dikey" : "yatay";

  const gruplu = GRUPLAR.map((tanim) => ({
    ...tanim,
    ogeler: gorseller.filter((g) => grup(g) === tanim.anahtar),
  })).filter((x) => x.ogeler.length > 0);

  const gosterilecek =
    filtre === "hepsi" ? gruplu : gruplu.filter((x) => x.anahtar === filtre);

  return (
    <>
      {/* seçili kapaklar */}
      <div className={styles.kapaklar}>
        <div className={styles.kapakBox}>
          <div className={styles.kapakHead}>
            <Monitor size={15} strokeWidth={1.6} />
            <span>Geniş ekran kapağı</span>
          </div>
          <div className={styles.kapakMedia}>
            {kapak ? (
              <Image src={kapak} alt="" fill sizes="240px" className={styles.kapakImg} />
            ) : (
              <span className={styles.kapakBos}>seçilmedi</span>
            )}
          </div>
        </div>

        <div className={styles.kapakBox}>
          <div className={styles.kapakHead}>
            <Smartphone size={15} strokeWidth={1.6} />
            <span>Telefon kapağı</span>
            {mobilKapak && (
              <button
                type="button"
                onClick={temizle}
                className={styles.kapakClear}
                disabled={bekliyor}
                title="Telefon kapağını kaldır"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className={`${styles.kapakMedia} ${styles.kapakMediaDikey}`}>
            {mobilKapak ? (
              <Image src={mobilKapak} alt="" fill sizes="140px" className={styles.kapakImg} />
            ) : (
              <span className={styles.kapakBos}>
                seçilmedi — geniş ekran kapağı kullanılıyor
              </span>
            )}
          </div>
        </div>
      </div>

      {durum && (
        <p className={durum.ok ? styles.okMsg : styles.errMsg} style={{ marginBottom: 14 }}>
          {durum.mesaj}
        </p>
      )}

      {/* grup süzgeci */}
      <div className={styles.yonSuzgec}>
        <button
          type="button"
          onClick={() => setFiltre("hepsi")}
          className={filtre === "hepsi" ? styles.yonAktif : styles.yonPasif}
          aria-pressed={filtre === "hepsi"}
        >
          Hepsi
          <span className={styles.yonAdet}>{gorseller.length}</span>
        </button>
        {gruplu.map((x) => (
          <button
            key={x.anahtar}
            type="button"
            onClick={() => setFiltre(x.anahtar)}
            className={filtre === x.anahtar ? styles.yonAktif : styles.yonPasif}
            aria-pressed={filtre === x.anahtar}
          >
            {x.anahtar === "yatay"
              ? "Yatay"
              : x.anahtar === "dikey"
                ? "Dikey"
                : "Dekupe"}
            <span className={styles.yonAdet}>{x.ogeler.length}</span>
          </button>
        ))}
      </div>

      {gosterilecek.length === 0 && (
        <p className={styles.havuzBos}>
          Bu koleksiyonun katalog sunucusunda hiç fotoğrafı yok.
        </p>
      )}

      {/* her tür kendi bölümünde */}
      {gosterilecek.map((x) => (
        <section key={x.anahtar} className={styles.havuzGrup}>
          <div className={styles.havuzGrupBaslik}>
            <h3>{x.baslik}</h3>
            <span className={styles.havuzGrupAdet}>{x.ogeler.length}</span>
          </div>
          <p className={styles.havuzGrupNot}>{x.aciklama}</p>

          <div className={styles.havuz}>
            {x.ogeler.map((g) => {
              const genisSecili = g.url === kapak;
              const mobilSecili = g.url === mobilKapak;
              const isleniyor = bekliyor && secili === g.url;

              return (
                <figure key={g.url} className={styles.havuzItem}>
                  <div
                    className={styles.havuzMedia}
                    /* kutu oranı fotoğrafın kendi oranı — kırpma olmasın */
                    style={
                      g.width && g.height
                        ? ({ "--oran": `${g.width} / ${g.height}` } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <Image src={g.url} alt="" fill sizes="220px" className={styles.havuzImg} />
                    {(genisSecili || mobilSecili) && (
                      <span className={styles.havuzRozet}>
                        <Check size={12} strokeWidth={3} />
                        {genisSecili && mobilSecili
                          ? "kapak"
                          : genisSecili
                            ? "geniş"
                            : "telefon"}
                      </span>
                    )}
                  </div>

                  <figcaption className={styles.havuzMeta}>
                    <span className={styles.havuzYon}>
                      {yon(g)}
                      {g.width && g.height ? ` · ${g.width}×${g.height}` : ""}
                    </span>
                    <span className={styles.havuzKaynak}>{g.kaynak}</span>
                  </figcaption>

                  <div className={styles.havuzBtns}>
                    <button
                      type="button"
                      onClick={() => sec(g.url, "genis")}
                      disabled={bekliyor || genisSecili}
                      className={styles.havuzBtn}
                      title="Geniş ekran kapağı yap"
                    >
                      <Monitor size={13} strokeWidth={1.7} />
                      {isleniyor ? "…" : "Geniş"}
                    </button>
                    <button
                      type="button"
                      onClick={() => sec(g.url, "mobil")}
                      disabled={bekliyor || mobilSecili}
                      className={styles.havuzBtn}
                      title="Telefon kapağı yap"
                    >
                      <Smartphone size={13} strokeWidth={1.7} />
                      Telefon
                    </button>
                  </div>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
