#!/usr/bin/env node
/**
 * Katalog senkronu — komut satırından.
 *
 *   npm run senkron              kuru çalıştırma: hiçbir şey yazılmaz, rapor verir
 *   npm run senkron -- --yaz     YEREL veritabanına yazar
 *   npm run senkron -- --yaz --uretim   CANLI veritabanına yazar
 *
 * Hedef veritabanı her çalıştırmada ekrana basılır. Üretime yazmak
 * için `--uretim` bayrağını AÇIKÇA vermek gerekir; unutulunca yerel
 * kopyaya yazılır, canlı mağaza etkilenmez.
 */
import { config } from "dotenv";

const yaz = process.argv.includes("--yaz");
const uretim = process.argv.includes("--uretim");

// önce hedef veritabanı, sonra ortak ayarlar
config({ path: uretim ? ".env.uretim" : ".env.local", quiet: true });
if (uretim) config({ path: ".env.local", quiet: true }); // API adresi ve anahtarı

const url = process.env.CATALOG_API_URL;
const anahtar = process.env.CATALOG_API_KEY;

if (!url || !anahtar) {
  console.error("CATALOG_API_URL ve CATALOG_API_KEY .env.local içinde tanımlı olmalı.");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error(
    uretim
      ? ".env.uretim bulunamadı ya da DATABASE_URL boş."
      : ".env.local içinde DATABASE_URL tanımlı olmalı."
  );
  process.exit(1);
}

/** Parolayı göstermeden hedefi yazdır */
const hedef = (() => {
  const u = new URL(process.env.DATABASE_URL);
  return `${u.hostname}:${u.port || 5432}/${u.pathname.slice(1)}`;
})();

/* Sunucuda .env.local zaten üretim veritabanını gösteriyor; orada --uretim
   bayrağı gerekmez. Etiketin "yerel kopya" demesi yanıltıcı olurdu. */
const uretimeYaziliyor = uretim || process.env.NODE_ENV === "production";

if (uretimeYaziliyor && yaz) {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  ÜRETİM VERİTABANINA YAZILIYOR — CANLI MAĞAZA        ║");
  console.log("╚══════════════════════════════════════════════════════╝");
}
console.log(`hedef veritabanı: ${hedef}  ${uretimeYaziliyor ? "(ÜRETİM)" : "(yerel kopya)"}\n`);

const { katalogSenkronu } = await import("../lib/sync/katalog.ts");

console.log(yaz ? "GERÇEK ÇALIŞTIRMA — veritabanına yazılıyor\n" : "KURU ÇALIŞTIRMA — hiçbir şey yazılmıyor\n");

const r = await katalogSenkronu({ temelUrl: url, anahtar, kuru: !yaz });

const satir = (etiket, deger) => console.log(`  ${etiket.padEnd(26)} ${deger}`);
console.log("─".repeat(48));
satir("okunan ürün", r.okunan);
satir("tedarikçi", `${r.tedarikci.yeni} yeni · ${r.tedarikci.guncel} mevcut`);
satir("koleksiyon", `${r.koleksiyon.yeni} yeni · ${r.koleksiyon.guncel} mevcut`);
satir("ürün", `${r.urun.yeni} yeni · ${r.urun.guncel} güncel · ${r.urun.pasiflenen} pasifleşen`);
satir("görsel (benzersiz)", `${r.gorsel.toplamBenzersiz} · ${r.gorsel.yeni} yeni`);
satir("stok düzeltmesi", r.stok.duzeltilen);
satir("süre", `${r.sureSn} sn`);
console.log("─".repeat(48));

if (r.reddedilen.length) {
  console.log(`\nBEKÇİ ${r.reddedilen.length} KAYDI REDDETTİ`);
  for (const x of r.reddedilen.slice(0, 15)) console.log(`  ✗ ${x.urun} — ${x.sebep}`);
  if (r.reddedilen.length > 15) console.log(`  … ve ${r.reddedilen.length - 15} tane daha`);
}
if (r.uyarilar.length) {
  console.log("\nUYARILAR");
  for (const u of r.uyarilar) console.log(`  ! ${u}`);
}
process.exit(0);
