"use client";

import { useState, useTransition } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { koleksiyonYayinDegistir } from "./actions";
import styles from "../admin.module.css";

/** Koleksiyon yayın anahtarı — ürün listesindekiyle aynı davranış */
export default function KoleksiyonYayinAnahtari({
  slug,
  baslangic,
  kapakYok,
}: {
  slug: string;
  baslangic: boolean;
  kapakYok: boolean;
}) {
  const [yayinda, setYayinda] = useState(baslangic);
  const [hata, setHata] = useState<string | null>(null);
  const [bekliyor, basla] = useTransition();

  function degistir() {
    const hedef = !yayinda;
    setYayinda(hedef);
    setHata(null);

    basla(async () => {
      const s = await koleksiyonYayinDegistir(slug, hedef);
      if (!s.ok) {
        setYayinda(!hedef);
        setHata(s.hata);
      }
    });
  }

  return (
    <div className={styles.yayinKutu}>
      <button
        type="button"
        onClick={degistir}
        disabled={bekliyor || (kapakYok && !yayinda)}
        className={yayinda ? styles.yayinAcik : styles.yayinKapali}
        title={
          kapakYok && !yayinda
            ? "Kapağı olmayan koleksiyon yayına açılamaz"
            : yayinda
              ? "Yayından kaldır"
              : "Yayına al"
        }
        aria-pressed={yayinda}
      >
        {yayinda ? (
          <>
            <Check size={12} strokeWidth={2.6} />
            yayında
          </>
        ) : (
          <>
            {kapakYok ? <EyeOff size={12} strokeWidth={2} /> : <Eye size={12} strokeWidth={2} />}
            kapalı
          </>
        )}
      </button>
      {hata && <span className={styles.yayinHata}>{hata}</span>}
    </div>
  );
}
