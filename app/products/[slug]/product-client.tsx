"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Check, Ruler, Truck, Shield, Hammer } from "lucide-react";
import type { UrunDTO, KumasDTO, KumasGrubuDTO } from "@/lib/db/types";
import { formatPrice } from "@/lib/catalog";

import { WA_LINK, PHONE } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import styles from "./product.module.css";

function trackLead(source: string, detay?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    fbq?: (...a: unknown[]) => void;
    gtag?: (...a: unknown[]) => void;
  };
  w.fbq?.("track", "Lead", { content_name: source, ...detay });
  w.gtag?.("event", "generate_lead", { method: source, ...detay });
}

/* ── taksit ── */
const TAKSIT_AY = 12;

export default function ProductClient({
  product,
  fabrics,
  groups,
}: {
  product: UrunDTO;
  fabrics: KumasDTO[];
  groups: KumasGrubuDTO[];
}) {
  const variants = product.variants ?? [];
  const [variantId, setVariantId] = useState(
    variants.find((v) => v.stock > 0)?.id ?? variants[0]?.id ?? ""
  );
  const [fabricCode, setFabricCode] = useState(fabrics[0]?.code ?? "");
  const [olcuAcik, setOlcuAcik] = useState(false);

  const variant = variants.find((v) => v.id === variantId);
  const fabric = fabrics.find((f) => f.code === fabricCode);

  /* fiyat = varyant fiyatı (yoksa ürün fiyatı) + kumaş farkı */
  const tabanFiyat = variant?.price ?? product.price;
  const kumasFarki = fabric?.priceDelta ?? 0;
  const toplam = tabanFiyat + kumasFarki;

  const stok = variant ? variant.stock : product.inStock ? 1 : 0;
  const teslimGun = (product.leadTimeDays ?? 21) + (fabric?.extraLeadDays ?? 0);

  const olculer = variant ?? product;
  /* Kaynaktaki ölçü metni — CRM ne yazdıysa o. Aksesuarlarda sayısal alan
     gelmiyor, ölçü yalnızca bu metinde oluyor ("10 × 27 см", "150 мл"). */
  const olcuMetni = product.dimensionsRaw;

  /* kumaşları grupla */
  const grupluKumaslar = useMemo(() => {
    return groups
      .map((g) => ({ grup: g, liste: fabrics.filter((f) => f.groupCode === g.code) }))
      .filter((x) => x.liste.length > 0);
  }, [groups, fabrics]);

  const [acikGrup, setAcikGrup] = useState(grupluKumaslar[0]?.grup.code ?? "");

  const siparisMesaji = encodeURIComponent(
    `Вітаю! Мене цікавить ${product.name}` +
      (variant ? ` (${variant.label})` : "") +
      (fabric ? `, тканина ${fabric.name}` : "") +
      `. Ціна: ${formatPrice(toplam)}. Чи є він у наявності?`
  );

  const ornekMesaji = encodeURIComponent(
    `Вітаю! Хочу замовити безкоштовні зразки тканини для ${product.name}.` +
      (fabric ? ` Цікавить ${fabric.name} (${fabric.code}).` : "")
  );

  return (
    <div className={styles.page}>
      {/* ── GÖRSEL ── */}
      <div className={styles.media}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 1000px) 55vw, 100vw"
          className={styles.mediaImg}
        />
      </div>

      <div className={styles.panel}>
        {/* ── BAŞLIK ── */}
        <nav className={styles.crumbs}>
          <Link href="/collections">Колекції</Link>
          <span>·</span>
          <Link href={`/collections/${product.collectionSlug}`}>{product.collection}</Link>
        </nav>

        <h1 className={styles.title}>{product.name}</h1>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(toplam)}</span>
          {kumasFarki > 0 && (
            <span className={styles.priceNote}>
              {formatPrice(tabanFiyat)} + {formatPrice(kumasFarki)} тканина
            </span>
          )}
        </div>

        <p className={styles.installment}>
          або <b>{formatPrice(Math.round(toplam / TAKSIT_AY))}</b> × {TAKSIT_AY} міс. без переплат
        </p>

        {/* ── ÖLÇÜLER ──
            Kaynakta ne yazıyorsa o. Genişlik/derinlik/yükseklik diye
            kutulara ayırmıyoruz: eksen bilgisi her üründe aynı anlama
            gelmiyor ve bölmek yorum katmak demek. */}
        {olcuMetni && (
          <section className={styles.olculer}>
            <h2 className={styles.olculerBaslik}>Розміри</h2>
            <p className={styles.olcuRaw}>
              <span className={styles.olcuRawV}>{olcuMetni}</span>
            </p>
          </section>
        )}

        {/* ── ÖLÇÜ SEÇİMİ ── */}
        {variants.length > 0 && (
          <section className={styles.block}>
            <div className={styles.blockHead}>
              <h2 className={styles.blockTitle}>Розмір</h2>
              {variant && <span className={styles.blockPick}>{variant.label}</span>}
            </div>
            <div className={styles.sizes}>
              {variants.map((v) => {
                const secili = v.id === variantId;
                const yok = v.stock === 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`${styles.size} ${secili ? styles.sizeOn : ""} ${yok ? styles.sizeOut : ""}`}
                  >
                    <span className={styles.sizeLabel}>{v.label}</span>
                    <span className={styles.sizePrice}>{formatPrice(v.price)}</span>
                    {yok && <span className={styles.sizeOutTag}>під замовлення</span>}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── KUMAŞ SEÇİMİ ── */}
        {grupluKumaslar.length > 0 && (
          <section className={styles.block}>
            <div className={styles.blockHead}>
              <h2 className={styles.blockTitle}>Тканина</h2>
              {fabric && (
                <span className={styles.blockPick}>
                  {fabric.name} · {fabric.code}
                </span>
              )}
            </div>

            <div className={styles.groupTabs}>
              {grupluKumaslar.map(({ grup }) => (
                <button
                  key={grup.code}
                  type="button"
                  onClick={() => setAcikGrup(grup.code)}
                  className={`${styles.groupTab} ${acikGrup === grup.code ? styles.groupTabOn : ""}`}
                >
                  {grup.name}
                </button>
              ))}
            </div>

            <div className={styles.swatches}>
              {grupluKumaslar
                .find((x) => x.grup.code === acikGrup)
                ?.liste.map((f) => {
                  const secili = f.code === fabricCode;
                  return (
                    <button
                      key={f.code}
                      type="button"
                      onClick={() => setFabricCode(f.code)}
                      className={`${styles.swatch} ${secili ? styles.swatchOn : ""}`}
                      title={`${f.name} · ${f.code}`}
                      aria-label={f.name}
                    >
                      <span
                        className={styles.swatchColor}
                        style={
                          f.swatchUrl
                            ? { backgroundImage: `url(${f.swatchUrl})` }
                            : { background: f.color }
                        }
                      >
                        {secili && <Check size={14} strokeWidth={2.5} />}
                      </span>
                      <span className={styles.swatchName}>{f.name}</span>
                      {f.priceDelta > 0 && (
                        <span className={styles.swatchDelta}>+{formatPrice(f.priceDelta)}</span>
                      )}
                      {!f.inStock && <span className={styles.swatchOut}>під замовлення</span>}
                    </button>
                  );
                })}
            </div>

            {fabric?.composition && (
              <p className={styles.fabricInfo}>{fabric.composition}</p>
            )}

            <div className={styles.sampleNote}>
              <p>
                Колір на екрані може відрізнятися від справжнього.
                Замовте безкоштовні зразки — надішлемо поштою.
              </p>
              <a
                href={`${WA_LINK}?text=${ornekMesaji}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sampleBtn}
                onClick={() => trackLead("fabric_sample", { product: product.slug })}
              >
                Замовити зразки
              </a>
            </div>
          </section>
        )}

        {/* ── DURUM ── */}
        <div className={styles.status}>
          <span className={stok > 0 ? styles.inStock : styles.preOrder}>
            {stok > 0 ? "В наявності" : "Під замовлення"}
          </span>
          <span className={styles.lead}>
            Доставка за {teslimGun}–{teslimGun + 7} днів
          </span>
        </div>

        {/* ── SATIN ALMA ── */}
        <div className={styles.buy}>
          <a
            href={`${WA_LINK}?text=${siparisMesaji}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.buyPrimary}
            onClick={() =>
              trackLead("product_order", {
                product: product.slug,
                variant: variantId,
                fabric: fabricCode,
                value: toplam,
              })
            }
          >
            <WhatsAppIcon size={18} />
            Замовити
          </a>
          <a
            href={`tel:${PHONE}`}
            className={styles.buySecondary}
            onClick={() => trackLead("product_call", { product: product.slug })}
          >
            Зателефонувати
          </a>
        </div>

        {/* ── ODAYA SIĞAR MI · yalnızca tavsiye ──
            Ölçünün kendisi yukarıda açıkta duruyor; burada ikincil
            bilgi var, kapalı başlaması sorun değil. */}
        {olculer.widthCm ? (
          <section className={styles.block}>
            <button
              type="button"
              className={styles.accordion}
              onClick={() => setOlcuAcik((v) => !v)}
              aria-expanded={olcuAcik}
            >
              <Ruler size={16} strokeWidth={1.6} />
              <span>Чи поміститься у вашій кімнаті?</span>
              <ChevronDown
                size={16}
                className={`${styles.chev} ${olcuAcik ? styles.chevOn : ""}`}
              />
            </button>

            {olcuAcik && (
              <div className={styles.olcuBody}>
                <p className={styles.olcuHint}>
                  Порада: залиште щонайменше <b>60 см</b> для проходу перед меблями.
                  Для цієї моделі знадобиться кімната шириною від{" "}
                  <b>{Math.round(olculer.widthCm + 120)} см</b>.
                </p>
                <p className={styles.olcuHint}>
                  Перевірте також ширину дверей та ліфта — при доставці це найчастіша
                  проблема. Наші майстри розберуть та зберуть меблі за потреби.
                </p>
              </div>
            )}
          </section>
        ) : null}

        {/* ── GÜVENCELER ── */}
        <ul className={styles.assure}>
          <li>
            <Truck size={16} strokeWidth={1.5} /> Безкоштовна доставка по Україні
          </li>
          <li>
            <Hammer size={16} strokeWidth={1.5} /> Збірка нашими майстрами — у подарунок
          </li>
          <li>
            <Shield size={16} strokeWidth={1.5} /> Офіційна гарантія 2 роки
          </li>
        </ul>

        {/* ── AÇIKLAMA ── */}
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Опис</h2>
          <p className={styles.desc}>{product.description}</p>
          <h3 className={styles.subTitle}>Матеріали</h3>
          <p className={styles.desc}>{product.materials}</p>
        </section>
      </div>

      {/* ── SABİT ALT BAR ── */}
      <div className={styles.stickyBar}>
        <div className={styles.stickyInfo}>
          <span className={styles.stickyPrice}>{formatPrice(toplam)}</span>
          <span className={styles.stickyMeta}>
            {variant?.label ?? product.collection}
            {fabric ? ` · ${fabric.name}` : ""}
          </span>
        </div>
        <a
          href={`${WA_LINK}?text=${siparisMesaji}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.stickyBtn}
          onClick={() =>
            trackLead("product_order_sticky", {
              product: product.slug,
              value: toplam,
            })
          }
        >
          <WhatsAppIcon size={16} />
          Замовити
        </a>
      </div>
    </div>
  );
}
