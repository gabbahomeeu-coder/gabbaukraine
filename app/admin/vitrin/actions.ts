"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";

/**
 * Vitrin düzeni — ön yüzde neyin, hangi sırayla görüneceği.
 *
 * Sıra bilgisi `sortOrder` alanında tutulur ve YEREL veridir:
 * katalog senkronu bu alanları ezmez.
 */

export type Sonuc = { ok: boolean; mesaj: string };

/** Ortak: id listesini sıraya çevirip kaydet */
async function siraYaz(
  tablo: "product" | "collection" | "category" | "media",
  idler: string[]
) {
  await db.$transaction(
    idler.map((id, i) =>
      // @ts-expect-error — dört tabloda da sortOrder var
      db[tablo].update({ where: { id }, data: { sortOrder: i } })
    )
  );
}

/* ── ana sayfa vitrini ── */

export async function vitrinSirala(idler: string[]): Promise<Sonuc> {
  await siraYaz("product", idler);
  revalidatePath("/");
  revalidatePath("/admin/vitrin");
  return { ok: true, mesaj: "Vitrin sırası kaydedildi." };
}

export async function vitrineEkleCikar(
  urunId: string,
  oneCikar: boolean
): Promise<Sonuc> {
  const urun = await db.product.findUnique({
    where: { id: urunId },
    include: { translations: { where: { locale: "uk" } } },
  });
  if (!urun) return { ok: false, mesaj: "Ürün bulunamadı." };

  await db.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: urunId },
      data: { isFeatured: oneCikar },
    });
    await tx.auditLog.create({
      data: {
        action: oneCikar ? "vitrin.ekle" : "vitrin.cikar",
        entity: "Product",
        entityId: urunId,
        before: { isFeatured: urun.isFeatured },
        after: { isFeatured: oneCikar },
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/admin/vitrin");
  return {
    ok: true,
    mesaj: oneCikar
      ? `${urun.translations[0]?.name ?? "Ürün"} vitrine eklendi.`
      : `${urun.translations[0]?.name ?? "Ürün"} vitrinden çıkarıldı.`,
  };
}

/* ── koleksiyon ve kategori ── */

export async function koleksiyonSirala(idler: string[]): Promise<Sonuc> {
  await siraYaz("collection", idler);
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/admin/vitrin");
  return { ok: true, mesaj: "Koleksiyon sırası kaydedildi." };
}

export async function kategoriSirala(idler: string[]): Promise<Sonuc> {
  await siraYaz("category", idler);
  revalidatePath("/");
  revalidatePath("/admin/vitrin");
  return { ok: true, mesaj: "Kategori sırası kaydedildi." };
}

/* ── ürün galerisi ── */

export async function galeriSirala(
  urunSlug: string,
  idler: string[]
): Promise<Sonuc> {
  await siraYaz("media", idler);
  revalidatePath(`/products/${urunSlug}`);
  revalidatePath("/");
  revalidatePath(`/admin/urunler/${urunSlug}`);
  return { ok: true, mesaj: "Görsel sırası kaydedildi. İlk görsel kapak olur." };
}
