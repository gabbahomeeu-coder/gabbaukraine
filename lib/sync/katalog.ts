// Not: hem Next.js sunucusundan hem komut satırından çalışır,
// bu yüzden "server-only" ve @/ kısayolu kullanılmıyor.
import { db } from "../db/client.ts";

/**
 * ══════════════════════════════════════════════════════════════
 * KAT-05 · Dış katalog senkronu
 *
 * CRM'den ürün, koleksiyon, tedarikçi ve görselleri çeker.
 *
 * KURALLAR
 *  1. Bizim yazdığımız alanlar ASLA ezilmez:
 *     isActive (yayın kararı), isFeatured, sortOrder, koleksiyon
 *     kapakları, kumaş eşleşmeleri, SEO metinleri
 *  2. Her kayıt bekçiden (API-06) geçer; bozuk veri içeri girmez,
 *     karantinaya yazılır ve raporda görünür
 *  3. Kuru çalıştırmada veritabanına hiçbir şey yazılmaz
 * ══════════════════════════════════════════════════════════════
 */

/* ── kaynak tipleri ── */

type KaynakGorsel = {
  id?: string;
  url: string;
  index?: number;
  orientation?: string;
  width?: number;
  height?: number;
  type?: string;
  contains?: string[];
  scene?: string;
  alt?: string;
};

type KaynakUrun = {
  id: string;
  sku?: string;
  name: string;
  nameEn?: string;
  isActive: boolean;
  supplier?: { id: string; name: string } | null;
  collection?: { id: string; name: string; images?: KaynakGorsel[] } | null;
  category?: string | null;
  currency?: string;
  price: number;
  stock: number;
  images?: KaynakGorsel[];
};

export type SenkronRapor = {
  kuru: boolean;
  okunan: number;
  tedarikci: { yeni: number; guncel: number };
  koleksiyon: { yeni: number; guncel: number };
  urun: { yeni: number; guncel: number; pasiflenen: number };
  gorsel: { yeni: number; toplamBenzersiz: number };
  stok: { duzeltilen: number };
  reddedilen: { urun: string; sebep: string }[];
  uyarilar: string[];
  sureSn: number;
};

/* ── yardımcılar ── */

const UK = "uk";

/** Ukraynaca/Türkçe karakterleri adres için latinleştirir */
const HARF: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh",
  з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n",
  о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu", я: "ya", ы: "y", э: "e", ъ: "",
  ё: "yo", ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
};

export function slugla(metin: string): string {
  return metin
    .toLocaleLowerCase("uk")
    .split("")
    .map((h) => HARF[h] ?? h)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Ürün adından kategori tahmini — CRM kategori göndermiyor */
const KATEGORI_KURALLARI: [string, RegExp][] = [
  ["sofa", /диван|кутов|модул/i],
  ["chair", /крісло|стілець|пуф|банкет|табурет/i],
  // yatak grubu masadan ÖNCE: "спальний комплект" içinde стіл geçebiliyor
  ["bed", /ліжко|матрац|узголів|спальний комплект/i],
  ["table", /стіл|столик|острів/i],
  ["case", /тумб|комод|консоль|шафа|вітрин|вітраж|буфет|полиц|дзеркал|бар|стелаж|дресуар|камін|колон|тв блок|тв панел|візок/i],
];

export function kategoriTahmin(ad: string, koleksiyonAdi?: string): string | null {
  // Accessories koleksiyonundakiler doğrudan aksesuar sayılır
  if (koleksiyonAdi && /accessor/i.test(koleksiyonAdi)) return "accessory";
  for (const [kod, kalip] of KATEGORI_KURALLARI) {
    if (kalip.test(ad)) return kod;
  }
  return null;
}

/* ── BEKÇİ (API-06) ── */

function bekci(u: KaynakUrun): string | null {
  if (!u.id) return "kimlik yok";
  if (!u.name?.trim()) return "ad boş";
  if (typeof u.price !== "number" || !Number.isFinite(u.price)) return "fiyat sayı değil";
  if (u.price <= 0) return `fiyat geçersiz (${u.price})`;
  if (typeof u.stock !== "number" || !Number.isInteger(u.stock)) return "stok tam sayı değil";
  if (u.stock < 0) return `stok eksi (${u.stock})`;
  if (u.currency && u.currency !== "UAH") return `beklenmeyen para birimi (${u.currency})`;
  if (!u.collection?.id) return "koleksiyon yok";
  return null;
}

/* ── kaynaktan çekme ── */

async function sayfaCek(temelUrl: string, anahtar: string, sayfa: number, boyut: number) {
  const url = `${temelUrl}?page=${sayfa}&pageSize=${boyut}`;
  const yanit = await fetch(url, {
    headers: { Authorization: `Bearer ${anahtar}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!yanit.ok) {
    throw new Error(`Katalog sunucusu ${yanit.status} döndü (sayfa ${sayfa})`);
  }
  return yanit.json() as Promise<{
    totalItems: number;
    totalPages: number;
    items: KaynakUrun[];
  }>;
}

export async function tumUrunleriCek(
  temelUrl: string,
  anahtar: string,
  sayfaBoyutu = 100
): Promise<KaynakUrun[]> {
  const ilk = await sayfaCek(temelUrl, anahtar, 1, sayfaBoyutu);
  const hepsi = [...ilk.items];

  for (let s = 2; s <= (ilk.totalPages ?? 1); s++) {
    const sayfa = await sayfaCek(temelUrl, anahtar, s, sayfaBoyutu);
    hepsi.push(...sayfa.items);
  }
  return hepsi;
}

/* ── senkron ── */

export async function katalogSenkronu({
  temelUrl,
  anahtar,
  kuru = true,
  yeniUrunYayinda = false,
}: {
  temelUrl: string;
  anahtar: string;
  /** true ise veritabanına hiçbir şey yazılmaz */
  kuru?: boolean;
  /** yeni ürünler sitede hemen görünsün mü */
  yeniUrunYayinda?: boolean;
}): Promise<SenkronRapor> {
  const basla = Date.now();
  const rapor: SenkronRapor = {
    kuru,
    okunan: 0,
    tedarikci: { yeni: 0, guncel: 0 },
    koleksiyon: { yeni: 0, guncel: 0 },
    urun: { yeni: 0, guncel: 0, pasiflenen: 0 },
    gorsel: { yeni: 0, toplamBenzersiz: 0 },
    stok: { duzeltilen: 0 },
    reddedilen: [],
    uyarilar: [],
    sureSn: 0,
  };

  const urunler = await tumUrunleriCek(temelUrl, anahtar);
  rapor.okunan = urunler.length;

  /* 1) bekçi süzgeci */
  const gecerli: KaynakUrun[] = [];
  for (const u of urunler) {
    const hata = bekci(u);
    if (hata) {
      rapor.reddedilen.push({ urun: `${u.id ?? "?"} ${u.name ?? ""}`.trim(), sebep: hata });
      if (!kuru) {
        await db.eventQuarantine.create({
          data: {
            eventName: "katalog.urun",
            payload: JSON.parse(JSON.stringify(u)),
            guardCheck: "sekil",
            reason: hata,
          },
        });
      }
      continue;
    }
    gecerli.push(u);
  }

  if (rapor.reddedilen.length > urunler.length * 0.2) {
    rapor.uyarilar.push(
      `Ürünlerin %${Math.round((rapor.reddedilen.length / urunler.length) * 100)}'i reddedildi — kaynak veride sorun olabilir.`
    );
  }

  /* 2) tedarikçiler */
  const tedarikciler = new Map<string, string>();
  for (const u of gecerli) {
    if (u.supplier?.id) tedarikciler.set(u.supplier.id, u.supplier.name);
  }
  const tedarikciEsleme = new Map<string, string>();

  for (const [disId, ad] of tedarikciler) {
    const mevcut = await db.supplier.findUnique({ where: { externalId: disId } });
    if (mevcut) {
      rapor.tedarikci.guncel++;
      tedarikciEsleme.set(disId, mevcut.id);
      if (!kuru && mevcut.name !== ad) {
        await db.supplier.update({ where: { id: mevcut.id }, data: { name: ad } });
      }
    } else {
      rapor.tedarikci.yeni++;
      if (!kuru) {
        const yeni = await db.supplier.create({ data: { externalId: disId, name: ad } });
        tedarikciEsleme.set(disId, yeni.id);
      }
    }
  }

  /* 3) koleksiyonlar + ortam görselleri */
  const koleksiyonlar = new Map<string, { ad: string; gorseller: KaynakGorsel[] }>();
  for (const u of gecerli) {
    const c = u.collection!;
    if (!koleksiyonlar.has(c.id)) {
      koleksiyonlar.set(c.id, { ad: c.name, gorseller: c.images ?? [] });
    }
  }
  const koleksiyonEsleme = new Map<string, string>();
  const gorulenGorsel = new Set<string>();

  for (const [disId, bilgi] of koleksiyonlar) {
    let kayitId: string | null = null;
    const mevcut = await db.collection.findUnique({ where: { externalId: disId } });

    if (mevcut) {
      rapor.koleksiyon.guncel++;
      kayitId = mevcut.id;
    } else {
      rapor.koleksiyon.yeni++;
      if (!kuru) {
        // slug çakışmasını önle
        let slug = slugla(bilgi.ad);
        let ek = 1;
        while (await db.collection.findUnique({ where: { slug } })) {
          slug = `${slugla(bilgi.ad)}-${++ek}`;
        }
        const yeni = await db.collection.create({
          data: { externalId: disId, slug, isActive: false },
        });
        await db.collectionTranslation.create({
          data: { collectionId: yeni.id, locale: UK, name: bilgi.ad },
        });
        kayitId = yeni.id;
      }
    }
    if (kayitId) koleksiyonEsleme.set(disId, kayitId);

    // ortam fotoğrafları koleksiyona bağlanır — her üründe tekrarlanmaz
    for (const g of bilgi.gorseller) {
      const kimlik = g.id ?? g.url;
      if (gorulenGorsel.has(kimlik)) continue;
      gorulenGorsel.add(kimlik);
      rapor.gorsel.toplamBenzersiz++;

      if (!kuru && kayitId) {
        const varMi = await db.media.findUnique({ where: { externalId: kimlik } });
        if (!varMi) {
          await db.media.create({
            data: {
              externalId: kimlik,
              collectionId: kayitId,
              url: g.url,
              alt: g.alt,
              kind: g.type ?? "catalog",
              width: g.width,
              height: g.height,
              sortOrder: g.index ?? 0,
              isExternal: true,
            },
          });
          rapor.gorsel.yeni++;
        }
      } else if (kuru) {
        rapor.gorsel.yeni++;
      }
    }
  }

  /* 4) kategoriler — CRM göndermiyor, addan tahmin
     Eksik kategori varsa açılır; var olanın adı ve sırası ELLENMEZ
     (yerel karar — panelden değiştirilebilir). */
  const KATEGORILER: [string, string][] = [
    ["sofa", "М'які меблі"],
    ["chair", "Крісла та стільці"],
    ["table", "Столи"],
    ["case", "Корпусні меблі"],
    ["bed", "Спальня"],
    ["accessory", "Аксесуари"],
  ];
  const kategoriEsleme = new Map<string, string>();
  if (!kuru) {
    for (let i = 0; i < KATEGORILER.length; i++) {
      const [kod, ad] = KATEGORILER[i];
      let k = await db.category.findUnique({ where: { slug: kod } });
      if (!k) {
        k = await db.category.create({
          data: {
            slug: kod,
            sortOrder: i,
            translations: { create: { locale: UK, name: ad } },
          },
        });
        rapor.uyarilar.push(`Yeni kategori açıldı: ${ad} (${kod})`);
      }
      kategoriEsleme.set(kod, k.id);
    }
  }

  /* 5) ürünler */
  let kategorisiz = 0;

  for (const u of gecerli) {
    const kategoriKodu = kategoriTahmin(u.name, u.collection?.name);
    if (!kategoriKodu) kategorisiz++;

    /** stok bu kimliğe yazılır — yeni üründe create sonrası dolar */
    let urunId: string | null = null;

    const mevcut = await db.product.findUnique({
      where: { externalId: u.id },
      include: { translations: { where: { locale: UK } } },
    });

    if (mevcut) {
      urunId = mevcut.id;
      rapor.urun.guncel++;
      if (mevcut.sourceActive && !u.isActive) rapor.urun.pasiflenen++;

      if (!kuru) {
        await db.product.update({
          where: { id: mevcut.id },
          data: {
            // kaynak alanları güncellenir
            basePrice: u.price,
            sourceActive: u.isActive,
            supplierId: u.supplier?.id ? tedarikciEsleme.get(u.supplier.id) : undefined,
            collectionId: koleksiyonEsleme.get(u.collection!.id),
            categoryId: kategoriKodu ? kategoriEsleme.get(kategoriKodu) : undefined,
            // isActive, isFeatured, sortOrder KASITLI OLARAK YOK — yerel karar
          },
        });
        await db.productTranslation.upsert({
          where: { productId_locale: { productId: mevcut.id, locale: UK } },
          update: { name: u.name },
          create: { productId: mevcut.id, locale: UK, name: u.name },
        });
      }
    } else {
      rapor.urun.yeni++;
      if (!kuru) {
        let slug = `${slugla(u.name)}-${u.id.toLowerCase()}`;
        if (await db.product.findUnique({ where: { slug } })) {
          slug = `${slug}-${Date.now().toString(36)}`;
        }
        const yeni = await db.product.create({
          data: {
            externalId: u.id,
            slug,
            basePrice: u.price,
            currency: u.currency ?? "UAH",
            sourceActive: u.isActive,
            isActive: yeniUrunYayinda,
            supplierId: u.supplier?.id ? tedarikciEsleme.get(u.supplier.id) : undefined,
            collectionId: koleksiyonEsleme.get(u.collection!.id),
            categoryId: kategoriKodu ? kategoriEsleme.get(kategoriKodu) : undefined,
          },
        });
        urunId = yeni.id;
        await db.productTranslation.create({
          data: { productId: yeni.id, locale: UK, name: u.name },
        });

        // ürüne ait görseller (dekupe) — koleksiyon fotoğrafları hariç
        const koleksiyonAdresleri = new Set(
          (u.collection?.images ?? []).map((g) => g.id ?? g.url)
        );
        for (const g of u.images ?? []) {
          const kimlik = g.id ?? g.url;
          if (koleksiyonAdresleri.has(kimlik)) continue;
          const varMi = await db.media.findUnique({ where: { externalId: kimlik } });
          if (varMi) continue;
          await db.media.create({
            data: {
              externalId: kimlik,
              productId: yeni.id,
              url: g.url,
              alt: g.alt,
              kind: g.type ?? "cutout",
              width: g.width,
              height: g.height,
              sortOrder: g.index ?? 0,
              isExternal: true,
            },
          });
          rapor.gorsel.yeni++;
        }
      }
    }

    /* 6) stok — hareket olarak yazılır, üzerine yazılmaz.
       Yeni üründe de çalışır: mevcut 0 sayılır, fark kadar giriş açılır. */
    if (!kuru && urunId) {
      const toplam = await db.stockMove.aggregate({
        where: { productId: urunId },
        _sum: { delta: true },
      });
      const mevcutAdet = toplam._sum.delta ?? 0;
      const fark = u.stock - mevcutAdet;
      if (fark !== 0) {
        await db.stockMove.create({
          data: {
            productId: urunId,
            delta: fark,
            reason: "SENKRON",
            reference: u.id,
            note: `katalog senkronu: ${mevcutAdet} → ${u.stock}`,
          },
        });
        rapor.stok.duzeltilen++;
      }
    }
  }

  if (kategorisiz > 0) {
    rapor.uyarilar.push(
      `${kategorisiz} ürünün kategorisi addan çıkarılamadı — panelden elle atanmalı.`
    );
  }

  rapor.sureSn = Math.round((Date.now() - basla) / 100) / 10;
  return rapor;
}
