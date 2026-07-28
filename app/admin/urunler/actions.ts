"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";

/**
 * KAT-01 · Ürün düzenleme
 *
 * Her kayıt denetim günlüğüne (YON-03) öncesi/sonrasıyla yazılır.
 * Kaydedince ilgili sayfalar tazelenir — site anında güncellenir.
 */

export type KayitSonucu = { ok: true; mesaj: string } | { ok: false; hata: string };

export async function urunKaydet(
  slug: string,
  form: FormData
): Promise<KayitSonucu> {
  const mevcut = await db.product.findUnique({
    where: { slug },
    include: { translations: { where: { locale: "uk" } } },
  });
  if (!mevcut) return { ok: false, hata: "Ürün bulunamadı." };

  const fiyat = Number(form.get("basePrice"));
  if (!Number.isFinite(fiyat) || fiyat <= 0) {
    return { ok: false, hata: "Fiyat sıfırdan büyük bir sayı olmalı." };
  }

  const ad = String(form.get("name") ?? "").trim();
  if (!ad) return { ok: false, hata: "Ürün adı boş olamaz." };

  const yeni = {
    basePrice: fiyat,
    isFeatured: form.get("isFeatured") === "on",
    isActive: form.get("isActive") === "on",
    sortOrder: Number(form.get("sortOrder") ?? 0) || 0,
  };

  const yeniCeviri = {
    name: ad,
    description: String(form.get("description") ?? "").trim(),
    materials: String(form.get("materials") ?? "").trim(),
    seoTitle: String(form.get("seoTitle") ?? "").trim() || null,
    seoDesc: String(form.get("seoDesc") ?? "").trim() || null,
  };

  const eskiCeviri = mevcut.translations[0];

  await db.$transaction(async (tx) => {
    await tx.product.update({ where: { slug }, data: yeni });

    await tx.productTranslation.upsert({
      where: { productId_locale: { productId: mevcut.id, locale: "uk" } },
      update: yeniCeviri,
      create: { productId: mevcut.id, locale: "uk", ...yeniCeviri },
    });

    await tx.auditLog.create({
      data: {
        action: "urun.guncelle",
        entity: "Product",
        entityId: mevcut.id,
        before: {
          basePrice: Number(mevcut.basePrice),
          isFeatured: mevcut.isFeatured,
          isActive: mevcut.isActive,
          sortOrder: mevcut.sortOrder,
          name: eskiCeviri?.name ?? null,
          description: eskiCeviri?.description ?? null,
        },
        after: { ...yeni, name: yeniCeviri.name, description: yeniCeviri.description },
      },
    });
  });

  // site anında güncellensin
  revalidatePath("/");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/collections");
  if (mevcut.collectionId) {
    const kol = await db.collection.findUnique({ where: { id: mevcut.collectionId } });
    if (kol) revalidatePath(`/collections/${kol.slug}`);
  }
  revalidatePath("/admin/urunler");

  return { ok: true, mesaj: "Kaydedildi. Site güncellendi." };
}

/** KAT-03 · Stok düzeltmesi — hareket olarak yazılır, üzerine yazılmaz */
export async function stokDuzelt(
  varyantId: string,
  yeniAdet: number,
  not: string
): Promise<KayitSonucu> {
  const varyant = await db.variant.findUnique({ where: { id: varyantId } });
  if (!varyant) return { ok: false, hata: "Varyant bulunamadı." };

  if (!Number.isInteger(yeniAdet) || yeniAdet < 0) {
    return { ok: false, hata: "Adet sıfır veya daha büyük bir tam sayı olmalı." };
  }

  const toplam = await db.stockMove.aggregate({
    where: { variantId: varyantId },
    _sum: { delta: true },
  });
  const mevcutAdet = toplam._sum.delta ?? 0;
  const fark = yeniAdet - mevcutAdet;

  if (fark === 0) return { ok: true, mesaj: "Adet zaten aynı, değişiklik yapılmadı." };

  await db.stockMove.create({
    data: {
      productId: varyant.productId,
      variantId: varyantId,
      delta: fark,
      reason: "SAYIM",
      note: not || `panelden düzeltme: ${mevcutAdet} → ${yeniAdet}`,
    },
  });

  const urun = await db.product.findUnique({ where: { id: varyant.productId } });
  if (urun) {
    revalidatePath(`/products/${urun.slug}`);
    revalidatePath("/");
  }
  revalidatePath("/admin/urunler");

  return { ok: true, mesaj: `Stok ${mevcutAdet} → ${yeniAdet} olarak düzeltildi.` };
}

/**
 * KAT-01 · Satır içi yayın anahtarı
 *
 * Listeden tek tıkla aç/kapa. Ürün sayfasına girmeye gerek yok.
 * `sourceActive` (kaynağın satış durumu) ayrı bir bilgidir, buradan
 * değişmez — bu yalnızca BİZİM yayın kararımız.
 */
export async function yayinDegistir(
  slug: string,
  yayinda: boolean
): Promise<KayitSonucu> {
  const mevcut = await db.product.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale: "uk" } },
      collection: true,
      _count: { select: { media: true } },
    },
  });
  if (!mevcut) return { ok: false, hata: "Ürün bulunamadı." };

  if (yayinda && mevcut._count.media === 0) {
    return {
      ok: false,
      hata: "Bu ürünün hiç görseli yok — yayına açılırsa kartı boş çıkar.",
    };
  }

  if (mevcut.isActive === yayinda) {
    return { ok: true, mesaj: yayinda ? "Zaten yayında." : "Zaten kapalı." };
  }

  await db.$transaction(async (tx) => {
    await tx.product.update({ where: { slug }, data: { isActive: yayinda } });
    await tx.auditLog.create({
      data: {
        action: yayinda ? "urun.yayinla" : "urun.kapat",
        entity: "Product",
        entityId: mevcut.id,
        before: { isActive: mevcut.isActive },
        after: { isActive: yayinda },
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/products/${slug}`);
  if (mevcut.collection) revalidatePath(`/collections/${mevcut.collection.slug}`);
  revalidatePath("/admin/urunler");
  revalidatePath("/admin/vitrin");

  const ad = mevcut.translations[0]?.name ?? "Ürün";
  return {
    ok: true,
    mesaj: yayinda ? `${ad} yayına alındı.` : `${ad} yayından kaldırıldı.`,
  };
}
