"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";

/**
 * KAT-02 · Koleksiyon kapak görseli seçimi
 *
 * Kapak iki ayrı alanda tutuluyor:
 *   image        → geniş ekran (yatay fotoğraf uygun)
 *   mobileImage  → telefon (dikey fotoğraf uygun); boşsa `image` kullanılır
 *
 * Seçim bizim tarafımızda kalır — katalog senkronu bu alanları EZMEZ.
 */

export type Sonuc = { ok: true; mesaj: string } | { ok: false; hata: string };

export async function kapakSec(
  slug: string,
  url: string,
  hedef: "genis" | "mobil"
): Promise<Sonuc> {
  const koleksiyon = await db.collection.findUnique({ where: { slug } });
  if (!koleksiyon) return { ok: false, hata: "Koleksiyon bulunamadı." };

  const once = { image: koleksiyon.image, mobileImage: koleksiyon.mobileImage };
  const veri = hedef === "mobil" ? { mobileImage: url } : { image: url };

  await db.$transaction(async (tx) => {
    await tx.collection.update({ where: { slug }, data: veri });
    await tx.auditLog.create({
      data: {
        action: hedef === "mobil" ? "koleksiyon.mobil_kapak" : "koleksiyon.kapak",
        entity: "Collection",
        entityId: koleksiyon.id,
        before: once,
        after: { ...once, ...veri },
      },
    });
  });

  revalidatePath("/collections");
  revalidatePath(`/collections/${slug}`);
  revalidatePath("/");
  revalidatePath(`/admin/koleksiyonlar/${slug}`);

  return {
    ok: true,
    mesaj: hedef === "mobil" ? "Telefon kapağı güncellendi." : "Kapak güncellendi.",
  };
}

export async function mobilKapakTemizle(slug: string): Promise<Sonuc> {
  const koleksiyon = await db.collection.findUnique({ where: { slug } });
  if (!koleksiyon) return { ok: false, hata: "Koleksiyon bulunamadı." };

  await db.collection.update({ where: { slug }, data: { mobileImage: null } });

  revalidatePath("/collections");
  revalidatePath(`/collections/${slug}`);
  revalidatePath(`/admin/koleksiyonlar/${slug}`);

  return {
    ok: true,
    mesaj: "Telefon kapağı kaldırıldı, geniş ekran kapağı kullanılacak.",
  };
}

/**
 * KAT-02 · Koleksiyon yayın anahtarı
 *
 * Senkron koleksiyonları yayına KAPALI açar; hangisinin siteye çıkacağı
 * bizim kararımız. Kapaksız koleksiyon yayına alınamaz: kart görselsiz
 * kalır, mağaza kalitesiz görünür.
 */
export async function koleksiyonYayinDegistir(
  slug: string,
  yayinda: boolean
): Promise<Sonuc> {
  const mevcut = await db.collection.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale: "uk" } },
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  if (!mevcut) return { ok: false, hata: "Koleksiyon bulunamadı." };

  if (yayinda && !mevcut.image) {
    return { ok: false, hata: "Önce kapak görseli seç — kartı boş çıkar." };
  }

  if (mevcut.isActive === yayinda) {
    return { ok: true, mesaj: yayinda ? "Zaten yayında." : "Zaten kapalı." };
  }

  await db.$transaction(async (tx) => {
    await tx.collection.update({ where: { slug }, data: { isActive: yayinda } });
    await tx.auditLog.create({
      data: {
        action: yayinda ? "koleksiyon.yayinla" : "koleksiyon.kapat",
        entity: "Collection",
        entityId: mevcut.id,
        before: { isActive: mevcut.isActive },
        after: { isActive: yayinda },
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/collections/${slug}`);
  revalidatePath("/admin/koleksiyonlar");
  revalidatePath(`/admin/koleksiyonlar/${slug}`);

  const ad = mevcut.translations[0]?.name ?? slug;
  const uyari =
    yayinda && mevcut._count.products === 0
      ? " Ancak içinde yayında ürün yok — sayfa boş görünür."
      : "";

  return {
    ok: true,
    mesaj: yayinda
      ? `${ad} yayına alındı.${uyari}`
      : `${ad} yayından kaldırıldı.`,
  };
}
