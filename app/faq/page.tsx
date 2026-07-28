import type { Metadata } from "next";
import { FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { SiteHeader, SiteFooter, SiteBar } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/icons";
import { WA_LINK } from "@/lib/site";
import styles from "../icerik.module.css";

const SITE = "https://www.gabbaukraine.com";

export const metadata: Metadata = {
  title: "Часті запитання | GABBA",
  description:
    "Доставка, гарантія, оплата, матеріали та терміни виготовлення — відповіді на найпоширеніші запитання про меблі GABBA.",
  alternates: { canonical: `${SITE}/faq` },
  openGraph: {
    title: "Часті запитання | GABBA",
    description: "Все, що потрібно знати перед покупкою меблів GABBA.",
    url: `${SITE}/faq`,
  },
};

const faqItems = [
  {
    question: "Яка вартість доставки меблів GABBA?",
    answer:
      "Доставка по всій Україні безкоштовна. Ми здійснюємо доставку до дверей з професійною збіркою та встановленням, які також включені у вартість.",
  },
  {
    question: "Яка гарантія на меблі GABBA?",
    answer:
      "На всі вироби GABBA надається офіційна гарантія 2 роки. Гарантія покриває виробничі дефекти каркасу, механізмів та оббивки. Кожному клієнту призначається персональний менеджер.",
  },
  {
    question: "Які матеріали використовує GABBA?",
    answer:
      "Ми використовуємо лише преміальні матеріали: натуральне дерево (бук, дуб), італійську шкіру, тканини від провідних європейських постачальників. Наповнювачі — високоеластичний пінополіуретан та пружинні блоки.",
  },
  {
    question: "Які способи оплати доступні?",
    answer:
      "Ми приймаємо оплату карткою (Visa, Mastercard), Apple Pay, Google Pay, банківський переказ та готівку у шоурумі. Також доступна розстрочка від банків-партнерів.",
  },
  {
    question: "Чи можна подивитися меблі наживо перед покупкою?",
    answer:
      "Так! Ми маємо шоуруми у трьох містах: Київ (ТЦ 4ROOM, 1 поверх), Львів (ТЦ TRY SLONY, 2 поверх), Одеса (ТЦ MEGADOM, 2 поверх). Працюємо щодня з 10:00 до 20:00.",
  },
  {
    question: "Скільки часу займає доставка?",
    answer:
      "Товари, що є на складі, доставляються протягом 3–7 робочих днів. Вироби під замовлення — від 4 до 8 тижнів залежно від колекції та складності виробу.",
  },
  {
    question: "Чи можна замовити меблі за індивідуальними розмірами?",
    answer:
      "Так, ми пропонуємо виготовлення за індивідуальними розмірами для більшості позицій з наших колекцій. Зв'яжіться з нашим менеджером для уточнення деталей.",
  },
  {
    question: "Які колекції є у GABBA?",
    answer:
      "На даний момент у нас є 5 основних колекцій: Madrid (класична елегантність), Luna (м'які форми), Montana (натуральне дерево), Leora (витончена розкіш), Moka (теплі тони). Колекції представлені від брендів Gabba та Monett.",
  },
  {
    question: "Чи є знижки для дизайнерів та архітекторів?",
    answer:
      "Так, ми пропонуємо спеціальні умови для дизайнерів інтер'єрів, архітекторів та студій. Зв'яжіться з нами для отримання персональної пропозиції.",
  },
  {
    question: "Як зв'язатися з GABBA?",
    answer:
      "Телефон: +38 099 004 22 22. Доступні WhatsApp, Viber, Telegram. Онлайн-консультації щодня з 09:00 до 21:00. Або завітайте до одного з наших шоурумів.",
  },
];

export default function FaqSayfasi() {
  return (
    <>
      <FAQJsonLd questions={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: SITE },
          { name: "Питання", url: `${SITE}/faq` },
        ]}
      />

      <SiteHeader />

      <div className={styles.page}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Питання та відповіді</p>
          <h1 className={styles.title}>Що варто знати перед покупкою</h1>
          <p className={styles.lede}>
            Найчастіші запитання про доставку, гарантію, матеріали та терміни.
            Не знайшли відповідь — напишіть нам, відповімо особисто.
          </p>
        </header>

        <div className={styles.faq}>
          {faqItems.map((f) => (
            <details key={f.question} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.question}</summary>
              <p className={styles.faqA}>{f.answer}</p>
            </details>
          ))}
        </div>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Залишилося питання?</h2>
          <p className={styles.ctaText}>
            Напишіть нам у WhatsApp — відповідаємо щодня з 09:00 до 21:00.
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
