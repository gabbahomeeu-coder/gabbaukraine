/**
 * Günlük kampanya sistemi
 *
 * Her gün 70.000 ₴ altındaki ürünlerden rastgele 3 tanesi seçilir
 * ve sadece internet satışı üzerinden %20 indirim uygulanır.
 *
 * Seed: tarih bazlı — aynı gün aynı ürünler seçilir (tutarlılık)
 * CRM bağlanınca: gerçek ürün verileri buradan çekilecek
 */

export type DailyDeal = {
  img: string;
  name: string;
  collection: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  slug: string;
};

// Şimdilik statik ürün havuzu — CRM bağlanınca değişecek
const allProducts = [
  { img: "genova-chair", name: "Стілець Genova", collection: "Montana", price: 18143, slug: "genova-chair" },
  { img: "luna-armchair", name: "Крісло Luna", collection: "Luna", price: 43444, slug: "luna-armchair" },
  { img: "montana-armchair", name: "Крісло Montana Lux", collection: "Montana", price: 44977, slug: "montana-armchair" },
  { img: "milano-armchair", name: "Крісло Milano", collection: "Milano", price: 50791, slug: "milano-armchair" },
  { img: "madrid-table", name: "Стіл Madrid", collection: "Madrid", price: 69318, slug: "madrid-table" },
];

// Tarih bazlı seed ile tutarlı rastgele seçim
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getDateSeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function getDailyDeals(date: Date = new Date()): DailyDeal[] {
  // 70.000 ₴ altındaki ürünler
  const eligible = allProducts.filter((p) => p.price < 70000);

  if (eligible.length <= 3) {
    return eligible.map((p) => ({
      img: p.img,
      name: p.name,
      collection: p.collection,
      originalPrice: p.price,
      discountedPrice: Math.round(p.price * 0.8),
      discount: 20,
      slug: p.slug,
    }));
  }

  // Tarih bazlı seed ile 3 ürün seç
  const rand = seededRandom(getDateSeed(date));
  const shuffled = [...eligible].sort(() => rand() - 0.5);
  const selected = shuffled.slice(0, 3);

  return selected.map((p) => ({
    img: p.img,
    name: p.name,
    collection: p.collection,
    originalPrice: p.price,
    discountedPrice: Math.round(p.price * 0.8),
    discount: 20,
    slug: p.slug,
  }));
}

export function formatPrice(price: number): string {
  return "₴" + price.toLocaleString("uk-UA");
}
