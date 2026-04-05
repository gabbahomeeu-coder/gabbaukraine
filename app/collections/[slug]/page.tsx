import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getCollections, getProductsByCollection, formatPrice } from "@/lib/catalog";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollection(slug);
  if (!col) return {};

  return {
    title: `Колекція ${col.name} — GABBA`,
    description: col.description,
    openGraph: {
      title: `Колекція ${col.name} | GABBA`,
      description: col.description,
      url: `https://www.gabbaukraine.com/collections/${col.slug}`,
      images: [{ url: `https://www.gabbaukraine.com${col.image}` }],
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const col = getCollection(slug);
  if (!col) notFound();

  const prods = getProductsByCollection(slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Головна", url: "https://www.gabbaukraine.com" },
          { name: "Колекції", url: "https://www.gabbaukraine.com/collections" },
          { name: col.name, url: `https://www.gabbaukraine.com/collections/${col.slug}` },
        ]}
      />

      <main style={{ paddingTop: 0, paddingBottom: 100 }}>
        {/* Hero */}
        <div style={{ position: "relative" }}>
          <img
            src={col.image}
            alt={col.name}
            style={{ width: "100%", height: "50vh", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(32,26,18,0.2) 0%, transparent 30%, rgba(32,26,18,0.6) 100%)"
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "0 20px 24px", color: "#fff"
          }}>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>
              {col.brand === "gabba" ? "Gabba" : "Monett"}
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(30px, 8vw, 42px)", fontWeight: 500, marginBottom: 6 }}>
              {col.name}
            </h1>
            <p style={{ fontSize: 13, opacity: 0.8, fontWeight: 300, maxWidth: 320, lineHeight: 1.5 }}>
              {col.description}
            </p>
          </div>
        </div>

        {/* Products */}
        <section style={{ padding: "32px 16px 0" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
            Товари колекції
          </h2>

          {prods.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300 }}>
              Товари цієї колекції скоро з'являться на сайті.
            </p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}>
              {prods.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  style={{
                    background: "var(--card)",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    gridColumn: p.layout === "horizontal" ? "span 2" : undefined,
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: p.layout === "horizontal" ? "16/9" : "3/4",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                  <div style={{ padding: 12 }}>
                    <span style={{
                      fontSize: 9, textTransform: "uppercase", letterSpacing: 1,
                      color: "var(--gold)", background: "var(--gold-light)",
                      padding: "3px 8px", borderRadius: 20, fontWeight: 500,
                      display: "inline-block", marginBottom: 5,
                    }}>
                      {p.collection}
                    </span>
                    {p.inStock && (
                      <span style={{
                        fontSize: 8, letterSpacing: 0.5, color: "#16a34a",
                        background: "rgba(22,163,74,0.08)", padding: "2px 6px",
                        borderRadius: 10, marginLeft: 4, fontWeight: 500, display: "inline-block",
                      }}>
                        В наявності
                      </span>
                    )}
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 500, marginBottom: 3, lineHeight: 1.3 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300 }}>
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
