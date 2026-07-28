/**
 * Katalog veri tipleri.
 * Ayrı dosyada tutuluyor çünkü istemci bileşenleri de bu tipleri
 * kullanıyor; okuma katmanı ise yalnızca sunucuda çalışır.
 */

export type KumasGrubuDTO = {
  code: string;
  name: string;
};

export type VaryantDTO = {
  id: string;
  label: string;
  price: number;
  stock: number;
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
};

export type UrunDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  materials: string;
  collection: string;
  collectionSlug: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  inStock: boolean;
  isFeatured: boolean;
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
  leadTimeDays: number;
  variants: VaryantDTO[];
  fabricCodes: string[];
};

export type KoleksiyonDTO = {
  slug: string;
  name: string;
  description: string;
  brand: string;
  image: string;
  /** telefon kapağı; seçilmemişse `image` ile aynı */
  mobileImage: string;
  productCount: number;
};

export type KumasDTO = {
  code: string;
  groupCode: string;
  groupName: string;
  name: string;
  composition?: string;
  swatchUrl?: string;
  color: string;
  priceDelta: number;
  extraLeadDays: number;
  inStock: boolean;
};
