import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Shield, Truck, Hammer } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { SiteHeader, SiteFooter, SiteBar } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/icons";
import { WA_LINK, STORES } from "@/lib/site";
import styles from "../icerik.module.css";

const SITE = "https://www.gabbaukraine.com";

export const metadata: Metadata = {
  title: "Про GABBA — український бренд преміальних меблів",
  description:
    "Італійський дизайн, українське виробництво. Три шоуруми, понад 1200 клієнтів, офіційна гарантія 2 роки.",
  alternates: { canonical: `${SITE}/about` },
  openGraph: {
    title: "Про GABBA",
    description: "Італійський дизайн, українське виробництво.",
    url: `${SITE}/about`,
  },
};

export default function HakkimizdaSayfasi() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: SITE },
          { name: "Про нас", url: `${SITE}/about` },
        ]}
      />

      <SiteHeader />

      <div className={styles.page}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Про бренд</p>
          <h1 className={styles.title}>Італійський дизайн, українське виробництво</h1>
          <p className={styles.lede}>
            GABBA — український бренд меблів преміум-класу. Ми робимо меблі, які
            служать десятиліттями й залишаються красивими весь цей час.
          </p>
        </header>

        <div className={styles.stats}>
          <div>
            <span className={styles.statN}>6</span>
            <span className={styles.statL}>років на ринку</span>
          </div>
          <div>
            <span className={styles.statN}>8</span>
            <span className={styles.statL}>колекцій</span>
          </div>
          <div>
            <span className={styles.statN}>1200+</span>
            <span className={styles.statL}>клієнтів</span>
          </div>
        </div>

        <div className={styles.body}>
          <h2>Ті самі матеріали, інша ціна</h2>
          <p>
            Ми працюємо з тими самими матеріалами, що й європейські мануфактури:
            масив бука та дуба, італійські тканини, високоеластичний наповнювач,
            фурнітура з м&apos;яким закриванням. Різниця лише в ціні — бо між
            виробництвом і вами немає посередників.
          </p>

          <h2>Чому меблі служать довго</h2>
          <p>
            Довговічність меблів вирішується там, де її не видно: у каркасі,
            з&apos;єднаннях і наповнювачі. Ми не економимо на цих трьох речах.
          </p>
          <ul>
            <li>
              <strong>Каркас</strong> — масив бука або дуба, а не ДСП. Витримує
              десятиліття щоденного використання.
            </li>
            <li>
              <strong>Наповнювач</strong> — високоеластичний ППУ з пружинним
              блоком. Не провалюється через два роки.
            </li>
            <li>
              <strong>Оббивка</strong> — тканини з показником зносостійкості від
              45 000 циклів Мартиндейл.
            </li>
          </ul>

          <div className={styles.pull}>
            <p>
              <strong>Кожен виріб проходить перевірку перед відправкою.</strong>{" "}
              Якщо щось не відповідає нашим стандартам — воно не потрапляє до
              клієнта. Це дорожче для нас, але дешевше для вашої довіри.
            </p>
          </div>

          <h2>Як ми працюємо</h2>
          <p>
            Ви можете замовити меблі онлайн або завітати до шоуруму й побачити
            їх наживо. Доставляємо по всій Україні безкоштовно, збираємо власними
            майстрами. Якщо потрібні індивідуальні розміри — виготовимо.
          </p>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Truck size={18} strokeWidth={1.5} />
            </span>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>Безкоштовна доставка</span>
              <span className={styles.cardText}>
                По всій Україні, до дверей.
              </span>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Hammer size={18} strokeWidth={1.5} />
            </span>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>Збірка у подарунок</span>
              <span className={styles.cardText}>
                Наші майстри зберуть і встановлять.
              </span>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Shield size={18} strokeWidth={1.5} />
            </span>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>Гарантія 2 роки</span>
              <span className={styles.cardText}>
                Офіційна, на каркас, механізми та оббивку.
              </span>
            </div>
          </div>
        </div>

        <div className={styles.head} style={{ borderBottom: "none", marginBottom: 0 }}>
          <h2 className={styles.title} style={{ fontSize: "clamp(22px, 6vw, 30px)" }}>
            Наші шоуруми
          </h2>
        </div>

        <div className={styles.cards}>
          {STORES.map((s) => (
            <a
              key={s.city}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `GABBA ${s.address} ${s.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <span className={styles.cardIcon}>
                <MapPin size={18} strokeWidth={1.5} />
              </span>
              <div className={styles.cardBody}>
                <span className={styles.cardTitle}>{s.city}</span>
                <span className={styles.cardText}>{s.address}</span>
                <span className={styles.cardLink}>Маршрут →</span>
              </div>
            </a>
          ))}
        </div>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Підберемо меблі під ваш інтер&apos;єр</h2>
          <p className={styles.ctaText}>
            Надішліть фото кімнати — дизайнер запропонує рішення та прорахує
            вартість.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <WhatsAppIcon size={18} />
            Написати в WhatsApp
          </a>
        </section>
      </div>

      <SiteFooter />
      <SiteBar />
    </>
  );
}
