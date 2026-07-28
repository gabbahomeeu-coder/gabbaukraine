import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { tumKoleksiyonlar } from "@/lib/db/catalog";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import styles from "./collections.module.css";

const SITE = "https://www.gabbaukraine.com";

export const metadata: Metadata = {
  title: "Колекції меблів | GABBA",
  description:
    "Колекції Madrid, Luna, Montana, Leora та Moka. Дизайнерські меблі преміум-класу з безкоштовною доставкою по Україні.",
  alternates: { canonical: `${SITE}/collections` },
  openGraph: {
    title: "Колекції GABBA",
    description: "Оберіть свою колекцію дизайнерських меблів.",
    url: `${SITE}/collections`,
  },
};

export default async function KoleksiyonlarSayfasi() {
  const koleksiyonlar = await tumKoleksiyonlar();
  const markaAdi = (b: string) => (b === "monett" ? "Monett" : "Gabba");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: SITE },
          { name: "Колекції", url: `${SITE}/collections` },
        ]}
      />

      <div className={styles.page}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Колекції</p>
          <h1 className={styles.title}>Оберіть свій стиль</h1>
          <p className={styles.lede}>
            Кожна колекція — це цілісне рішення для простору: дивани, крісла,
            столи та корпусні меблі в одній естетиці.
          </p>
        </header>

        <div className={styles.grid}>
          {koleksiyonlar.map((k) => {
            const bos = k.productCount === 0;

            const icerik = (
              <>
                <div className={styles.cardMedia}>
                  {k.image && (
                    <Image
                      src={k.image}
                      alt={k.name}
                      fill
                      sizes="(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw"
                      className={styles.cardImg}
                    />
                  )}
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.brand}>{markaAdi(k.brand)}</p>
                  <h2 className={styles.name}>{k.name}</h2>
                  <p className={styles.desc}>{k.description}</p>

                  <div className={styles.foot}>
                    {bos ? (
                      <span className={styles.soonTag}>Скоро</span>
                    ) : (
                      <>
                        <span className={styles.count}>
                          {k.productCount}{" "}
                          {k.productCount === 1 ? "модель" : "моделей"}
                        </span>
                        <span className={styles.link}>
                          Дивитися <ArrowRight size={14} />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </>
            );

            return bos ? (
              <div key={k.slug} className={styles.card}>
                {icerik}
              </div>
            ) : (
              <Link
                key={k.slug}
                href={`/collections/${k.slug}`}
                className={styles.card}
              >
                {icerik}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
