import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/catalog";
import {
  urun as urunGetir,
  tumUrunler,
  koleksiyonUrunleri,
  urunKumaslari,
} from "@/lib/db/catalog";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import ProductClient from "./product-client";
import related from "./related.module.css";

const SITE = "https://www.gabbaukraine.com";

export async function generateStaticParams() {
  const hepsi = await tumUrunler();
  return hepsi.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await urunGetir(slug);
  if (!product) return {};

  const enDusukFiyat = product.variants.length
    ? Math.min(...product.variants.map((v) => v.price))
    : product.price;

  return {
    title: `${product.name} — ${formatPrice(enDusukFiyat)} | GABBA`,
    description: product.description,
    alternates: { canonical: `${SITE}/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | GABBA`,
      description: product.description,
      url: `${SITE}/products/${product.slug}`,
      images: [{ url: `${SITE}${product.image}` }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await urunGetir(slug);
  if (!product) notFound();

  const fabrics = await urunKumaslari(product.slug);
  const gruplar = [...new Map(
    fabrics.map((f) => [f.groupCode, { code: f.groupCode, name: f.groupName }])
  ).values()];

  const digerleri = (await koleksiyonUrunleri(product.collectionSlug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const enDusukFiyat = product.variants.length
    ? Math.min(...product.variants.map((v) => v.price))
    : product.price;

  const stokVar = product.variants.length
    ? product.variants.some((v) => v.stock > 0)
    : product.inStock;

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image}
        price={enDusukFiyat}
        collection={product.collection}
        slug={product.slug}
        inStock={stokVar}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: SITE },
          { name: "Колекції", url: `${SITE}/collections` },
          {
            name: product.collection,
            url: `${SITE}/collections/${product.collectionSlug}`,
          },
          { name: product.name, url: `${SITE}/products/${product.slug}` },
        ]}
      />

      <SiteHeader />

      <ProductClient product={product} fabrics={fabrics} groups={gruplar} />

      {/* ilgili ürün yoksa sabit alt bar içeriği örtmesin */}
      {digerleri.length === 0 && <div className={related.barSpacer} />}

      {digerleri.length > 0 && (
        <section className={related.wrap}>
          <div className={related.head}>
            <p className={related.eyebrow}>Колекція {product.collection}</p>
            <h2 className={related.title}>Разом виглядає краще</h2>
          </div>
          <div className={related.rail}>
            {digerleri.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className={related.card}
              >
                <div className={related.media}>
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1000px) 24vw, 62vw"
                    className={related.img}
                  />
                </div>
                <div className={related.info}>
                  <p className={related.coll}>{p.collection}</p>
                  <h3 className={related.name}>{p.name}</h3>
                  <span className={related.price}>{formatPrice(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </>
  );
}
