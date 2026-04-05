import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Блог GABBA — Поради з дизайну інтер'єру та меблів",
  description:
    "Корисні статті про дизайн інтер'єру, тренди меблів, поради з вибору та догляду за преміальними меблями від GABBA.",
  openGraph: {
    title: "Блог GABBA — Дизайн інтер'єру",
    description: "Статті, поради та тренди від команди GABBA.",
    url: "https://www.gabbaukraine.com/blog",
  },
};

const posts = [
  {
    slug: "yak-obraty-divan",
    title: "Як обрати ідеальний диван для вітальні: 7 порад від дизайнерів GABBA",
    excerpt:
      "Диван — це серце вітальні. Розповідаємо, на що звернути увагу при виборі: розмір, матеріал, форма та стиль.",
    date: "2024-12-15",
    category: "Поради",
  },
  {
    slug: "trendy-2025",
    title: "Тренди дизайну інтер'єру 2025: що обирають українці",
    excerpt:
      "Від мінімалізму до warm luxury — розглядаємо головні тенденції року та як вони відображаються у колекціях GABBA.",
    date: "2024-12-10",
    category: "Тренди",
  },
  {
    slug: "doglyad-za-shkiroyu",
    title: "Як доглядати за шкіряними меблями: повний гід",
    excerpt:
      "Італійська шкіра потребує правильного догляду. Ділимося перевіреними порадами, щоб ваші меблі служили роками.",
    date: "2024-12-05",
    category: "Догляд",
  },
  {
    slug: "kolekciya-madrid",
    title: "Колекція Madrid: класична елегантність для сучасного дому",
    excerpt:
      "Розповідаємо історію створення нашої флагманської колекції та чому вона стала бестселером GABBA.",
    date: "2024-11-28",
    category: "Колекції",
  },
  {
    slug: "mebli-dlya-malenkoji-kvartiry",
    title: "Дизайнерські меблі для невеликої квартири: рішення від GABBA",
    excerpt:
      "Як облаштувати компактний простір так, щоб він виглядав стильно та залишався функціональним.",
    date: "2024-11-20",
    category: "Поради",
  },
];

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: "https://www.gabbaukraine.com" },
          { name: "Блог", url: "https://www.gabbaukraine.com/blog" },
        ]}
      />

      <main style={{ paddingTop: 72, paddingBottom: 100 }}>
        <section style={{ padding: "40px 16px", maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>
            Блог
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px, 7vw, 36px)", fontWeight: 500, lineHeight: 1.2, marginBottom: 8 }}>
            Поради та натхнення
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, fontWeight: 300, marginBottom: 32 }}>
            Статті про дизайн інтер'єру, тренди та догляд за меблями.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {posts.map((post) => (
              <article
                key={post.slug}
                style={{
                  background: "var(--card)",
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "var(--gold)",
                      background: "var(--gold-light)",
                      padding: "3px 8px",
                      borderRadius: 20,
                      fontWeight: 500,
                    }}
                  >
                    {post.category}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--subtle)", fontWeight: 300 }}>
                    {new Date(post.date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: 8,
                  }}
                >
                  {post.title}
                </h2>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, fontWeight: 300 }}>
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
