#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════
 * KILAVUZ ARACI — MOD-05
 *
 * Her alt modülün kendi kılavuzu vardır. Yapılan her düzeltme ve
 * güncelleme oraya tarih, saat, yazar ve ÖNCE/SONRA ile yazılır.
 * Aynı kayıt özet halinde ÜST modülün kılavuzuna yükselir.
 *
 * Kullanım:
 *
 *   node scripts/kilavuz.mjs uret
 *     Kayıt defterinden docs/moduller/ iskeletini üretir.
 *     Var olan kılavuzlara dokunmaz, sadece eksikleri tamamlar.
 *
 *   node scripts/kilavuz.mjs ekle KAT-03 \
 *     --tip duzeltme \
 *     --baslik "Aynı ödeme onayı iki kez gelince stok iki kez düşüyordu" \
 *     --once "Olay her geldiğinde stok düşürülüyordu." \
 *     --sonra "Bekçi olay kimliğini kaydediyor, tekrar işlenmiyor." \
 *     --neden "Sağlayıcı onayı birden fazla kez gönderebiliyor." \
 *     --yazar "Onur + Claude"
 *
 *   node scripts/kilavuz.mjs liste [KUNYE]
 *     Son kayıtları gösterir.
 * ══════════════════════════════════════════════════════════════
 */

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs", "moduller");

const TIPLER = {
  ekleme: "Ekleme",
  duzeltme: "Düzeltme",
  degisiklik: "Değişiklik",
  kaldirma: "Kaldırma",
};

async function registry() {
  return import(join(ROOT, "lib", "modules", "registry.ts"));
}

async function varMi(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function zaman(d = new Date()) {
  const iki = (n) => String(n).padStart(2, "0");
  return {
    tarih: `${iki(d.getDate())}.${iki(d.getMonth() + 1)}.${d.getFullYear()}`,
    saat: `${iki(d.getHours())}:${iki(d.getMinutes())}`,
  };
}

/* ─────────────────────────── İSKELET ─────────────────────────── */

function modulBasligi(m) {
  const katman = m.layer === "PLATFORM" ? "Platform katmanı" : "İş katmanı";
  const cekirdek = m.isCore ? "çekirdek — kapatılamaz" : "kapatılabilir";
  const bagimlilik = m.dependsOn.length ? m.dependsOn.join(", ") : "yok";

  const satirlar = m.subModules
    .map((s) => `| \`${s.code}\` | ${s.name} | ${s.responsibility} |`)
    .join("\n");

  return `# ${m.code} · ${m.name}

> ${m.summary}

- **Katman:** ${katman}
- **Durum:** ${cekirdek}
- **Bağımlı olduğu modüller:** ${bagimlilik}

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
${satirlar}

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->
`;
}

function altModulBasligi(s, m) {
  const yayin = s.emits?.length ? s.emits.map((e) => `\`${e}\``).join(", ") : "—";
  const dinle = s.listens?.length ? s.listens.map((e) => `\`${e}\``).join(", ") : "—";

  return `# ${s.code} · ${s.name}

> ${s.responsibility}

- **Üst modül:** [${m.code} · ${m.name}](./README.md)
- **Yayınladığı olaylar:** ${yayin}
- **Dinlediği olaylar:** ${dinle}

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

\`\`\`bash
node scripts/kilavuz.mjs ekle ${s.code} --tip duzeltme --baslik "..." --once "..." --sonra "..."
\`\`\`

<!-- KAYITLAR -->
`;
}

async function uret() {
  const { MODULES } = await registry();
  let yeni = 0;
  let mevcut = 0;

  for (const m of MODULES) {
    const klasor = join(DOCS, m.code);
    await mkdir(klasor, { recursive: true });

    const readme = join(klasor, "README.md");
    if (await varMi(readme)) {
      mevcut++;
    } else {
      await writeFile(readme, modulBasligi(m), "utf8");
      yeni++;
    }

    for (const s of m.subModules) {
      const dosya = join(klasor, `${s.code}.md`);
      if (await varMi(dosya)) {
        mevcut++;
      } else {
        await writeFile(dosya, altModulBasligi(s, m), "utf8");
        yeni++;
      }
    }
  }

  console.log(`Kılavuz iskeleti hazır: ${yeni} yeni dosya, ${mevcut} dosyaya dokunulmadı.`);
  console.log(`Konum: docs/moduller/`);
}

/* ───────────────────────────── EKLE ───────────────────────────── */

function argOku(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const anahtar = argv[i].slice(2);
      const deger = argv[i + 1];
      if (deger && !deger.startsWith("--")) {
        out[anahtar] = deger;
        i++;
      } else {
        out[anahtar] = true;
      }
    }
  }
  return out;
}

function kayitMetni({ tip, baslik, once, sonra, neden, yazar, tarih, saat, kunye }) {
  const etiket = TIPLER[tip] ?? tip;
  const kunyeSatiri = kunye ? ` · \`${kunye}\`` : "";
  return `
### ${etiket} — ${baslik}

**${tarih} · ${saat}** · ${yazar}${kunyeSatiri}

**Önce:** ${once}

**Sonra:** ${sonra}
${neden ? `\n**Neden:** ${neden}\n` : ""}
---
`;
}

async function kayitEkle(dosya, metin) {
  const icerik = await readFile(dosya, "utf8");
  const isaret = "<!-- KAYITLAR -->";
  if (!icerik.includes(isaret)) {
    await writeFile(dosya, icerik + "\n" + isaret + "\n" + metin, "utf8");
    return;
  }
  // en yeni kayıt en üstte
  await writeFile(dosya, icerik.replace(isaret, isaret + "\n" + metin), "utf8");
}

async function ekle(kunye, args) {
  const { SUB_MODULE_MAP, MODULE_MAP } = await registry();

  const alt = SUB_MODULE_MAP.get(kunye);
  const ust = alt ? MODULE_MAP.get(alt.moduleCode) : MODULE_MAP.get(kunye);

  if (!alt && !ust) {
    console.error(`Künye bulunamadı: ${kunye}`);
    console.error(`Örnek: KAT-03 (alt modül) veya KAT (modül)`);
    process.exit(1);
  }

  const eksik = ["baslik", "once", "sonra"].filter((k) => !args[k]);
  if (eksik.length) {
    console.error(`Eksik alan: ${eksik.map((e) => "--" + e).join(", ")}`);
    process.exit(1);
  }

  const tip = String(args.tip ?? "degisiklik").toLowerCase();
  if (!TIPLER[tip]) {
    console.error(`Geçersiz tip: ${tip}. Seçenekler: ${Object.keys(TIPLER).join(", ")}`);
    process.exit(1);
  }

  const { tarih, saat } = zaman();
  const yazar = args.yazar ?? "Onur + Claude";
  const ortak = {
    tip,
    baslik: args.baslik,
    once: args.once,
    sonra: args.sonra,
    neden: args.neden,
    yazar,
    tarih,
    saat,
  };

  const modulKodu = alt ? alt.moduleCode : ust.code;
  const klasor = join(DOCS, modulKodu);

  if (!(await varMi(klasor))) {
    console.error(`Kılavuz iskeleti yok. Önce: node scripts/kilavuz.mjs uret`);
    process.exit(1);
  }

  // 1) alt modül kılavuzuna tam kayıt
  if (alt) {
    await kayitEkle(join(klasor, `${kunye}.md`), kayitMetni(ortak));
  }

  // 2) üst modül kılavuzuna aynı kayıt, künye etiketiyle
  await kayitEkle(
    join(klasor, "README.md"),
    kayitMetni({ ...ortak, kunye: alt ? kunye : undefined })
  );

  console.log(`Kılavuza yazıldı: ${kunye}`);
  if (alt) console.log(`  docs/moduller/${modulKodu}/${kunye}.md`);
  console.log(`  docs/moduller/${modulKodu}/README.md  (üst modül özeti)`);
}

/* ──────────────────────────── LİSTE ──────────────────────────── */

async function liste(kunye) {
  const { MODULES, SUB_MODULE_MAP, MODULE_MAP } = await registry();
  const hedefler = [];

  if (kunye) {
    const alt = SUB_MODULE_MAP.get(kunye);
    const kod = alt ? alt.moduleCode : kunye;
    if (!MODULE_MAP.has(kod)) {
      console.error(`Künye bulunamadı: ${kunye}`);
      process.exit(1);
    }
    hedefler.push(alt ? join(DOCS, kod, `${kunye}.md`) : join(DOCS, kod, "README.md"));
  } else {
    for (const m of MODULES) hedefler.push(join(DOCS, m.code, "README.md"));
  }

  for (const dosya of hedefler) {
    if (!(await varMi(dosya))) continue;
    const icerik = await readFile(dosya, "utf8");
    const govde = icerik.split("<!-- KAYITLAR -->")[1] ?? "";
    const kayitlar = govde.split("### ").filter((k) => k.trim());
    if (!kayitlar.length) continue;
    console.log(`\n── ${dosya.replace(ROOT + "/", "")} · ${kayitlar.length} kayıt`);
    for (const k of kayitlar.slice(0, 3)) {
      const satirlar = k.split("\n").filter((s) => s.trim());
      console.log(`   ${satirlar[0]}`);
      if (satirlar[1]) console.log(`   ${satirlar[1].replace(/\*\*/g, "")}`);
    }
  }
}

/* ──────────────────────────── GİRİŞ ──────────────────────────── */

const [, , komut, ...kalan] = process.argv;

switch (komut) {
  case "uret":
    await uret();
    break;
  case "ekle": {
    const kunye = kalan[0];
    if (!kunye || kunye.startsWith("--")) {
      console.error("Künye gerekli. Örnek: node scripts/kilavuz.mjs ekle KAT-03 --tip ...");
      process.exit(1);
    }
    await ekle(kunye.toUpperCase(), argOku(kalan.slice(1)));
    break;
  }
  case "liste":
    await liste(kalan[0]?.toUpperCase());
    break;
  default:
    console.log(`Kılavuz aracı — MOD-05

  node scripts/kilavuz.mjs uret          iskeleti üretir
  node scripts/kilavuz.mjs ekle <KÜNYE>  değişiklik kaydı ekler
  node scripts/kilavuz.mjs liste [KÜNYE] son kayıtları gösterir
`);
}
