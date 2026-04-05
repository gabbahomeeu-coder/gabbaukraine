"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import {
  Phone,
  Search,
  ShoppingBag,
  Shield,
  Truck,
  Globe,
  CreditCard,
  MapPin,
  Flag,
  MessageCircle,
} from "lucide-react";

/* ── data ── */
const collections = [
  { slug: "madrid", name: "Madrid", brand: "gabba", desc: "Класична елегантність у кремових тонах. Дивани, столи, консолі." },
  { slug: "luna", name: "Luna", brand: "monett", desc: "Плавні силуети та ніжна палітра для затишної атмосфери." },
  { slug: "montana", name: "Montana", brand: "gabba", desc: "Натуральне дерево та масивні форми для інтер'єрів з характером." },
  { slug: "leora", name: "Leora", brand: "gabba", desc: "Витончена розкіш. Гармонія форми та функції." },
  { slug: "moka", name: "Moka", brand: "monett", desc: "Теплі тони та органічні форми для стильного простору." },
];

const products = [
  { img: "milano-armchair", name: "Крісло Milano", badge: "Milano", price: "₴50 791", cat: "chair", layout: "vertical" },
  { img: "montana-armchair", name: "Крісло Montana Lux", badge: "Montana", price: "₴44 977", cat: "chair", layout: "vertical" },
  { img: "madrid-sofa", name: "Диван Madrid", badge: "Madrid", price: "₴101 582", cat: "sofa", layout: "horizontal" },
  { img: "genova-chair", name: "Стілець Genova", badge: "Montana", price: "₴18 143", cat: "chair", layout: "vertical" },
  { img: "luna-armchair", name: "Крісло Luna", badge: "Luna", price: "₴43 444", cat: "chair", layout: "vertical" },
  { img: "lyon-tv-unit", name: "TV Юніт Lyon", badge: "Lyon", price: "₴75 707", cat: "case", layout: "horizontal" },
  { img: "madrid-console", name: "Консоль Madrid", badge: "Madrid", price: "₴102 860", cat: "case", layout: "horizontal" },
  { img: "milano-sofa", name: "Диван Milano", badge: "Milano", price: "₴115 597", cat: "sofa", layout: "horizontal" },
  { img: "madrid-table", name: "Стіл Madrid", badge: "Madrid", price: "₴69 318", cat: "table", layout: "horizontal" },
];

const newArrivals = [
  { img: "luna-armchair", name: "Крісло Luna", price: "₴43 444", layout: "vertical" },
  { img: "terra-dresser", name: "Комод Terra", price: "₴80 179", layout: "vertical" },
  { img: "galante-bed", name: "Ліжко Galante", price: "₴147 941", layout: "horizontal" },
  { img: "terra-table", name: "Стіл Terra", price: "₴103 499", layout: "horizontal" },
];

const reviews = [
  { text: "«Замовляли диван Madrid — якість неймовірна. Тканина приємна на дотик, каркас міцний. Доставка та збірка були бездоганними.»", author: "Олена Коваленко", city: "Київ" },
  { text: "«Обрали крісло Montana Lux для вітальні. Виглядає розкішно, сидіти дуже зручно. Рекомендую Gabba всім друзям.»", author: "Андрій Мельник", city: "Львів" },
  { text: "«Повністю обставили квартиру меблями Gabba. Від консультації до збірки — все на найвищому рівні. Дякуємо команді!»", author: "Марина Шевченко", city: "Одеса" },
];

const categories = [
  { img: "soft-furniture", name: "М'які меблі" },
  { img: "tables", name: "Столи" },
  { img: "chairs", name: "Стільці" },
  { img: "case-furniture", name: "Корпусні меблі" },
  { img: "bedroom", name: "Спальня", full: true },
];

const stores = [
  { city: "Київ", address: "ТЦ 4ROOM, 1 поверх" },
  { city: "Львів", address: "ТЦ TRY SLONY, 2 поверх" },
  { city: "Одеса", address: "ТЦ MEGADOM, 2 поверх" },
];

const WA_LINK = "https://wa.me/380990042222";
const PHONE = "+380990042222";

/* ── WhatsApp SVG ── */
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  );
}

/* ── useReveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, className: `${styles.reveal} ${visible ? styles.revealVisible : ""}` };
}

/* ── Reveal wrapper ── */
function Reveal({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const r = useReveal();
  return <div ref={r.ref} className={`${r.className} ${className}`} style={style}>{children}</div>;
}

/* ── Counter ── */
function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("0");
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const duration = 1800;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 4);
          setValue(Math.floor(ease * target) + (target >= 100 ? "+" : "+"));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <div ref={ref} className={styles.brandStatNum}>{value}</div>;
}

/* ── PAGE ── */
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [brandFilter, setBrandFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const collScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBrandFilter = useCallback((brand: string) => {
    setBrandFilter(brand);
    collScrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, []);

  const filteredCollections = brandFilter === "all"
    ? collections
    : collections.filter((c) => c.brand === brandFilter);

  const filteredProducts = catFilter === "all"
    ? products
    : products.filter((p) => p.cat === catFilter);

  return (
    <>
      {/* LOADER */}
      <div className={`${styles.loader} ${loaded ? styles.loaderDone : ""}`}>
        <Image src="/images/logo/gabba-logo.png" alt="GABBA" width={200} height={96} className={styles.loaderLogo} priority />
        <div className={styles.loaderLine} />
      </div>

      {/* HEADER */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <Image src="/images/logo/gabba-logo.png" alt="GABBA" width={100} height={24} className={styles.headerLogo} priority />
        <div className={styles.headerRight}>
          <a href={`tel:${PHONE}`} className={styles.headerIcon} aria-label="Зателефонувати"><Phone size={20} /></a>
          <a href={WA_LINK} className={styles.headerIcon} aria-label="WhatsApp"><WhatsAppIcon size={20} /></a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <Image src="/images/hero/hero-main.jpg" alt="GABBA інтер'єр" fill className={styles.heroImage} priority style={{ position: "relative", height: "70vh" }} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroCard}>
          <p className={styles.heroTagline}>Luxury Redefined</p>
          <h1 className={styles.heroTitle}>Дизайнерські меблі для вашого дому</h1>
          <p className={styles.heroDesc}>Преміальні колекції європейського рівня. Створено для тих, хто цінує бездоганну якість та сучасний дизайн.</p>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustDark}>
        <div className={styles.trustItem}><Truck size={16} color="var(--gold)" /> Безкоштовна доставка</div>
        <div className={styles.trustItem}><Shield size={16} color="var(--gold)" /> Гарантія 2 роки</div>
        <div className={styles.trustItem}><Globe size={16} color="var(--gold)" /> Європейська якість</div>
        <div className={styles.trustItem}><CreditCard size={16} color="var(--gold)" /> Apple Pay · Google Pay</div>
      </div>

      {/* CATEGORIES */}
      <Reveal className={styles.section}><div className={styles.sectionTitle}>Категорії</div></Reveal>
      <Reveal className={styles.catGrid}>
        {categories.map((cat) => (
          <div key={cat.img} className={`${styles.catCard} ${cat.full ? styles.catFull : ""}`}>
            <img src={`/images/categories/${cat.img}.jpg`} alt={cat.name} className={styles.catImage} loading="lazy" />
            <div className={styles.catOverlay}>{cat.name}</div>
          </div>
        ))}
      </Reveal>

      {/* COLLECTIONS */}
      <Reveal className={styles.section}>
        <div className={styles.collHeader}>
          <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Колекції</div>
          <div className={styles.collFilters}>
            {["all", "gabba", "monett", "isil"].map((b) => (
              <button
                key={b}
                className={`${styles.collFilter} ${brandFilter === b ? styles.collFilterActive : ""} ${b === "isil" ? styles.collFilterSoon : ""}`}
                onClick={() => handleBrandFilter(b)}
              >
                {b === "all" ? "Всі" : b.charAt(0).toUpperCase() + b.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Reveal>
      {brandFilter === "isil" ? (
        <div className={styles.collEmpty}>Колекція Isil — скоро у продажу</div>
      ) : (
        <div className={styles.collScroll} ref={collScrollRef}>
          {filteredCollections.map((col) => (
            <article key={col.slug} className={styles.collCard}>
              <img src={`/images/collections/${col.slug}.jpg`} alt={col.name} className={styles.collCardImage} loading="lazy" />
              <div className={styles.collInfo}>
                <p className={styles.collLabel}>{col.brand === "gabba" ? "Gabba" : "Monett"}</p>
                <div className={styles.collName}>{col.name}</div>
                <div className={styles.collDesc}>{col.desc}</div>
                <a href="#" className={styles.collLink}>Дивитися →</a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      <Reveal className={styles.section}><div className={styles.sectionTitle}>Рекомендуємо</div></Reveal>
      <div className={styles.filterRow}>
        {[["all", "Всі"], ["sofa", "Дивани"], ["chair", "Крісла"], ["table", "Столи"], ["case", "Корпусні"]].map(([val, label]) => (
          <button
            key={val}
            className={`${styles.filterPill} ${catFilter === val ? styles.filterPillActive : ""}`}
            onClick={() => setCatFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>
      <Reveal className={styles.masonry}>
        {filteredProducts.map((p) => (
          <a
            key={p.img}
            href="#"
            className={`${styles.mCard} ${p.layout === "vertical" ? styles.mCardVertical : styles.mCardHorizontal}`}
            style={{ display: "block" }}
          >
            <img src={`/images/products/${p.img}.jpg`} alt={p.name} className={styles.mCardImage} loading="lazy" />
            <div className={styles.mInfo}>
              <span className={styles.mBadge}>{p.badge}</span>
              <span className={styles.mStock}>В наявності</span>
              <div className={styles.mName}>{p.name}</div>
              <div className={styles.mPrice}>{p.price}</div>
            </div>
          </a>
        ))}
      </Reveal>

      {/* NEW ARRIVALS */}
      <Reveal className={styles.section} style={{ marginTop: 32 }}><div className={styles.sectionTitle}>Новинки</div></Reveal>
      <Reveal className={styles.masonry}>
        {newArrivals.map((p) => (
          <div
            key={p.img}
            className={`${styles.mCard} ${p.layout === "vertical" ? styles.mCardVertical : styles.mCardHorizontal}`}
          >
            <img src={`/images/products/${p.img}.jpg`} alt={p.name} className={styles.mCardImage} loading="lazy" />
            <div className={styles.mInfo}>
              <span className={styles.newBadge}>Новинка</span>
              <div className={styles.mName}>{p.name}</div>
              <div className={styles.mPrice}>{p.price}</div>
            </div>
          </div>
        ))}
      </Reveal>

      {/* REVIEWS */}
      <Reveal className={styles.section}><div className={styles.sectionTitle}>Відгуки клієнтів</div></Reveal>
      <div className={styles.reviewsScroll}>
        {reviews.map((r) => (
          <div key={r.author} className={styles.reviewCard}>
            <div className={styles.reviewStars}>★★★★★</div>
            <p className={styles.reviewText}>{r.text}</p>
            <div className={styles.reviewAuthor}>{r.author}</div>
            <div className={styles.reviewCity}>{r.city}</div>
          </div>
        ))}
      </div>

      {/* BRAND STORY */}
      <Reveal>
        <section className={styles.brandDark} style={{ marginTop: 32 }}>
          <div className={styles.brandDarkBg}>
            <img src="/images/hero/lifestyle-2.jpg" alt="" className={styles.brandDarkBgImg} loading="lazy" />
          </div>
          <div className={styles.brandContent}>
            <Image src="/images/logo/gabba-logo.png" alt="GABBA" width={120} height={32} className={styles.brandLogo} />
            <div className={styles.brandTagline}>Luxury Redefined</div>
            <p className={styles.brandText}>GABBA — український бренд дизайнерських меблів преміум-класу. Поєднуємо європейський дизайн з бездоганною якістю виконання.</p>
            <div className={styles.brandStats}>
              <div><Counter target={6} /><div className={styles.brandStatLabel}>Років</div></div>
              <div><Counter target={8} /><div className={styles.brandStatLabel}>Колекцій</div></div>
              <div><Counter target={1200} /><div className={styles.brandStatLabel}>Клієнтів</div></div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ASSURANCE */}
      <Reveal className={styles.section}><div className={styles.sectionTitle}>Ваша впевненість</div></Reveal>
      <div className={styles.assurance}>
        {[
          { icon: <Shield size={18} />, title: "Гарантія якості", text: "Офіційна гарантія 2 роки. Преміальні матеріали та бездоганне виконання." },
          { icon: <Truck size={18} />, title: "Доставка та збірка", text: "Безкоштовна доставка по Україні. Професійна збірка нашими майстрами." },
          { icon: <CreditCard size={18} />, title: "Зручна оплата", text: "Visa, Mastercard, Apple Pay, Google Pay. Розстрочка від банків-партнерів." },
        ].map((a) => (
          <Reveal key={a.title} className={styles.assureCard}>
            <div className={styles.assureIcon}>{a.icon}</div>
            <div>
              <div className={styles.assureTitle}>{a.title}</div>
              <div className={styles.assureText}>{a.text}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* STORES */}
      <Reveal className={styles.section}><div className={styles.sectionTitle}>Наші шоуруми</div></Reveal>
      <div className={styles.stores}>
        {stores.map((s) => (
          <Reveal key={s.city} className={styles.storeCard}>
            <div className={styles.storePin}><MapPin size={18} /></div>
            <div>
              <div className={styles.storeCity}>{s.city}</div>
              <div className={styles.storeAddress}>{s.address}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* FINAL CTA */}
      <div className={styles.finalDark}>
        <Reveal>
          <div className={styles.finalTitle}>Створіть простір вашої мрії</div>
          <div className={styles.finalDesc}>Безкоштовна консультація з дизайнером</div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
            <WhatsAppIcon size={18} />
            Написати в WhatsApp
          </a>
        </Reveal>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <Image src="/images/logo/gabba-logo.png" alt="GABBA" width={80} height={20} className={styles.footerLogo} />
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Колекції</a>
          <a href="#" className={styles.footerLink}>Магазини</a>
          <a href="#" className={styles.footerLink}>Контакти</a>
        </div>
        <div className={styles.footerCopy}>© 2024 GABBA Ukraine · www.gabbaukraine.com</div>
        <a href={`tel:${PHONE}`} className={styles.footerPhone}>+38 099 004 22 22</a>
      </footer>

      {/* STICKY BAR */}
      <div className={styles.stickyBar}>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={`${styles.stickyBtn} ${styles.stickyPrimary}`}>
          <WhatsAppIcon size={16} />
          Написати нам
        </a>
        <a href={`tel:${PHONE}`} className={`${styles.stickyBtn} ${styles.stickySecondary}`}>
          <Phone size={16} />
          Зателефонувати
        </a>
      </div>
    </>
  );
}
