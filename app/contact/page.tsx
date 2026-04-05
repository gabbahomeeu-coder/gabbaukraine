import type { Metadata } from "next";
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Контакти GABBA — Шоуруми у Києві, Львові, Одесі",
  description:
    "Зв'яжіться з GABBA: +38 099 004 22 22. Шоуруми у Києві (4ROOM), Львові (TRY SLONY), Одесі (MEGADOM). WhatsApp, Viber, Telegram.",
  openGraph: {
    title: "Контакти GABBA",
    description: "Шоуруми у Києві, Львові та Одесі. Безкоштовна консультація.",
    url: "https://www.gabbaukraine.com/contact",
  },
};

const stores = [
  { city: "Київ", address: "ТЦ 4ROOM, 1 поверх", mapLink: "https://maps.google.com/?q=4ROOM+Kyiv" },
  { city: "Львів", address: "ТЦ TRY SLONY, 2 поверх", mapLink: "https://maps.google.com/?q=TRY+SLONY+Lviv" },
  { city: "Одеса", address: "ТЦ MEGADOM, 2 поверх", mapLink: "https://maps.google.com/?q=MEGADOM+Odesa" },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: "https://www.gabbaukraine.com" },
          { name: "Контакти", url: "https://www.gabbaukraine.com/contact" },
        ]}
      />
      {stores.map((s) => (
        <LocalBusinessJsonLd key={s.city} name={`GABBA ${s.city}`} city={s.city} address={s.address} />
      ))}

      <main style={{ paddingTop: 72, paddingBottom: 100 }}>
        <section style={{ padding: "40px 16px", maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>
            Контакти
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px, 7vw, 36px)", fontWeight: 500, lineHeight: 1.2, marginBottom: 24 }}>
            Зв'яжіться з нами
          </h1>

          {/* Phone & Messengers */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Телефон</h2>
            <a href="tel:+380990042222" style={{ fontSize: 20, fontWeight: 500, color: "var(--text)", display: "block", marginBottom: 16 }}>
              +38 099 004 22 22
            </a>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="https://wa.me/380990042222" target="_blank" rel="noopener noreferrer"
                style={{ padding: "12px 24px", background: "#25D366", color: "#fff", borderRadius: 50, fontSize: 13, fontWeight: 500, minHeight: 44, display: "flex", alignItems: "center" }}>
                WhatsApp
              </a>
              <a href="viber://chat?number=+380990042222"
                style={{ padding: "12px 24px", background: "#7360F2", color: "#fff", borderRadius: 50, fontSize: 13, fontWeight: 500, minHeight: 44, display: "flex", alignItems: "center" }}>
                Viber
              </a>
              <a href="https://t.me/+380990042222" target="_blank" rel="noopener noreferrer"
                style={{ padding: "12px 24px", background: "#26A5E4", color: "#fff", borderRadius: 50, fontSize: 13, fontWeight: 500, minHeight: 44, display: "flex", alignItems: "center" }}>
                Telegram
              </a>
            </div>
          </div>

          {/* Stores */}
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Наші шоуруми</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stores.map((s) => (
              <div key={s.city} style={{ background: "var(--card)", borderRadius: 14, padding: "16px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{s.city}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 300, marginBottom: 8 }}>{s.address}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 300, marginBottom: 10 }}>Пн–Нд: 10:00–20:00</div>
                <a href={s.mapLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500 }}>
                  Прокласти маршрут →
                </a>
              </div>
            ))}
          </div>

          {/* Working hours */}
          <div style={{ marginTop: 32, fontSize: 13, color: "var(--muted)", fontWeight: 300, lineHeight: 1.7 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, marginBottom: 12, color: "var(--text)" }}>Графік роботи</h2>
            <p>Шоуруми: щодня з 10:00 до 20:00</p>
            <p>Онлайн-консультації: щодня з 09:00 до 21:00</p>
          </div>
        </section>
      </main>
    </>
  );
}
