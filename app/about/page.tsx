import type { Metadata } from "next";
import Image from "next/image";
import { OrganizationJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Про GABBA — Історія бренду дизайнерських меблів",
  description:
    "GABBA — український бренд преміальних дизайнерських меблів. 6+ років на ринку, 8 колекцій, 1200+ задоволених клієнтів. Шоуруми у Києві, Львові та Одесі.",
  openGraph: {
    title: "Про GABBA — Історія бренду",
    description: "Дізнайтесь більше про бренд GABBA та нашу місію створювати найкращі меблі в Україні.",
    url: "https://www.gabbaukraine.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: "https://www.gabbaukraine.com" },
          { name: "Про нас", url: "https://www.gabbaukraine.com/about" },
        ]}
      />

      <main style={{ paddingTop: 72, paddingBottom: 100 }}>
        <section style={{ padding: "40px 16px", maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>
            Про нас
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px, 7vw, 36px)", fontWeight: 500, lineHeight: 1.2, marginBottom: 16 }}>
            GABBA — Luxury Redefined
          </h1>

          <article style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, fontWeight: 300 }}>
            <p style={{ marginBottom: 16 }}>
              GABBA — це український бренд дизайнерських меблів преміум-класу, заснований з метою зробити європейський дизайн доступним для українського ринку.
            </p>
            <p style={{ marginBottom: 16 }}>
              Ми поєднуємо найкращі європейські матеріали — натуральне дерево, італійську шкіру, преміальні тканини — з сучасним дизайном та бездоганною якістю виконання.
            </p>
            <p style={{ marginBottom: 16 }}>
              Кожна з наших колекцій — Madrid, Luna, Montana, Leora, Moka — це цілісна візія простору, створена для тих, хто цінує баланс форми, функції та естетики.
            </p>

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 32, color: "var(--text)" }}>
              Наші цінності
            </h2>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Якість без компромісів</strong> — кожен виріб проходить ретельний контроль</li>
              <li><strong>Європейський дизайн</strong> — сучасні тренди з увагою до деталей</li>
              <li><strong>Персональний підхід</strong> — консультація та підбір для кожного клієнта</li>
              <li><strong>Повний сервіс</strong> — доставка, збірка та гарантійне обслуговування</li>
            </ul>

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 32, color: "var(--text)" }}>
              Наші шоуруми
            </h2>
            <p style={{ marginBottom: 8 }}>📍 <strong>Київ</strong> — ТЦ 4ROOM, 1 поверх</p>
            <p style={{ marginBottom: 8 }}>📍 <strong>Львів</strong> — ТЦ TRY SLONY, 2 поверх</p>
            <p style={{ marginBottom: 8 }}>📍 <strong>Одеса</strong> — ТЦ MEGADOM, 2 поверх</p>

            <p style={{ marginTop: 32 }}>
              Телефон: <a href="tel:+380990042222" style={{ color: "var(--gold)" }}>+38 099 004 22 22</a>
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
