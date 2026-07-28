import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * MOD-05 · Kılavuz okuyucu
 *
 * Kılavuz kayıtları docs/moduller/ altında markdown dosyalarında tutuluyor.
 * Panel bu dosyaları okuyup gösteriyor — böylece kayıtlar hem git geçmişinde
 * hem panelde erişilebilir oluyor.
 *
 * Veritabanı kurulduğunda kayıtlar oraya da yazılacak; dosyalar kalacak
 * çünkü git üzerinden değişiklik geçmişiyle birlikte okunabilir olmaları
 * değerli.
 */

const DOCS = join(process.cwd(), "docs", "moduller");

export type KilavuzKaydi = {
  tip: string;
  baslik: string;
  tarih: string;
  saat: string;
  yazar: string;
  kunye?: string;
  once: string;
  sonra: string;
  neden?: string;
};

/** "### Düzeltme — Başlık" satırından tip ve başlığı ayırır */
function basligiCoz(satir: string) {
  const [tip, ...kalan] = satir.split("—");
  return {
    tip: tip.trim(),
    baslik: kalan.join("—").trim(),
  };
}

/** "**27.07.2026 · 16:40** · Onur + Claude · `KAT-03`" satırını çözer */
function metaCoz(satir: string) {
  const temiz = satir.replace(/\*\*/g, "").replace(/`/g, "");
  const parcalar = temiz.split("·").map((p) => p.trim());
  const kunye = parcalar.find((p) => /^[A-Z]{3}-\d{2}$/.test(p));
  return {
    tarih: parcalar[0] ?? "",
    saat: parcalar[1] ?? "",
    yazar: parcalar[2] ?? "",
    kunye,
  };
}

function alanCoz(govde: string, etiket: string) {
  const kalip = new RegExp(`\\*\\*${etiket}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n---|$)`);
  return govde.match(kalip)?.[1]?.trim();
}

function kayitlariAyikla(icerik: string): KilavuzKaydi[] {
  const govde = icerik.split("<!-- KAYITLAR -->")[1];
  if (!govde) return [];

  return govde
    .split(/^### /m)
    .slice(1)
    .map((blok) => {
      const satirlar = blok.split("\n");
      const { tip, baslik } = basligiCoz(satirlar[0] ?? "");
      const metaSatiri = satirlar.find((s) => s.includes("**") && s.includes("·")) ?? "";
      const meta = metaCoz(metaSatiri);

      return {
        tip,
        baslik,
        ...meta,
        once: alanCoz(blok, "Önce") ?? "",
        sonra: alanCoz(blok, "Sonra") ?? "",
        neden: alanCoz(blok, "Neden"),
      };
    })
    .filter((k) => k.baslik);
}

async function dosyaOku(yol: string) {
  try {
    return await readFile(yol, "utf8");
  } catch {
    return null;
  }
}

/** Bir modülün kılavuzu — alt modüllerden yükselen kayıtlar dahil */
export async function modulKilavuzu(modulKodu: string): Promise<KilavuzKaydi[]> {
  const icerik = await dosyaOku(join(DOCS, modulKodu, "README.md"));
  return icerik ? kayitlariAyikla(icerik) : [];
}

/** Tek bir alt modülün kılavuzu */
export async function altModulKilavuzu(kunye: string): Promise<KilavuzKaydi[]> {
  const modulKodu = kunye.split("-")[0];
  const icerik = await dosyaOku(join(DOCS, modulKodu, `${kunye}.md`));
  return icerik ? kayitlariAyikla(icerik) : [];
}

/** Tüm modüllerdeki son kayıtlar — panel ana sayfası için */
export async function sonKayitlar(
  modulKodlari: string[],
  adet = 6
): Promise<(KilavuzKaydi & { modulKodu: string })[]> {
  const hepsi = await Promise.all(
    modulKodlari.map(async (kod) => {
      const kayitlar = await modulKilavuzu(kod);
      return kayitlar.map((k) => ({ ...k, modulKodu: kod }));
    })
  );

  return hepsi
    .flat()
    .sort((a, b) => {
      // "28.07.2026" + "13:24" → karşılaştırılabilir metin
      const cevir = (k: KilavuzKaydi) => {
        const [g, a2, y] = (k.tarih ?? "").split(".");
        return `${y}${a2}${g}${(k.saat ?? "").replace(":", "")}`;
      };
      return cevir(b).localeCompare(cevir(a));
    })
    .slice(0, adet);
}
