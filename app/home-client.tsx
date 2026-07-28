"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Truck,
  Shield,
  Hammer,
  CreditCard,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";
import styles from "./page.module.css";
import type { UrunDTO, KoleksiyonDTO } from "@/lib/db/types";
import { formatPrice } from "@/lib/catalog";
import type { DailyDeal } from "@/lib/daily-deals";
import { WhatsAppIcon } from "@/components/icons";
import {
  PHONE,
  PHONE_DISPLAY,
  WA_LINK,
  INSTAGRAM,
  STORES,
  CATEGORIES,
  REVIEWS,
} from "@/lib/site";

const MENU = [
  { href: "/collections", label: "Колекції" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "Про нас" },
  { href: "/faq", label: "Питання" },
  { href: "/contact", label: "Контакти" },
];

/* ─────────────────────────────  yardımcılar  ───────────────────────────── */

/** Meta Pixel / GA — dönüşüm sinyali (CRM entegrasyonuna hazır) */
function trackLead(source: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    fbq?: (...a: unknown[]) => void;
    gtag?: (...a: unknown[]) => void;
  };
  w.fbq?.("track", "Lead", { content_name: source });
  w.gtag?.("event", "generate_lead", { method: source });
}

/** Görünür olunca yumuşak fade-up */
function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      className={`${styles.reveal} ${shown ? styles.revealIn : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Gün sonuna kalan süre — kampanyanın aciliyeti */
function Countdown() {
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // İlk render sunucuyla aynı olsun diye null → tire
  return <span className={styles.dealClock}>{left ?? "—:—:—"}</span>;
}

function SectionHead({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className={styles.sectionHead}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {href && (
        <Link href={href} className={styles.sectionLink}>
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </Reveal>
  );
}

/* ─────────────────────────────  sayfa  ───────────────────────────── */

export default function HomeClient({
  deals,
  products,
  collections,
}: {
  deals: DailyDeal[];
  products: UrunDTO[];
  collections: KoleksiyonDTO[];
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featured = products.slice(0, 8);
  const activeCollections = collections.filter((c) => c.productCount > 0);

  return (
    <div className={styles.page}>
      {/* ── HEADER ── */}
      <header className={`${styles.header} ${scrolled ? styles.headerSolid : ""}`}>
        <Link href="/" className={styles.headerLogo} aria-label="GABBA — головна">
          <Image
            src="/images/logo/gabba-logo.png"
            alt="GABBA"
            width={108}
            height={26}
            priority
          />
        </Link>
        <nav className={styles.headerNav}>
          {MENU.map((m) => (
            <Link key={m.href} href={m.href}>
              {m.label}
            </Link>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <a
            href={`tel:${PHONE}`}
            className={styles.headerIcon}
            aria-label="Зателефонувати"
            onClick={() => trackLead("header_phone")}
          >
            <Phone size={19} strokeWidth={1.6} />
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.headerIcon}
            aria-label="WhatsApp"
            onClick={() => trackLead("header_whatsapp")}
          >
            <WhatsAppIcon size={19} />
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src="/images/categories/soft-furniture.jpg"
            alt="Інтер'єр вітальні з меблями GABBA"
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
          <div className={styles.heroScrim} />
        </div>

        <div className={styles.heroBody}>
          <p className={styles.heroEyebrow}>Gabba · Luxury Redefined</p>
          <h1 className={styles.heroTitle}>
            Меблі, заради яких
            <br />
            хочеться повертатися додому
          </h1>
          <p className={styles.heroText}>
            Преміальні колекції європейського рівня. Доставка та збірка —
            безкоштовно.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/collections" className={styles.btnPrimary}>
              Обрати меблі
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnGhost}
              onClick={() => trackLead("hero_whatsapp")}
            >
              <WhatsAppIcon size={17} />
              Консультація
            </a>
          </div>

          <div className={styles.heroProof}>
            <span className={styles.heroStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span>1200+ задоволених клієнтів · 3 шоуруми в Україні</span>
          </div>
        </div>
      </section>

      {/* ── ГАРАНТІЇ ── */}
      <div className={styles.trust}>
        {[
          { icon: <Truck size={17} strokeWidth={1.5} />, label: "Безкоштовна доставка" },
          { icon: <Hammer size={17} strokeWidth={1.5} />, label: "Збірка у подарунок" },
          { icon: <Shield size={17} strokeWidth={1.5} />, label: "Гарантія 2 роки" },
          { icon: <CreditCard size={17} strokeWidth={1.5} />, label: "Оплата частинами" },
        ].map((t) => (
          <div key={t.label} className={styles.trustItem}>
            <span className={styles.trustIcon}>{t.icon}</span>
            {t.label}
          </div>
        ))}
      </div>

      {/* ── ПРОПОЗИЦІЯ ДНЯ ── */}
      {deals.length > 0 && (
        <section className={styles.deals}>
          <Reveal className={styles.dealsHead}>
            <div>
              <p className={styles.dealsEyebrow}>Тільки сьогодні · онлайн</p>
              <h2 className={styles.dealsTitle}>Пропозиція дня</h2>
            </div>
            <div className={styles.dealsTimer}>
              <span className={styles.dealsTimerLabel}>Закінчується через</span>
              <Countdown />
            </div>
          </Reveal>

          <div className={styles.rail}>
            {deals.map((d) => (
              <Link key={d.slug} href={`/products/${d.slug}`} className={styles.dealCard}>
                <div className={styles.dealMedia}>
                  <span className={styles.dealBadge}>−{d.discount}%</span>
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(min-width: 900px) 30vw, 76vw"
                    className={styles.dealImg}
                  />
                </div>
                <div className={styles.dealInfo}>
                  <p className={styles.cardCollection}>{d.collection}</p>
                  <h3 className={styles.cardName}>{d.name}</h3>
                  <div className={styles.dealPrices}>
                    <span className={styles.dealNew}>{formatPrice(d.discountedPrice)}</span>
                    <span className={styles.dealOld}>{formatPrice(d.originalPrice)}</span>
                  </div>
                  <span className={styles.cardCta}>
                    Замовити <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── КАТЕГОРІЇ ── */}
      <SectionHead eyebrow="Асортимент" title="Категорії" />
      <div className={styles.catGrid}>
        {CATEGORIES.map((c, i) => (
          <Reveal
            key={c.img}
            delay={i * 60}
            className={`${styles.catCard} ${i === CATEGORIES.length - 1 ? styles.catWide : ""}`}
          >
            <Link href="/collections" className={styles.catLink}>
              <Image
                src={`/images/categories/${c.img}.jpg`}
                alt={c.name}
                fill
                sizes="(min-width: 900px) 33vw, 50vw"
                className={styles.catImg}
              />
              <span className={styles.catScrim} />
              <span className={styles.catName}>{c.name}</span>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* ── РЕКОМЕНДУЄМО ── */}
      <SectionHead
        eyebrow="Бестселери"
        title="Обране цього сезону"
        href="/collections"
        linkLabel="Усі товари"
      />
      <div className={styles.rail}>
        {featured.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className={styles.prodCard}>
            <div className={styles.prodMedia}>
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width: 900px) 28vw, 62vw"
                className={styles.prodImg}
              />
            </div>
            <div className={styles.prodInfo}>
              <p className={styles.cardCollection}>{p.collection}</p>
              <h3 className={styles.cardName}>{p.name}</h3>
              <div className={styles.prodBottom}>
                <span className={styles.prodPrice}>{formatPrice(p.price)}</span>
                {p.inStock && <span className={styles.prodStock}>В наявності</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── ЕДИТОРІАЛ ── */}
      <Reveal as="section" className={styles.editorial}>
        <div className={styles.editorialMedia}>
          <Image
            src="/images/categories/case-furniture.jpg"
            alt="Корпусні меблі GABBA — натуральний шпон та фурнітура преміум-класу"
            fill
            sizes="100vw"
            className={styles.editorialImg}
          />
        </div>
        <div className={styles.editorialBody}>
          <p className={styles.eyebrow}>Про бренд</p>
          <h2 className={styles.editorialTitle}>
            Італійський дизайн, українське виробництво
          </h2>
          <p className={styles.editorialText}>
            Ми працюємо з тими самими матеріалами, що й європейські мануфактури:
            масив бука та дуба, італійські тканини, високоеластичний наповнювач.
            Різниця лише в ціні — бо між нами та вами немає посередників.
          </p>
          <div className={styles.editorialStats}>
            <div>
              <span className={styles.statNum}>6</span>
              <span className={styles.statLabel}>років на ринку</span>
            </div>
            <div>
              <span className={styles.statNum}>8</span>
              <span className={styles.statLabel}>колекцій</span>
            </div>
            <div>
              <span className={styles.statNum}>1200+</span>
              <span className={styles.statLabel}>клієнтів</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── КОЛЕКЦІЇ ── */}
      <SectionHead
        eyebrow="Цілісні інтер'єри"
        title="Наші колекції"
        href="/collections"
        linkLabel="Усі колекції"
      />
      <div className={`${styles.rail} ${styles.railTrio}`}>
        {activeCollections.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className={styles.collCard}>
            <div className={styles.collMedia}>
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(min-width: 900px) 32vw, 72vw"
                className={styles.collImg}
              />
            </div>
            <div className={styles.collInfo}>
              <p className={styles.cardCollection}>
                {c.brand === "gabba" ? "Gabba" : "Monett"}
              </p>
              <h3 className={styles.collName}>{c.name}</h3>
              <p className={styles.collDesc}>{c.description}</p>
              <span className={styles.cardCta}>
                Дивитися <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── ВІДГУКИ ── */}
      <SectionHead eyebrow="Довіра" title="Що кажуть клієнти" />
      <div className={`${styles.rail} ${styles.railTrio}`}>
        {REVIEWS.map((r) => (
          <figure key={r.author} className={styles.reviewCard}>
            <div className={styles.reviewStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className={styles.reviewText}>«{r.text}»</blockquote>
            <figcaption className={styles.reviewMeta}>
              <span className={styles.reviewAuthor}>{r.author}</span>
              <span className={styles.reviewCity}>
                {r.city} · {r.product}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* ── ШОУРУМИ ── */}
      <SectionHead eyebrow="Завітайте" title="Наші шоуруми" />
      <div className={styles.stores}>
        {STORES.map((s, i) => (
          <Reveal key={s.city} delay={i * 60} className={styles.storeItem}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `GABBA ${s.address} ${s.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeCard}
              onClick={() => trackLead(`store_map_${s.city}`)}
            >
              <span className={styles.storeIcon}>
                <MapPin size={17} strokeWidth={1.5} />
              </span>
              <span className={styles.storeText}>
                <span className={styles.storeCity}>{s.city}</span>
                <span className={styles.storeAddr}>{s.address}</span>
              </span>
              <span className={styles.storeRoute}>
                Маршрут <ArrowRight size={13} />
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      {/* ── ФІНАЛЬНИЙ CTA ── */}
      <section className={styles.finalCta}>
        <Reveal>
          <p className={styles.finalEyebrow}>Безкоштовно</p>
          <h2 className={styles.finalTitle}>Підберемо меблі під ваш інтер'єр</h2>
          <p className={styles.finalText}>
            Надішліть фото кімнати — дизайнер запропонує рішення та прорахує
            вартість протягом дня.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
            onClick={() => trackLead("final_whatsapp")}
          >
            <WhatsAppIcon size={18} />
            Написати в WhatsApp
          </a>
          <a
            href={`tel:${PHONE}`}
            className={styles.finalPhone}
            onClick={() => trackLead("final_phone")}
          >
            {PHONE_DISPLAY}
          </a>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <Image
          src="/images/logo/gabba-logo.png"
          alt="GABBA"
          width={92}
          height={22}
          className={styles.footerLogo}
        />
        <nav className={styles.footerNav}>
          <Link href="/collections">Колекції</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/about">Про нас</Link>
          <Link href="/faq">Питання</Link>
          <Link href="/contact">Контакти</Link>
        </nav>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={styles.footerIg}>
          Instagram @gabba.home
        </a>
        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} GABBA Ukraine · www.gabbaukraine.com
        </p>
      </footer>

      {/* ── МОБІЛЬНА ПАНЕЛЬ ── */}
      <div className={styles.stickyBar}>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.stickyPrimary}
          onClick={() => trackLead("sticky_whatsapp")}
        >
          <WhatsAppIcon size={17} />
          Написати нам
        </a>
        <a
          href={`tel:${PHONE}`}
          className={styles.stickySecondary}
          aria-label="Зателефонувати"
          onClick={() => trackLead("sticky_phone")}
        >
          <Phone size={18} strokeWidth={1.6} />
        </a>
      </div>
    </div>
  );
}
