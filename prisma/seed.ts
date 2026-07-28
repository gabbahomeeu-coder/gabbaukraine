/**
 * Veritabanı tohumlama.
 *
 * 1) Diller
 * 2) Modül kayıt defteri → veritabanı (MOD-01)
 * 3) Mevcut katalog verisi → veritabanı (katalog API'si gelene kadar)
 * 4) Kumaş kataloğu (KAT-08)
 *
 * Tekrar çalıştırılabilir: var olan kayıtları günceller, silmez.
 *   npm run db:seed
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";

import { MODULES } from "../lib/modules/registry.ts";
import { products, collections } from "../lib/catalog.ts";
import { fabrics, fabricGroups, getFabricsForProduct } from "../lib/fabrics.ts";

loadEnv({ path: ".env.local", quiet: true });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const UK = "uk";

async function diller() {
  const liste = [
    { code: "uk", name: "Українська", isDefault: true, isActive: true, sortOrder: 1 },
    { code: "ru", name: "Русский", isDefault: false, isActive: false, sortOrder: 2 },
    { code: "en", name: "English", isDefault: false, isActive: false, sortOrder: 3 },
  ];
  for (const l of liste) {
    await db.locale.upsert({ where: { code: l.code }, update: l, create: l });
  }
  return liste.length;
}

async function modulKayitlari() {
  let altToplam = 0;

  for (const [i, m] of MODULES.entries()) {
    await db.module.upsert({
      where: { code: m.code },
      update: {
        name: m.name,
        layer: m.layer === "PLATFORM" ? "PLATFORM" : "IS",
        isCore: m.isCore,
        sortOrder: i,
      },
      create: {
        code: m.code,
        name: m.name,
        layer: m.layer === "PLATFORM" ? "PLATFORM" : "IS",
        isCore: m.isCore,
        isEnabled: true,
        sortOrder: i,
      },
    });

    for (const [j, s] of m.subModules.entries()) {
      await db.subModule.upsert({
        where: { code: s.code },
        update: {
          name: s.name,
          responsibility: s.responsibility,
          moduleCode: m.code,
          sortOrder: j,
        },
        create: {
          code: s.code,
          moduleCode: m.code,
          name: s.name,
          responsibility: s.responsibility,
          isEnabled: true,
          sortOrder: j,
        },
      });
      altToplam++;
    }
  }
  return { modul: MODULES.length, alt: altToplam };
}

async function yoneticiRolu() {
  await db.role.upsert({
    where: { code: "admin" },
    update: {},
    create: {
      code: "admin",
      name: "Yönetici",
      permissions: { "*": ["oku", "yaz"] },
    },
  });
}

async function katalog() {
  // koleksiyonlar
  for (const [i, c] of collections.entries()) {
    const kayit = await db.collection.upsert({
      where: { slug: c.slug },
      update: { brand: c.brand, image: c.image, sortOrder: i },
      create: {
        slug: c.slug,
        brand: c.brand,
        image: c.image,
        sortOrder: i,
        isActive: true,
      },
    });
    await db.collectionTranslation.upsert({
      where: { collectionId_locale: { collectionId: kayit.id, locale: UK } },
      update: { name: c.name, description: c.description },
      create: {
        collectionId: kayit.id,
        locale: UK,
        name: c.name,
        description: c.description,
      },
    });
  }

  // kategoriler
  const kategoriAdlari: Record<string, string> = {
    sofa: "М'які меблі",
    chair: "Крісла та стільці",
    table: "Столи",
    case: "Корпусні меблі",
    bed: "Спальня",
  };
  for (const [i, [slug, ad]] of Object.entries(kategoriAdlari).entries()) {
    const kayit = await db.category.upsert({
      where: { slug },
      update: { sortOrder: i },
      create: { slug, sortOrder: i, isActive: true },
    });
    await db.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: kayit.id, locale: UK } },
      update: { name: ad },
      create: { categoryId: kayit.id, locale: UK, name: ad },
    });
  }

  // ürünler
  let varyantSayisi = 0;
  for (const [i, p] of products.entries()) {
    const koleksiyon = await db.collection.findUnique({
      where: { slug: p.collectionSlug },
    });
    const kategori = await db.category.findUnique({ where: { slug: p.category } });

    const urun = await db.product.upsert({
      where: { slug: p.slug },
      update: {
        basePrice: p.price,
        collectionId: koleksiyon?.id,
        categoryId: kategori?.id,
        widthCm: p.widthCm,
        depthCm: p.depthCm,
        heightCm: p.heightCm,
        sortOrder: i,
      },
      create: {
        slug: p.slug,
        basePrice: p.price,
        currency: "UAH",
        collectionId: koleksiyon?.id,
        categoryId: kategori?.id,
        widthCm: p.widthCm,
        depthCm: p.depthCm,
        heightCm: p.heightCm,
        sortOrder: i,
        isActive: true,
      },
    });

    await db.productTranslation.upsert({
      where: { productId_locale: { productId: urun.id, locale: UK } },
      update: {
        name: p.name,
        description: p.description,
        materials: p.materials,
      },
      create: {
        productId: urun.id,
        locale: UK,
        name: p.name,
        description: p.description,
        materials: p.materials,
      },
    });

    // görsel
    const mevcutMedya = await db.media.findFirst({
      where: { productId: urun.id, url: p.image },
    });
    if (!mevcutMedya) {
      await db.media.create({
        data: { productId: urun.id, url: p.image, alt: p.name, isExternal: false },
      });
    }

    // ölçü varyantları
    for (const [j, v] of (p.variants ?? []).entries()) {
      const varyant = await db.variant.upsert({
        where: { sku: v.id },
        update: {
          label: v.label,
          price: v.price,
          widthCm: v.widthCm,
          depthCm: v.depthCm,
          heightCm: v.heightCm,
          sortOrder: j,
        },
        create: {
          productId: urun.id,
          sku: v.id,
          label: v.label,
          price: v.price,
          widthCm: v.widthCm,
          depthCm: v.depthCm,
          heightCm: v.heightCm,
          isDefault: j === 0,
          sortOrder: j,
        },
      });
      varyantSayisi++;

      // stok hareketi — mevcut adet yoksa başlangıç girişi
      const hareketVar = await db.stockMove.findFirst({
        where: { variantId: varyant.id, reason: "SENKRON" },
      });
      if (!hareketVar && v.stock > 0) {
        await db.stockMove.create({
          data: {
            productId: urun.id,
            variantId: varyant.id,
            delta: v.stock,
            reason: "SENKRON",
            note: "başlangıç stoğu",
          },
        });
      }
    }
  }

  return { koleksiyon: collections.length, urun: products.length, varyant: varyantSayisi };
}

async function kumaslar() {
  for (const [i, g] of fabricGroups.entries()) {
    const grup = await db.fabricGroup.upsert({
      where: { code: g.code },
      update: { sortOrder: i },
      create: { code: g.code, sortOrder: i, isActive: true },
    });
    await db.fabricGroupTranslation.upsert({
      where: { groupId_locale: { groupId: grup.id, locale: UK } },
      update: { name: g.name },
      create: { groupId: grup.id, locale: UK, name: g.name },
    });
  }

  for (const [i, f] of fabrics.entries()) {
    const grup = await db.fabricGroup.findUnique({ where: { code: f.groupCode } });
    if (!grup) continue;

    const kumas = await db.fabric.upsert({
      where: { code: f.code },
      update: {
        groupId: grup.id,
        priceDelta: f.priceDelta,
        extraLeadDays: f.extraLeadDays,
        swatchUrl: f.swatchUrl,
        sortOrder: i,
        isActive: f.inStock,
      },
      create: {
        code: f.code,
        groupId: grup.id,
        priceDelta: f.priceDelta,
        extraLeadDays: f.extraLeadDays,
        swatchUrl: f.swatchUrl,
        sortOrder: i,
        isActive: f.inStock,
      },
    });
    await db.fabricTranslation.upsert({
      where: { fabricId_locale: { fabricId: kumas.id, locale: UK } },
      update: { name: f.name, composition: f.composition },
      create: {
        fabricId: kumas.id,
        locale: UK,
        name: f.name,
        composition: f.composition,
      },
    });
  }

  // ürün–kumaş eşleşmeleri
  let eslesme = 0;
  for (const p of products) {
    const urun = await db.product.findUnique({ where: { slug: p.slug } });
    if (!urun) continue;
    const uygun = getFabricsForProduct(p.slug);
    for (const [i, f] of uygun.entries()) {
      const kumas = await db.fabric.findUnique({ where: { code: f.code } });
      if (!kumas) continue;
      await db.productFabric.upsert({
        where: { productId_fabricId: { productId: urun.id, fabricId: kumas.id } },
        update: { sortOrder: i },
        create: {
          productId: urun.id,
          fabricId: kumas.id,
          isDefault: i === 0,
          sortOrder: i,
        },
      });
      eslesme++;
    }
  }

  return { grup: fabricGroups.length, kumas: fabrics.length, eslesme };
}

async function main() {
  console.log("Tohumlama başlıyor…\n");

  const d = await diller();
  console.log(`  diller           ${d}`);

  const m = await modulKayitlari();
  console.log(`  modüller         ${m.modul} modül, ${m.alt} alt modül`);

  await yoneticiRolu();
  console.log(`  yönetici rolü    hazır`);

  const k = await katalog();
  console.log(
    `  katalog          ${k.koleksiyon} koleksiyon, ${k.urun} ürün, ${k.varyant} ölçü varyantı`
  );

  const f = await kumaslar();
  console.log(
    `  kumaşlar         ${f.grup} grup, ${f.kumas} kumaş, ${f.eslesme} ürün eşleşmesi`
  );

  console.log("\nTamam.");
}

main()
  .catch((e) => {
    console.error("Tohumlama hatası:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
