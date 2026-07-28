import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { SiteHeader, SiteFooter, SiteBar } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/icons";
import { WA_LINK } from "@/lib/site";
import styles from "../icerik.module.css";

const SITE = "https://www.gabbaukraine.com";

export const metadata: Metadata = {
  title: "Блог про меблі та інтер'єр | GABBA",
  description:
    "Поради щодо вибору меблів, догляду за ними та тренди інтер'єру. Досвід дизайнерів GABBA.",
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    title: "Блог GABBA",
    description: "Поради, тренди та історії про меблі й інтер'єр.",
    url: `${SITE}/blog`,
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

const tarih = (d: string) =>
  new Date(d).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function BlogSayfasi() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: SITE },
          { name: "Блог", url: `${SITE}/blog` },
        ]}
      />

      <SiteHeader />

      <div className={styles.page}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Блог</p>
          <h1 className={styles.title}>Про меблі, простір і смак</h1>
          <p className={styles.lede}>
            Поради щодо вибору та догляду, тренди інтер&apos;єру й історії наших
            колекцій — з досвіду дизайнерів GABBA.
          </p>
        </header>

        <div className={styles.posts}>
          {posts.map((p) => (
            <article key={p.slug} className={styles.post}>
              <p className={styles.postCat}>{p.category}</p>
              <h2 className={styles.postTitle}>{p.title}</h2>
              <p className={styles.postText}>{p.excerpt}</p>
              <div className={styles.postMeta}>
                <time dateTime={p.date}>{tarih(p.date)}</time>
                <span className={styles.postSoon}>Скоро</span>
              </div>
            </article>
          ))}
        </div>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Не знаєте, з чого почати?</h2>
          <p className={styles.ctaText}>
            Напишіть нам — дизайнер підкаже, які меблі підійдуть саме вашому
            простору.
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
