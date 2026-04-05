import type { Metadata } from "next";
import Link from "next/link";
import { getCollections } from "@/lib/catalog";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import styles from "./collections.module.css";

export const metadata: Metadata = {
  title: "Колекції GABBA — Дизайнерські меблі преміум-класу",
  description:
    "Колекції дизайнерських меблів GABBA: Madrid, Luna, Montana, Leora, Moka. Бренди Gabba та Monett. Безкоштовна доставка по Україні.",
  openGraph: {
    title: "Колекції GABBA",
    description: "Оберіть свою колекцію дизайнерських меблів.",
    url: "https://www.gabbaukraine.com/collections",
  },
};

export default function CollectionsPage() {
  const cols = getCollections();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: "https://www.gabbaukraine.com" },
          { name: "Колекції", url: "https://www.gabbaukraine.com/collections" },
        ]}
      />

      <main className={styles.main}>
        <section className={styles.header}>
          <p className={styles.eyebrow}>Колекції</p>
          <h1 className={styles.title}>Оберіть свій стиль</h1>
          <p className={styles.subtitle}>
            Кожна колекція — це цілісна візія простору, створена для тих, хто цінує бездоганний дизайн.
          </p>
        </section>

        <div className={styles.grid}>
          {cols.map((col) => (
            <Link href={`/collections/${col.slug}`} key={col.slug} className={styles.card}>
              <div className={styles.cardImageWrap}>
                <img src={col.image} alt={col.name} className={styles.cardImage} loading="lazy" />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardBrand}>{col.brand === "gabba" ? "Gabba" : "Monett"}</span>
                <h2 className={styles.cardName}>{col.name}</h2>
                <p className={styles.cardDesc}>{col.description}</p>
                <span className={styles.cardLink}>Дивитися колекцію →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
