import Link from "next/link";
import { MODULES, SUB_MODULES, ALL_EVENTS } from "@/lib/modules/registry";
import { sonKayitlar } from "@/lib/modules/kilavuz";
import styles from "./admin.module.css";

/**
 * MOD-01 · Sistem haritası — panelin ana ekranı
 *
 * Şu an modül durumları kayıt defterinden geliyor (hepsi açık varsayılıyor).
 * Veritabanı kurulunca gerçek durum, sağlık kontrolü ve son olaylar
 * buraya bağlanacak.
 */
export default async function AdminHome() {
  const platform = MODULES.filter((m) => m.layer === "PLATFORM");
  const is = MODULES.filter((m) => m.layer === "IS");
  const kayitlar = await sonKayitlar(MODULES.map((m) => m.code), 6);

  const cekirdek = MODULES.filter((m) => m.isCore).length;

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Modül yönetimi · MOD-01</p>
          <h1 className={styles.pageTitle}>Sistem haritası</h1>
        </div>
        <div className={styles.tally}>
          <div>
            <span className={styles.tallyN}>{MODULES.length}</span>
            <span className={styles.tallyL}>modül</span>
          </div>
          <div>
            <span className={styles.tallyN}>{SUB_MODULES.length}</span>
            <span className={styles.tallyL}>alt modül</span>
          </div>
          <div>
            <span className={styles.tallyN}>{ALL_EVENTS.length}</span>
            <span className={styles.tallyL}>olay</span>
          </div>
          <div>
            <span className={styles.tallyN}>{cekirdek}</span>
            <span className={styles.tallyL}>çekirdek</span>
          </div>
        </div>
      </header>

      <div className={styles.notice}>
        Veritabanı henüz bağlı değil. Modül durumları kayıt defterinden okunuyor;
        aç/kapat, sağlık kontrolü ve canlı olay akışı veritabanı kurulunca devreye girecek.
      </div>

      {/* ── PLATFORM ── */}
      <p className={styles.bandLabel}>
        <span>Platform katmanı</span>
        <em>modülleri taşır, yönetir ve dışarı açar</em>
      </p>
      <div className={styles.grid}>
        {platform.map((m) => (
          <ModulKutusu key={m.code} m={m} platform />
        ))}
      </div>

      {/* ── OMURGA ── */}
      <div className={styles.spine}>
        <span className={styles.spineLabel}>Olay omurgası</span>
        <span className={styles.spineNote}>
          modüller arası her geçiş buradan ve bekçiden geçer
        </span>
        <div className={styles.spineEvents}>
          {ALL_EVENTS.slice(0, 8).map((e) => (
            <span key={e}>{e}</span>
          ))}
          {ALL_EVENTS.length > 8 && <span>+{ALL_EVENTS.length - 8}</span>}
        </div>
      </div>

      {/* ── İŞ ── */}
      <p className={styles.bandLabel}>
        <span>İş katmanı</span>
        <em>satışı, müşteriyi ve içeriği yürütür</em>
      </p>
      <div className={styles.grid}>
        {is.map((m) => (
          <ModulKutusu key={m.code} m={m} />
        ))}
      </div>

      {/* ── SON DEĞİŞİKLİKLER ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Son değişiklikler</h2>
        <p className={styles.sectionLede}>
          Alt modüllerde yapılan her düzeltme ve güncelleme kılavuza yazılır,
          buraya yükselir.
        </p>

        {kayitlar.length === 0 ? (
          <p className={styles.empty}>Henüz kayıt yok.</p>
        ) : (
          <ul className={styles.log}>
            {kayitlar.map((k, i) => (
              <li key={i}>
                <div className={styles.logTop}>
                  <span className={`${styles.logTip} ${tipSinifi(k.tip, styles)}`}>{k.tip}</span>
                  <Link href={`/admin/moduller/${k.modulKodu}`} className={styles.logKunye}>
                    {k.kunye ?? k.modulKodu}
                  </Link>
                  <span className={styles.logTarih}>
                    {k.tarih} · {k.saat}
                  </span>
                  <span className={styles.logYazar}>{k.yazar}</span>
                </div>
                <p className={styles.logBaslik}>{k.baslik}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function tipSinifi(tip: string, s: Record<string, string>) {
  const t = tip.toLocaleLowerCase("tr");
  if (t.startsWith("ekle")) return s.tipEkleme;
  if (t.startsWith("düzelt")) return s.tipDuzeltme;
  if (t.startsWith("kaldır")) return s.tipKaldirma;
  return s.tipDegisiklik;
}

function ModulKutusu({
  m,
  platform = false,
}: {
  m: (typeof MODULES)[number];
  platform?: boolean;
}) {
  return (
    <Link
      href={`/admin/moduller/${m.code}`}
      className={`${styles.node} ${platform ? styles.nodePlatform : ""}`}
    >
      <div className={styles.nodeHead}>
        <span className={styles.nodeId}>{m.code}</span>
        <span className={styles.nodeName}>{m.name}</span>
        {m.isCore && <span className={styles.nodeCore}>çekirdek</span>}
      </div>
      <div className={styles.subs}>
        {m.subModules.map((s) => (
          <span key={s.code} className={styles.sub}>
            {s.code.split("-")[1]} {s.name.toLocaleLowerCase("tr")}
          </span>
        ))}
      </div>
    </Link>
  );
}
