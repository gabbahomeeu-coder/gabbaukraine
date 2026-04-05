import type { Metadata } from "next";
import { FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "FAQ — Часті запитання про меблі GABBA",
  description:
    "Відповіді на найпопулярніші запитання про дизайнерські меблі GABBA: доставка, гарантія, оплата, матеріали, терміни виготовлення.",
  openGraph: {
    title: "FAQ — Часті запитання | GABBA",
    description: "Все, що потрібно знати перед покупкою меблів GABBA.",
    url: "https://www.gabbaukraine.com/faq",
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

export default function FAQPage() {
  return (
    <>
      <FAQJsonLd questions={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: "https://www.gabbaukraine.com" },
          { name: "FAQ", url: "https://www.gabbaukraine.com/faq" },
        ]}
      />

      <main style={{ paddingTop: 72, paddingBottom: 100 }}>
        <section style={{ padding: "40px 16px", maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>
            FAQ
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px, 7vw, 36px)", fontWeight: 500, lineHeight: 1.2, marginBottom: 8 }}>
            Часті запитання
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, fontWeight: 300, marginBottom: 32 }}>
            Відповіді на найпопулярніші запитання наших клієнтів.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {faqItems.map((item, i) => (
              <details
                key={i}
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  padding: "16px 0",
                }}
              >
                <summary
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: "pointer",
                    lineHeight: 1.5,
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: 44,
                  }}
                >
                  {item.question}
                  <span style={{ color: "var(--gold)", fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    paddingTop: 8,
                  }}
                >
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div style={{ marginTop: 40, padding: 24, background: "var(--warm-bg)", borderRadius: 16, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
              Не знайшли відповідь?
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300, marginBottom: 16 }}>
              Зв'яжіться з нами — допоможемо з будь-яким питанням.
            </p>
            <a
              href="https://wa.me/380990042222"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                background: "#25D366",
                color: "#fff",
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 500,
                minHeight: 44,
              }}
            >
              Написати в WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
