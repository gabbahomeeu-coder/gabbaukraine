import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getProductsByCollection, formatPrice } from "@/lib/catalog";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} — ${formatPrice(product.price)} | GABBA`,
    description: product.description,
    openGraph: {
      title: `${product.name} | GABBA`,
      description: product.description,
      url: `https://www.gabbaukraine.com/products/${product.slug}`,
      images: [{ url: `https://www.gabbaukraine.com${product.image}` }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getProductsByCollection(product.collectionSlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const whatsappMessage = encodeURIComponent(
    `Вітаю! Мене цікавить ${product.name} (${formatPrice(product.price)}). Чи є він у наявності?`
  );

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image}
        price={product.price}
        collection={product.collection}
        slug={product.slug}
        inStock={product.inStock}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: "https://www.gabbaukraine.com" },
          { name: "Колекції", url: "https://www.gabbaukraine.com/collections" },
          { name: product.collection, url: `https://www.gabbaukraine.com/collections/${product.collectionSlug}` },
          { name: product.name, url: `https://www.gabbaukraine.com/products/${product.slug}` },
        ]}
      />

      <main style={{ paddingTop: 0, paddingBottom: 100 }}>
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            aspectRatio: product.layout === "horizontal" ? "16/10" : "3/4",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Product Info */}
        <section style={{ padding: "24px 16px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: 6, fontSize: 11, color: "var(--subtle)", marginBottom: 16, fontWeight: 300, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--subtle)" }}>Головна</Link>
            <span>/</span>
            <Link href="/collections" style={{ color: "var(--subtle)" }}>Колекції</Link>
            <span>/</span>
            <Link href={`/collections/${product.collectionSlug}`} style={{ color: "var(--subtle)" }}>{product.collection}</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>{product.name}</span>
          </div>

          {/* Brand & Collection */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{
              fontSize: 9, textTransform: "uppercase", letterSpacing: 1,
              color: "var(--gold)", background: "var(--gold-light)",
              padding: "4px 10px", borderRadius: 20, fontWeight: 500,
            }}>
              {product.brand === "gabba" ? "Gabba" : "Monett"}
            </span>
            <span style={{
              fontSize: 9, textTransform: "uppercase", letterSpacing: 1,
              color: "var(--gold)", background: "var(--gold-light)",
              padding: "4px 10px", borderRadius: 20, fontWeight: 500,
            }}>
              {product.collection}
            </span>
            {product.inStock && (
              <span style={{
                fontSize: 9, letterSpacing: 0.5, color: "#16a34a",
                background: "rgba(22,163,74,0.08)", padding: "4px 10px",
                borderRadius: 20, fontWeight: 500,
              }}>
                В наявності
              </span>
            )}
          </div>

          {/* Name & Price */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(24px, 6vw, 32px)",
            fontWeight: 500,
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            {product.name}
          </h1>

          <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 20, color: "var(--text)" }}>
            {formatPrice(product.price)}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <a
              href={`https://wa.me/380990042222?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 20px", background: "#25D366", color: "#fff",
                borderRadius: 50, fontSize: 13, fontWeight: 500, minHeight: 48,
              }}
            >
              Замовити в WhatsApp
            </a>
            <a
              href="tel:+380990042222"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "14px 20px", border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 50, fontSize: 13, fontWeight: 500, minHeight: 48, color: "var(--text)",
              }}
            >
              Зателефонувати
            </a>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
              Опис
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>
              {product.description}
            </p>
          </div>

          {/* Materials */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
              Матеріали
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>
              {product.materials}
            </p>
          </div>

          {/* Delivery & Guarantee */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 10, marginBottom: 24,
          }}>
            {[
              { title: "Безкоштовна доставка", text: "По всій Україні. Збірка включена." },
              { title: "Гарантія 2 роки", text: "Офіційна гарантія на всі вироби." },
              { title: "Оплата", text: "Visa, Mastercard, Apple Pay, Google Pay, розстрочка." },
            ].map((item) => (
              <div key={item.title} style={{
                background: "var(--warm-bg)", borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 300 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ padding: "0 16px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
              Також з цієї колекції
            </h2>
            <div style={{
              display: "flex", gap: 12, overflowX: "auto",
              scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory", paddingBottom: 8,
            }}>
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  style={{
                    flexShrink: 0, width: "60vw", maxWidth: 240,
                    scrollSnapAlign: "start",
                    background: "var(--card)", borderRadius: 14,
                    overflow: "hidden", boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
                    display: "block", textDecoration: "none", color: "inherit",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                  <div style={{ padding: 12 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 500, marginBottom: 3 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300 }}>
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
