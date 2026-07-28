import Link from "next/link";
import { notFound } from "next/navigation";
import { MODULES, MODULE_MAP, listenersOf } from "@/lib/modules/registry";
import { modulKilavuzu, altModulKilavuzu } from "@/lib/modules/kilavuz";
import styles from "../../admin.module.css";

export function generateStaticParams() {
  return MODULES.map((m) => ({ kod: m.code }));
}

export default async function ModulSayfasi({
  params,
}: {
  params: Promise<{ kod: string }>;
}) {
  const { kod } = await params;
  const m = MODULE_MAP.get(kod.toUpperCase());
  if (!m) notFound();

  const kayitlar = await modulKilavuzu(m.code);
  const altKayitlar = await Promise.all(
    m.subModules.map(async (s) => ({
      kunye: s.code,
      adet: (await altModulKilavuzu(s.code)).length,
    }))
  );
  const altSayilar = new Map(altKayitlar.map((a) => [a.kunye, a.adet]));

  const bagimliOlanlar = MODULES.filter((x) => x.dependsOn.includes(m.code));

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>
            {m.layer === "PLATFORM" ? "Platform katmanı" : "İş katmanı"} · {m.code}
          </p>
          <h1 className={styles.pageTitle}>{m.name}</h1>
          <p className={styles.pageLede}>{m.summary}</p>
        </div>
      </header>

      <div className={styles.metaRow}>
        <div className={styles.metaBox}>
          <span className={styles.metaK}>Durum</span>
          <span className={styles.metaV}>
            {m.isCore ? "Çekirdek — kapatılamaz" : "Kapatılabilir"}
          </span>
        </div>
        <div className={styles.metaBox}>
          <span className={styles.metaK}>Bağımlı olduğu</span>
          <span className={styles.metaV}>
            {m.dependsOn.length ? m.dependsOn.join(" · ") : "yok"}
          </span>
        </div>
        <div className={styles.metaBox}>
          <span className={styles.metaK}>Buna bağımlı olanlar</span>
          <span className={styles.metaV}>
            {bagimliOlanlar.length ? bagimliOlanlar.map((b) => b.code).join(" · ") : "yok"}
          </span>
        </div>
        <div className={styles.metaBox}>
          <span className={styles.metaK}>Alt modül</span>
          <span className={styles.metaV}>{m.subModules.length}</span>
        </div>
      </div>

      {/* ── ALT MODÜLLER ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Alt modüller</h2>
        <p className={styles.sectionLede}>
          Bunlar birbiriyle modül içinde doğrudan konuşur. Dışarıyla her temas
          olay üzerinden ve bekçiden geçerek olur.
        </p>

        <div className={styles.subList}>
          {m.subModules.map((s) => {
            const adet = altSayilar.get(s.code) ?? 0;
            return (
              <article key={s.code} className={styles.subCard}>
                <div className={styles.subCardHead}>
                  <span className={styles.subCardId}>{s.code}</span>
                  <span className={styles.subCardName}>{s.name}</span>
                  {adet > 0 && (
                    <span className={styles.subCardLog}>{adet} kayıt</span>
                  )}
                </div>
                <p className={styles.subCardText}>{s.responsibility}</p>

                {(s.emits?.length || s.listens?.length) && (
                  <div className={styles.wires}>
                    {s.emits?.length ? (
                      <div className={styles.wire}>
                        <span className={styles.wireK}>yayar</span>
                        <span>
                          {s.emits.map((e) => (
                            <code key={e} className={styles.evt}>
                              {e}
                            </code>
                          ))}
                        </span>
                      </div>
                    ) : null}
                    {s.listens?.length ? (
                      <div className={styles.wire}>
                        <span className={styles.wireK}>dinler</span>
                        <span>
                          {s.listens.map((e) => (
                            <code key={e} className={styles.evt}>
                              {e}
                            </code>
                          ))}
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ── ATARDAMARLAR ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Atardamarlar</h2>
        <p className={styles.sectionLede}>
          Bu modülün yaydığı olayları hangi modüller dinliyor.
        </p>

        {(() => {
          const yayilanlar = [
            ...new Set(m.subModules.flatMap((s) => s.emits ?? [])),
          ];
          if (!yayilanlar.length) {
            return <p className={styles.empty}>Bu modül henüz olay yaymıyor.</p>;
          }
          return (
            <ul className={styles.flowList}>
              {yayilanlar.map((olay) => {
                const dinleyenler = listenersOf(olay).filter(
                  (d) => d.moduleCode !== m.code
                );
                return (
                  <li key={olay}>
                    <code className={styles.evtBig}>{olay}</code>
                    <span className={styles.arrow}>→</span>
                    {dinleyenler.length ? (
                      <span className={styles.dinleyen}>
                        {dinleyenler.map((d) => (
                          <Link
                            key={d.code}
                            href={`/admin/moduller/${d.moduleCode}`}
                            className={styles.dinleyenLink}
                          >
                            {d.code} {d.name}
                          </Link>
                        ))}
                      </span>
                    ) : (
                      <span className={styles.dinleyenYok}>henüz dinleyen yok</span>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        })()}
      </section>

      {/* ── KILAVUZ ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Kılavuz</h2>
        <p className={styles.sectionLede}>
          Bu modülde ve alt modüllerinde yapılan her değişiklik — en yeniden eskiye.
        </p>

        {kayitlar.length === 0 ? (
          <p className={styles.empty}>Henüz kayıt yok.</p>
        ) : (
          <div className={styles.entries}>
            {kayitlar.map((k, i) => (
              <article key={i} className={styles.entry}>
                <div className={styles.entryMeta}>
                  <span className={`${styles.logTip} ${tipSinifi(k.tip, styles)}`}>
                    {k.tip}
                  </span>
                  {k.kunye && <span className={styles.entryKunye}>{k.kunye}</span>}
                  <span className={styles.logTarih}>
                    {k.tarih} · {k.saat}
                  </span>
                  <span className={styles.logYazar}>{k.yazar}</span>
                </div>
                <h3 className={styles.entryTitle}>{k.baslik}</h3>
                <div className={styles.ba}>
                  <div className={styles.before}>
                    <span className={styles.baLabel}>önce</span>
                    {k.once}
                  </div>
                  <div className={styles.after}>
                    <span className={styles.baLabel}>sonra</span>
                    {k.sonra}
                  </div>
                </div>
                {k.neden && (
                  <p className={styles.entryNeden}>
                    <b>Neden:</b> {k.neden}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <div className={styles.hint}>
          Yeni kayıt eklemek için:
          <code>npm run kilavuz -- ekle {m.subModules[0]?.code ?? m.code} --tip duzeltme --baslik &quot;…&quot; --once &quot;…&quot; --sonra &quot;…&quot;</code>
        </div>
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
