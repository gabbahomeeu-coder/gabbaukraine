import { getDailyDeals } from "@/lib/daily-deals";
import { tumUrunler, tumKoleksiyonlar } from "@/lib/db/catalog";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  LocalBusinessJsonLd,
  ProductJsonLd,
} from "@/components/json-ld";
import { STORES } from "@/lib/site";
import HomeClient from "./home-client";

// Günlük kampanya her saat başı tazelenir — gün değişince yeni 3 ürün gelir
export const revalidate = 3600;

export default async function HomePage() {
  const deals = getDailyDeals();
  const products = await tumUrunler();
  const collections = await tumKoleksiyonlar();

  return (
    <>
      {/* ── SEO / GEO / AEO — yapılandırılmış veri ── */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      {STORES.map((s) => (
        <LocalBusinessJsonLd
          key={s.city}
          name={`GABBA ${s.city}`}
          city={s.city}
          address={s.address}
        />
      ))}
      {/* Günün indirimli ürünleri — her gün taze yapılandırılmış içerik sinyali */}
      {deals.map((d) => (
        <ProductJsonLd
          key={d.slug}
          name={d.name}
          description={`${d.name} з колекції ${d.collection} — знижка ${d.discount}% лише сьогодні при онлайн-замовленні.`}
          image={`/images/products/${d.img}.jpg`}
          price={d.discountedPrice}
          collection={d.collection}
          slug={d.slug}
        />
      ))}

      <HomeClient deals={deals} products={products} collections={collections} />
    </>
  );
}
