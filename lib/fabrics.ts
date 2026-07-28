/**
 * KAT-08 · Kumaş kataloğu
 *
 * GEÇİCİ VERİ. Gerçek kumaş listesi (ad, kod, fiyat farkı, fotoğraf) müşteriden
 * gelecek; o zaman bu dosya veritabanına taşınacak.
 *
 * Kumaşlar dış muhasebe sunucusundan GELMİYOR — burada tanımlanıyor.
 * Fiyat = varyant fiyatı + kumaş farkı − indirim.
 *
 * `swatchUrl` dolu olduğunda gerçek doku fotoğrafı gösterilir; boşken
 * `color` ile düz renk örneği çizilir. Fotoğraflar çekilince sadece
 * swatchUrl doldurulacak, arayüz değişmeyecek.
 */

export type FabricGroup = {
  code: string;
  name: string;
  sortOrder: number;
};

export type Fabric = {
  code: string;
  groupCode: string;
  name: string;
  /** kumaş bileşimi ve dayanıklılık — güven veren detay */
  composition?: string;
  /** doku fotoğrafı; yoksa `color` kullanılır */
  swatchUrl?: string;
  /** yedek renk — fotoğraf gelene kadar */
  color: string;
  /** taban fiyata eklenen tutar (₴) */
  priceDelta: number;
  /** bu kumaş seçilirse teslimata eklenen gün */
  extraLeadDays: number;
  inStock: boolean;
};

export const fabricGroups: FabricGroup[] = [
  { code: "bukle", name: "Букле", sortOrder: 1 },
  { code: "velvet", name: "Оксамит", sortOrder: 2 },
  { code: "linen", name: "Льон", sortOrder: 3 },
  { code: "leather", name: "Шкіра", sortOrder: 4 },
];

export const fabrics: Fabric[] = [
  // ── Букле ──
  {
    code: "BK-01",
    groupCode: "bukle",
    name: "Крем",
    composition: "100% поліестер · 45 000 циклів Мартиндейл",
    color: "#E8DFD1",
    priceDelta: 0,
    extraLeadDays: 0,
    inStock: true,
  },
  {
    code: "BK-04",
    groupCode: "bukle",
    name: "Пісок",
    composition: "100% поліестер · 45 000 циклів Мартиндейл",
    color: "#D2C2AC",
    priceDelta: 0,
    extraLeadDays: 0,
    inStock: true,
  },
  {
    code: "BK-07",
    groupCode: "bukle",
    name: "Графіт",
    composition: "100% поліестер · 45 000 циклів Мартиндейл",
    color: "#6E6A66",
    priceDelta: 0,
    extraLeadDays: 0,
    inStock: true,
  },
  // ── Оксамит ──
  {
    code: "VL-02",
    groupCode: "velvet",
    name: "Пудра",
    composition: "Велюр · 60 000 циклів Мартиндейл",
    color: "#D5B8B0",
    priceDelta: 6400,
    extraLeadDays: 0,
    inStock: true,
  },
  {
    code: "VL-05",
    groupCode: "velvet",
    name: "Смарагд",
    composition: "Велюр · 60 000 циклів Мартиндейл",
    color: "#3C5A4E",
    priceDelta: 6400,
    extraLeadDays: 7,
    inStock: true,
  },
  {
    code: "VL-08",
    groupCode: "velvet",
    name: "Індиго",
    composition: "Велюр · 60 000 циклів Мартиндейл",
    color: "#3B4557",
    priceDelta: 6400,
    extraLeadDays: 7,
    inStock: true,
  },
  {
    code: "VL-11",
    groupCode: "velvet",
    name: "Карамель",
    composition: "Велюр · 60 000 циклів Мартиндейл",
    color: "#A6764A",
    priceDelta: 6400,
    extraLeadDays: 0,
    inStock: false,
  },
  // ── Льон ──
  {
    code: "LN-01",
    groupCode: "linen",
    name: "Натуральний",
    composition: "55% льон, 45% бавовна",
    color: "#DCD3C2",
    priceDelta: 3200,
    extraLeadDays: 0,
    inStock: true,
  },
  {
    code: "LN-03",
    groupCode: "linen",
    name: "Сірий",
    composition: "55% льон, 45% бавовна",
    color: "#B0AEA6",
    priceDelta: 3200,
    extraLeadDays: 0,
    inStock: true,
  },
  // ── Шкіра ──
  {
    code: "SK-02",
    groupCode: "leather",
    name: "Коньяк",
    composition: "Натуральна шкіра, товщина 1,4 мм",
    color: "#8A5230",
    priceDelta: 24800,
    extraLeadDays: 14,
    inStock: true,
  },
  {
    code: "SK-05",
    groupCode: "leather",
    name: "Чорна",
    composition: "Натуральна шкіра, товщина 1,4 мм",
    color: "#2B2724",
    priceDelta: 24800,
    extraLeadDays: 14,
    inStock: true,
  },
  {
    code: "SK-08",
    groupCode: "leather",
    name: "Слонова кістка",
    composition: "Натуральна шкіра, товщина 1,4 мм",
    color: "#E3DCCE",
    priceDelta: 26900,
    extraLeadDays: 21,
    inStock: true,
  },
];

/** Hangi kumaş hangi üründe kullanılabilir — panelden yönetilecek */
const urunKumaslari: Record<string, string[]> = {
  "madrid-sofa": ["BK-01", "BK-04", "BK-07", "VL-02", "VL-05", "VL-08", "VL-11", "LN-01", "LN-03", "SK-02", "SK-05", "SK-08"],
  "milano-sofa": ["BK-01", "BK-04", "BK-07", "VL-02", "VL-05", "VL-08", "LN-01", "LN-03"],
  "milano-armchair": ["BK-01", "BK-04", "BK-07", "VL-02", "VL-05", "VL-11", "SK-02", "SK-05"],
  "montana-armchair": ["BK-01", "BK-04", "LN-01", "LN-03", "SK-02"],
  "luna-armchair": ["BK-01", "BK-04", "BK-07", "VL-02", "VL-08"],
  "genova-chair": ["BK-01", "BK-04", "LN-01", "SK-05"],
  "galante-bed": ["BK-01", "BK-04", "BK-07", "VL-02", "VL-05", "LN-01"],
};

export function getFabricsForProduct(slug: string): Fabric[] {
  const kodlar = urunKumaslari[slug];
  if (!kodlar) return [];
  return fabrics.filter((f) => kodlar.includes(f.code));
}

export function getFabric(code: string): Fabric | undefined {
  return fabrics.find((f) => f.code === code);
}

export function getGroup(code: string): FabricGroup | undefined {
  return fabricGroups.find((g) => g.code === code);
}
