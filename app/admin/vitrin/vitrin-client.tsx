"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
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
  return (
    <>
      {/* ── ANA SAYFA VİTRİNİ ── */}
      <section className={styles.section} style={{ marginTop: 0 }}>
        <h2 className={styles.sectionTitle}>Ana sayfa vitrini</h2>
        <p className={styles.sectionLede}>
          Ana sayfada &quot;Обране цього сезону&quot; bölümünde bu ürünler, bu sırayla
          görünür. İlk sekiz tanesi geniş ekranda tek bakışta görülüyor.
        </p>

        <Siralanabilir
          ogeler={vitrindekiler.map((u) => ({
            id: u.id,
            icerik: <UrunKarti urun={u} vitrinde />,
          }))}
          kaydet={vitrinSirala}
          bosMesaj="Vitrinde ürün yok. Aşağıdan ekleyebilirsin."
        />
      </section>

      <VitrinEkle urunler={digerUrunler} />

      {/* ── KOLEKSİYON SIRASI ── */}
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

      {/* ── KATEGORİ SIRASI ── */}
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

function VitrinEkle({ urunler }: { urunler: Urun[] }) {
  const [acik, setAcik] = useState(false);
  const [arama, setArama] = useState("");
  const [bekliyor, basla] = useTransition();
  const [mesaj, setMesaj] = useState<string | null>(null);

  const suzulmus = arama
    ? urunler.filter(
        (u) =>
          u.ad.toLocaleLowerCase("uk").includes(arama.toLocaleLowerCase("uk")) ||
          u.koleksiyon.toLocaleLowerCase("uk").includes(arama.toLocaleLowerCase("uk"))
      )
    : urunler;

  function ekle(id: string) {
    basla(async () => {
      const s = await vitrineEkleCikar(id, true);
      setMesaj(s.mesaj);
    });
  }

  return (
    <section className={styles.section} style={{ marginTop: 26 }}>
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        className={styles.btnGhost}
      >
        <Plus size={14} strokeWidth={2} />
        {acik ? "Ürün ekleme listesini kapat" : `Vitrine ürün ekle (${urunler.length} ürün)`}
      </button>

      {mesaj && <p className={styles.okMsg} style={{ marginTop: 10 }}>{mesaj}</p>}

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

          <div className={styles.ekleIzgara}>
            {suzulmus.slice(0, 60).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => ekle(u.id)}
                disabled={bekliyor}
                className={styles.ekleKart}
              >
                <span className={styles.ekleMedia}>
                  {u.gorsel && (
                    <Image src={u.gorsel} alt="" fill sizes="150px" className={styles.rowImg} />
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

          {suzulmus.length > 60 && (
            <p className={styles.sectionLede} style={{ marginTop: 12 }}>
              {suzulmus.length} sonuçtan ilk 60'ı gösteriliyor — aramayı daralt.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ── kartlar ── */

function UrunKarti({ urun, vitrinde }: { urun: Urun; vitrinde?: boolean }) {
  const [bekliyor, basla] = useTransition();

  function cikar() {
    basla(async () => {
      await vitrineEkleCikar(urun.id, false);
    });
  }

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
      {vitrinde && (
        <button
          type="button"
          onClick={cikar}
          disabled={bekliyor}
          className={styles.vitrinCikar}
          title="Vitrinden çıkar"
        >
          <X size={13} strokeWidth={2.2} />
        </button>
      )}
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
