import type { Metadata } from "next";
import { Phone, MapPin, Clock, Mail } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { SiteHeader, SiteFooter, SiteBar } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/icons";
import { WA_LINK, PHONE, PHONE_DISPLAY, STORES } from "@/lib/site";
import styles from "../icerik.module.css";

const SITE = "https://www.gabbaukraine.com";

export const metadata: Metadata = {
  title: "Контакти | GABBA",
  description:
    "Зв'яжіться з GABBA: телефон, WhatsApp, шоуруми в Києві, Львові та Одесі. Консультації щодня з 09:00 до 21:00.",
  alternates: { canonical: `${SITE}/contact` },
  openGraph: {
    title: "Контакти GABBA",
    description: "Телефон, WhatsApp та адреси шоурумів.",
    url: `${SITE}/contact`,
  },
};

export default function IletisimSayfasi() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: SITE },
          { name: "Контакти", url: `${SITE}/contact` },
        ]}
      />

      <SiteHeader />

      <div className={styles.page}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Контакти</p>
          <h1 className={styles.title}>Ми поруч — просто напишіть</h1>
          <p className={styles.lede}>
            Допоможемо обрати меблі, прорахуємо вартість і відповімо на будь-яке
            питання. Онлайн-консультації щодня з 09:00 до 21:00.
          </p>
        </header>

        <div className={styles.cards}>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={styles.card}>
            <span className={styles.cardIcon}>
              <WhatsAppIcon size={18} />
            </span>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>WhatsApp</span>
              <span className={styles.cardText}>
                Найшвидший спосіб — відповідаємо протягом кількох хвилин.
              </span>
              <span className={styles.cardLink}>Написати →</span>
            </div>
          </a>

          <a href={`tel:${PHONE}`} className={styles.card}>
            <span className={styles.cardIcon}>
              <Phone size={18} strokeWidth={1.5} />
            </span>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>Телефон</span>
              <span className={styles.cardText}>{PHONE_DISPLAY}</span>
              <span className={styles.cardLink}>Зателефонувати →</span>
            </div>
          </a>

          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Clock size={18} strokeWidth={1.5} />
            </span>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>Години роботи</span>
              <span className={styles.cardText}>
                Шоуруми: щодня 10:00 – 20:00
                <br />
                Онлайн: щодня 09:00 – 21:00
              </span>
            </div>
          </div>
        </div>

        <div className={styles.head} style={{ borderBottom: "none", marginBottom: 0 }}>
          <h2 className={styles.title} style={{ fontSize: "clamp(22px, 6vw, 30px)" }}>
            Завітайте до шоуруму
          </h2>
          <p className={styles.lede}>
            Меблі краще один раз побачити: подивитися тканини, сісти, відчути
            матеріал.
          </p>
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

        <div className={styles.body}>
          <h2>Співпраця</h2>
          <p>
            Ми пропонуємо спеціальні умови для дизайнерів інтер&apos;єрів,
            архітекторів і студій. Напишіть нам — обговоримо деталі та надішлемо
            каталог з цінами.
          </p>
          <p>
            <Mail size={15} strokeWidth={1.6} style={{ verticalAlign: "-2px" }} />{" "}
            gabbahome.eu@gmail.com
          </p>
        </div>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Готові допомогти з вибором</h2>
          <p className={styles.ctaText}>
            Розкажіть про свій простір — запропонуємо рішення протягом дня.
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
