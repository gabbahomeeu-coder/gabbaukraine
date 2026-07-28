import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/catalog";
import {
  koleksiyon,
  tumKoleksiyonlar,
  koleksiyonUrunleri,
} from "@/lib/db/catalog";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import styles from "../collections.module.css";

const SITE = "https://www.gabbaukraine.com";

export async function generateStaticParams() {
  const hepsi = await tumKoleksiyonlar();
  return hepsi.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const k = await koleksiyon(slug);
  if (!k) return {};

  return {
    title: `Колекція ${k.name} | GABBA`,
    description: k.description,
    alternates: { canonical: `${SITE}/collections/${k.slug}` },
    openGraph: {
      title: `Колекція ${k.name} | GABBA`,
      description: k.description,
      url: `${SITE}/collections/${k.slug}`,
      images: k.image ? [{ url: `${SITE}${k.image}` }] : undefined,
    },
  };
}

export default async function KoleksiyonSayfasi({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const k = await koleksiyon(slug);
  if (!k) notFound();

  const urunler = await koleksiyonUrunleri(slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: SITE },
          { name: "Колекції", url: `${SITE}/collections` },
          { name: k.name, url: `${SITE}/collections/${k.slug}` },
        ]}
      />

      <div className={styles.page}>
        <header className={styles.detailHead}>
          {k.image && (
            <Image
              src={k.image}
              alt={k.name}
              fill
              priority
              sizes="100vw"
              className={styles.detailImg}
            />
          )}
          <div className={styles.detailScrim} />
          <div className={styles.detailText}>
            <h1 className={styles.detailTitle}>{k.name}</h1>
            <p className={styles.detailDesc}>{k.description}</p>
          </div>
        </header>

        <nav className={styles.crumbs}>
          <Link href="/collections">Колекції</Link>
          <span>·</span>
          {k.name}
        </nav>

        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Моделі колекції</h2>
          <span className={styles.sectionCount}>
            {urunler.length} {urunler.length === 1 ? "модель" : "моделей"}
          </span>
        </div>

        {urunler.length === 0 ? (
          <p className={styles.empty}>
            Ця колекція скоро з&apos;явиться у продажу. Напишіть нам — повідомимо
            першими.
          </p>
        ) : (
          <div className={styles.products}>
            {urunler.map((p) => {
              const enDusuk = p.variants.length
                ? Math.min(...p.variants.map((v) => v.price))
                : p.price;
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className={styles.product}
                >
                  <div className={styles.productMedia}>
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1000px) 24vw, (min-width: 700px) 33vw, 50vw"
                        className={styles.productImg}
                      />
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{p.name}</h3>
                    <span className={styles.productPrice}>
                      {formatPrice(enDusuk)}
                    </span>
                    {p.inStock && (
                      <span className={styles.productStock}>В наявності</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
