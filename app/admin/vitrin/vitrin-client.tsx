"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import Siralanabilir from "@/components/admin/siralanabilir";
import {
  vitrinSirala,
  vitrineEkleCikar,
  koleksiyonSirala,
  kategoriSirala,
} from "./actions";
import styles from "../admin.module.css";

type Urun = {
  id: string;
  slug: string;
  ad: string;
  koleksiyon: string;
  fiyat: string;
  gorsel: string | null;
};

type Basit = { id: string; ad: string; alt: string; gorsel: string | null };

/**
 * Vitrin düzeni.
 *
 * Ekleme ve çıkarma listeleri ANINDA günceller — sunucu yanıtı
 * beklenmez, sayfa yenilenmez. Sunucu hata döndürürse değişiklik
 * geri alınır.
 */
export default function VitrinClient({
  vitrindekiler,
  digerUrunler,
  koleksiyonlar,
  kategoriler,
}: {
  vitrindekiler: Urun[];
  digerUrunler: Urun[];
  koleksiyonlar: Basit[];
  kategoriler: Basit[];
}) {
  const router = useRouter();
  const [vitrin, setVitrin] = useState(vitrindekiler);
  const [havuz, setHavuz] = useState(digerUrunler);
  const [mesaj, setMesaj] = useState<{ ok: boolean; metin: string } | null>(null);
  const [, basla] = useTransition();

  // sunucudan yeni veri gelirse (ör. başka sekmede değişiklik) senkronla
  useEffect(() => {
    setVitrin(vitrindekiler);
    setHavuz(digerUrunler);
  }, [vitrindekiler, digerUrunler]);

  function vitrineEkle(urun: Urun) {
    // önce ekranda göster
    setVitrin((v) => [...v, urun]);
    setHavuz((h) => h.filter((u) => u.id !== urun.id));
    setMesaj({ ok: true, metin: `${urun.ad} vitrine eklendi — sıraya sürükleyebilirsin.` });

    basla(async () => {
      const s = await vitrineEkleCikar(urun.id, true);
      if (!s.ok) {
        setVitrin((v) => v.filter((u) => u.id !== urun.id));
        setHavuz((h) => [urun, ...h]);
        setMesaj({ ok: false, metin: s.mesaj });
        return;
      }
      router.refresh();
    });
  }

  function vitrindenCikar(urun: Urun) {
    setVitrin((v) => v.filter((u) => u.id !== urun.id));
    setHavuz((h) => [urun, ...h]);
    setMesaj({ ok: true, metin: `${urun.ad} vitrinden çıkarıldı.` });

    basla(async () => {
      const s = await vitrineEkleCikar(urun.id, false);
      if (!s.ok) {
        setVitrin((v) => [...v, urun]);
        setHavuz((h) => h.filter((u) => u.id !== urun.id));
        setMesaj({ ok: false, metin: s.mesaj });
        return;
      }
      router.refresh();
    });
  }

  const vitrinOgeleri = useMemo(
    () =>
      vitrin.map((u) => ({
        id: u.id,
        icerik: <UrunKarti urun={u} cikar={() => vitrindenCikar(u)} />,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vitrin]
  );

  return (
    <>
      <section className={styles.section} style={{ marginTop: 0 }}>
        <h2 className={styles.sectionTitle}>Ana sayfa vitrini</h2>
        <p className={styles.sectionLede}>
          Ana sayfada &quot;Обране цього сезону&quot; bölümünde bu ürünler, bu sırayla
          görünür. İlk sekiz tanesi geniş ekranda tek bakışta görülüyor.
        </p>

        {mesaj && (
          <p
            className={mesaj.ok ? styles.okMsg : styles.errMsg}
            style={{ marginBottom: 12 }}
            role="status"
          >
            {mesaj.metin}
          </p>
        )}

        <Siralanabilir
          ogeler={vitrinOgeleri}
          kaydet={vitrinSirala}
          bosMesaj="Vitrinde ürün yok. Aşağıdan ekleyebilirsin."
        />
      </section>

      <VitrinEkle urunler={havuz} ekle={vitrineEkle} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Koleksiyon sırası</h2>
        <p className={styles.sectionLede}>
          Ana sayfada ve koleksiyonlar sayfasında bu sırayla listelenir.
        </p>
        <Siralanabilir
          duzen="liste"
          ogeler={koleksiyonlar.map((k) => ({
            id: k.id,
            icerik: <BasitSatir oge={k} />,
          }))}
          kaydet={koleksiyonSirala}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Kategori sırası</h2>
        <p className={styles.sectionLede}>
          Ana sayfadaki kategori kartlarının sırası. Sondaki kart geniş gösterilir.
        </p>
        <Siralanabilir
          duzen="liste"
          ogeler={kategoriler.map((k) => ({
            id: k.id,
            icerik: <BasitSatir oge={k} />,
          }))}
          kaydet={kategoriSirala}
        />
      </section>
    </>
  );
}

/* ── vitrine ürün ekleme ── */

function VitrinEkle({
  urunler,
  ekle,
}: {
  urunler: Urun[];
  ekle: (u: Urun) => void;
}) {
  const [acik, setAcik] = useState(false);
  const [arama, setArama] = useState("");

  const suzulmus = arama
    ? urunler.filter((u) => {
        const q = arama.toLocaleLowerCase("uk");
        return (
          u.ad.toLocaleLowerCase("uk").includes(q) ||
          u.koleksiyon.toLocaleLowerCase("uk").includes(q)
        );
      })
    : urunler;

  return (
    <section className={styles.section} style={{ marginTop: 26 }}>
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        className={styles.btnGhost}
      >
        <Plus size={14} strokeWidth={2} />
        {acik
          ? "Ürün ekleme listesini kapat"
          : `Vitrine ürün ekle (${urunler.length} ürün)`}
      </button>

      {acik && (
        <div style={{ marginTop: 14 }}>
          <input
            type="search"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Ürün veya koleksiyon ara…"
            className={styles.input}
            style={{ maxWidth: 320, marginBottom: 14 }}
          />

          {suzulmus.length === 0 ? (
            <p className={styles.sectionLede}>
              {urunler.length === 0
                ? "Tüm ürünler vitrinde."
                : "Aramaya uyan ürün yok."}
            </p>
          ) : (
            <div className={styles.ekleIzgara}>
              {suzulmus.slice(0, 60).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => ekle(u)}
                  className={styles.ekleKart}
                >
                  <span className={styles.ekleMedia}>
                    {u.gorsel && (
                      <Image
                        src={u.gorsel}
                        alt=""
                        fill
                        sizes="150px"
                        className={styles.rowImg}
                      />
                    )}
                    <span className={styles.ekleArti}>
                      <Plus size={16} strokeWidth={2.5} />
                    </span>
                  </span>
                  <span className={styles.ekleAd}>{u.ad}</span>
                  <span className={styles.ekleMeta}>{u.fiyat}</span>
                </button>
              ))}
            </div>
          )}

          {suzulmus.length > 60 && (
            <p className={styles.sectionLede} style={{ marginTop: 12 }}>
              {suzulmus.length} sonuçtan ilk 60&apos;ı gösteriliyor — aramayı daralt.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ── kartlar ── */

function UrunKarti({ urun, cikar }: { urun: Urun; cikar: () => void }) {
  return (
    <div className={styles.vitrinKart}>
      <div className={styles.vitrinMedia}>
        {urun.gorsel && (
          <Image src={urun.gorsel} alt="" fill sizes="190px" className={styles.rowImg} />
        )}
      </div>
      <div className={styles.vitrinBilgi}>
        <span className={styles.vitrinAd}>{urun.ad}</span>
        <span className={styles.vitrinMeta}>
          {urun.koleksiyon} · {urun.fiyat}
        </span>
      </div>
      <button
        type="button"
        onClick={cikar}
        className={styles.vitrinCikar}
        title="Vitrinden çıkar"
        aria-label={`${urun.ad} — vitrinden çıkar`}
      >
        <X size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
}

function BasitSatir({ oge }: { oge: Basit }) {
  return (
    <div className={styles.basitSatir}>
      <span className={styles.basitMedia}>
        {oge.gorsel && (
          <Image src={oge.gorsel} alt="" fill sizes="56px" className={styles.rowImg} />
        )}
      </span>
      <span className={styles.basitAd}>{oge.ad}</span>
      <span className={styles.basitAlt}>{oge.alt}</span>
    </div>
  );
}
