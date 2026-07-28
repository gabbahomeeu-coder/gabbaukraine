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
