"use client";

import { useState, useTransition } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { yayinDegistir } from "./actions";
import styles from "../admin.module.css";

/**
 * Satır içi yayın anahtarı.
 *
 * Durum önce ekranda değişir, sunucu hata döndürürse geri alınır —
 * 948 ürünü açarken her tıkta sunucu beklemek listeyi kullanılmaz kılar.
 */
export default function YayinAnahtari({
  slug,
  baslangic,
  gorselYok,
}: {
  slug: string;
  baslangic: boolean;
  gorselYok: boolean;
}) {
  const [yayinda, setYayinda] = useState(baslangic);
  const [hata, setHata] = useState<string | null>(null);
  const [bekliyor, basla] = useTransition();

  function degistir() {
    const hedef = !yayinda;
    setYayinda(hedef);
    setHata(null);

    basla(async () => {
      const s = await yayinDegistir(slug, hedef);
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
        disabled={bekliyor || (gorselYok && !yayinda)}
        className={yayinda ? styles.yayinAcik : styles.yayinKapali}
        title={
          gorselYok && !yayinda
            ? "Görseli olmayan ürün yayına açılamaz"
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
            {gorselYok ? <EyeOff size={12} strokeWidth={2} /> : <Eye size={12} strokeWidth={2} />}
            kapalı
          </>
        )}
      </button>
      {hata && <span className={styles.yayinHata}>{hata}</span>}
    </div>
  );
}
