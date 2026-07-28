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
  const [filtre, setFiltre] = useState<"hepsi" | "yatay" | "dikey">("hepsi");

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

  const suzulmus =
    filtre === "hepsi" ? gorseller : gorseller.filter((g) => yon(g) === filtre);

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

      {/* yön süzgeci */}
      <div className={styles.yonSuzgec}>
        {(["hepsi", "yatay", "dikey"] as const).map((f) => {
          const adet =
            f === "hepsi"
              ? gorseller.length
              : gorseller.filter((g) => yon(g) === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFiltre(f)}
              className={filtre === f ? styles.yonAktif : styles.yonPasif}
              aria-pressed={filtre === f}
            >
              {f === "hepsi" ? "Hepsi" : f === "yatay" ? "Yatay · geniş ekran" : "Dikey · telefon"}
              <span className={styles.yonAdet}>{adet}</span>
            </button>
          );
        })}
      </div>

      {suzulmus.length === 0 && (
        <p className={styles.havuzBos}>
          {gorseller.length === 0
            ? "Bu koleksiyonun katalog sunucusunda hiç fotoğrafı yok."
            : `Bu koleksiyonda ${filtre} fotoğraf yok.`}
        </p>
      )}

      {/* havuz */}
      <div className={styles.havuz}>
        {suzulmus.map((g) => {
          const genisSecili = g.url === kapak;
          const mobilSecili = g.url === mobilKapak;
          const isleniyor = bekliyor && secili === g.url;

          return (
            <figure key={g.url} className={styles.havuzItem}>
              <div className={styles.havuzMedia}>
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
    </>
  );
}
