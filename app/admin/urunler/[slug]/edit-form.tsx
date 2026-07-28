"use client";

import { useState, useTransition } from "react";
import { urunKaydet, stokDuzelt } from "../actions";
import styles from "../../admin.module.css";

type Varyant = {
  id: string;
  label: string;
  price: number;
  stock: number;
};

export default function EditForm({
  slug,
  baslangic,
  varyantlar,
}: {
  slug: string;
  baslangic: {
    name: string;
    description: string;
    materials: string;
    seoTitle: string;
    seoDesc: string;
    basePrice: number;
    isFeatured: boolean;
    isActive: boolean;
    sortOrder: number;
  };
  varyantlar: Varyant[];
}) {
  const [bekliyor, basla] = useTransition();
  const [durum, setDurum] = useState<{ ok: boolean; mesaj: string } | null>(null);

  function kaydet(form: FormData) {
    basla(async () => {
      const sonuc = await urunKaydet(slug, form);
      setDurum(
        sonuc.ok ? { ok: true, mesaj: sonuc.mesaj } : { ok: false, mesaj: sonuc.hata }
      );
    });
  }

  return (
    <>
      <form action={kaydet} className={styles.form}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.fieldK}>Ürün adı (Ukraynaca)</span>
            <input name="name" defaultValue={baslangic.name} className={styles.input} required />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldK}>Taban fiyat (₴)</span>
            <input
              name="basePrice"
              type="number"
              step="1"
              min="1"
              defaultValue={baslangic.basePrice}
              className={styles.input}
              required
            />
            <span className={styles.fieldHint}>
              Ölçü seçenekleri varsa müşteriye onların fiyatı gösterilir.
            </span>
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldK}>Açıklama</span>
          <textarea
            name="description"
            defaultValue={baslangic.description}
            rows={3}
            className={styles.textarea}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldK}>Malzemeler</span>
          <textarea
            name="materials"
            defaultValue={baslangic.materials}
            rows={2}
            className={styles.textarea}
          />
        </label>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.fieldK}>SEO başlığı</span>
            <input name="seoTitle" defaultValue={baslangic.seoTitle} className={styles.input} />
            <span className={styles.fieldHint}>Boşsa ürün adı kullanılır.</span>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldK}>Sıra</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={baslangic.sortOrder}
              className={styles.input}
            />
            <span className={styles.fieldHint}>Küçük sayı önce gösterilir.</span>
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldK}>SEO açıklaması</span>
          <textarea
            name="seoDesc"
            defaultValue={baslangic.seoDesc}
            rows={2}
            className={styles.textarea}
          />
        </label>

        <div className={styles.checks}>
          <label className={styles.check}>
            <input type="checkbox" name="isFeatured" defaultChecked={baslangic.isFeatured} />
            <span>Ana sayfada öne çıkar</span>
          </label>
          <label className={styles.check}>
            <input type="checkbox" name="isActive" defaultChecked={baslangic.isActive} />
            <span>Sitede yayında</span>
          </label>
        </div>

        <div className={styles.formFoot}>
          <button type="submit" className={styles.btnPrimary} disabled={bekliyor}>
            {bekliyor ? "Kaydediliyor…" : "Kaydet"}
          </button>
          {durum && (
            <span className={durum.ok ? styles.okMsg : styles.errMsg}>{durum.mesaj}</span>
          )}
        </div>
      </form>

      {varyantlar.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ölçüler ve stok</h2>
          <p className={styles.sectionLede}>
            Stok üzerine yazılmaz — düzeltme bir hareket olarak kaydedilir, geçmiş
            kaybolmaz.
          </p>
          <div className={styles.stokList}>
            {varyantlar.map((v) => (
              <StokSatiri key={v.id} varyant={v} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function StokSatiri({ varyant }: { varyant: Varyant }) {
  const [adet, setAdet] = useState(varyant.stock);
  const [bekliyor, basla] = useTransition();
  const [mesaj, setMesaj] = useState<string | null>(null);

  function uygula() {
    basla(async () => {
      const sonuc = await stokDuzelt(varyant.id, adet, "");
      setMesaj(sonuc.ok ? sonuc.mesaj : sonuc.hata);
    });
  }

  return (
    <div className={styles.stokRow}>
      <span className={styles.stokLabel}>{varyant.label}</span>
      <span className={styles.stokPrice}>
        {varyant.price.toLocaleString("uk-UA")} ₴
      </span>
      <input
        type="number"
        min="0"
        value={adet}
        onChange={(e) => setAdet(Number(e.target.value))}
        className={styles.stokInput}
      />
      <button
        type="button"
        onClick={uygula}
        className={styles.btnGhost}
        disabled={bekliyor || adet === varyant.stock}
      >
        {bekliyor ? "…" : "Düzelt"}
      </button>
      {mesaj && <span className={styles.stokMsg}>{mesaj}</span>}
    </div>
  );
}
