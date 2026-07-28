# CLAUDE.md

Bu dosya, Claude Code'a (claude.ai/code) bu depoda çalışırken yol gösterir.

## Proje

**GABBA Ukraine** — premium mobilya markasının e-ticaret sitesi. Next.js 16 (App Router),
TypeScript, CSS Modules. Site dili **Ukraynaca**, para birimi ₴ (hryvnia).

Trafik ağırlıklı olarak **Instagram/Meta reklamlarından mobil cihazlarla** geliyor.
Bu yüzden her sayfa mobil öncelikli tasarlanır ve dönüşüme (WhatsApp/telefon/sipariş)
odaklanır.

### Hedef

Bu site, şu an `www.gabbaukraine.com` adresinde çalışan **Shopify mağazasının yerini
alacak**. Yani nihai kapsam bir vitrin değil, tam e-ticaret: sepet, ödeme, stok,
sipariş yönetimi. Şu an sipariş akışı WhatsApp üzerinden ilerliyor.

## Komutlar

```bash
npm run dev      # geliştirme sunucusu (localhost:3000)
npm run build    # üretim derlemesi — değişiklikten sonra mutlaka çalıştır
npm start        # üretim sunucusu
npm run lint     # eslint
```

Mobil görünümü gerçek telefonda test etmek için sunucuyu ağa aç:
`npx next start -H 0.0.0.0` → `http://<yerel-ip>:3000`

## Mimari

```
app/
├── layout.tsx            # fontlar (Playfair + Manrope), metadata, GA + Meta Pixel
├── page.tsx              # ana sayfa — SERVER component: JSON-LD + günlük kampanya
├── home-client.tsx       # ana sayfa — CLIENT component: etkileşim katmanı
├── page.module.css       # ana sayfa stilleri (mobil öncelikli)
├── globals.css           # CSS değişkenleri: renk, tipografi, --bar-h
├── collections/          # koleksiyon listesi + [slug] detay
├── products/[slug]/      # ürün detay
├── blog/ about/ contact/ faq/
├── api/daily-deals/      # günlük kampanya uç noktası
├── sitemap.ts robots.ts
components/
├── json-ld.tsx           # Organization, Product, LocalBusiness, FAQ, Breadcrumb şemaları
└── analytics.tsx         # GA4 + Meta Pixel (env değişkeniyle aktifleşir)
lib/
├── catalog.ts            # ürün + koleksiyon verisi (CRM bağlanınca API'ye dönecek)
├── daily-deals.ts        # her gün 70.000 ₴ altı 3 ürüne %20 indirim, tarih tohumlu
└── site.ts               # iletişim, şubeler, kategoriler, yorumlar — tek kaynak
```

**Sunucu/istemci ayrımı:** Sayfanın kendisi server component olur (JSON-LD, veri
çekme, `revalidate`), etkileşim gerektiren kısım ayrı bir client component'e taşınır.
Ana sayfa bu deseni izler — yeni sayfalarda da aynısını uygula.

## Tasarım sistemi

Ana sayfa tasarımı **27 Temmuz 2026'da onaylandı**. Yeni sayfalar bu dili birebir
takip eder; yeni yön arayışına girilmez.

**Renkler** (`app/globals.css`):

| Değişken | Değer | Kullanım |
|---|---|---|
| `--bg` | `#FAF6F1` | sayfa zemini (krem) |
| `--warm-bg` | `#F0EAE0` | vurgulu bölüm zemini, görsel yer tutucu |
| `--dark` | `#201A12` | hero mesaj bloğu, editorial, final CTA, alt bar |
| `--gold` | `#B8956A` | vurgu, eyebrow, birincil buton |
| `--clay` | `#A4562F` | kampanya rozeti ve indirimli fiyat |
| `--muted` / `--subtle` | `#7D7369` / `#B5AEA4` | ikincil metin |

**Tipografi:** Playfair Display (başlık, ürün adı) + Manrope (gövde, fiyat).

> Manrope zorunlu: Kiril + `cyrillic-ext` alt kümesini destekler, **₴ sembolü o alt
> kümede**. Playfair'de ₴ glifi YOK — fiyatlarda asla serif kullanma, bozuk render olur.
> Fiyat formatı `formatPrice()`: `101 582 ₴` (tutar önce, sembol sonra).

**Düzen kuralları:**

- **Mobil öncelikli yaz.** Temel CSS telefon içindir; `@media (min-width: 700px)` ve
  `(min-width: 1000px)` ile büyüt. Asla tersini yapma.
- Yatay listeler mobilde snap-scroll "rail", masaüstünde grid'e döner
- Ürün fotoğrafları **5:3** oranında çekilmiş → kartlarda `aspect-ratio: 5/3` + `cover`
- Köşe yarıçapı 2–3px (keskin, editoryal), buton min yükseklik 52px
- Sabit alt bar mobilde her sayfada durur → içerik `padding-bottom: var(--bar-h)`
- Animasyon minimum: sadece yumuşak fade-up. Efekt değil görsel kalite önceliklidir.

## Görsel envanteri — kısıtları bil

`public/images/` altında sınırlı malzeme var. **Kod yazmadan önce kullanacağın görseli
gerçekten aç ve bak.**

- `categories/*.jpg` — 5 lifestyle render, 1000×750, watermarksız, **en iyi malzeme**
- `products/*.jpg` — 12 ürün, beyaz zeminde cutout, 5:3
- `hero/hero-main.jpg` — ⚠️ üzerinde GABBA watermark'ı var, **kullanma**
- `luna-armchair`, `terra-dresser`, `galante-bed`, `hero/lifestyle-1..3` — 620×372 düşük
  çözünürlük, tam ekran kullanma, sadece küçük kartlarda

## Yerel geliştirme ile canlı ayrımı

**Yereldeki hiçbir işlem canlıyı etkilemez.** İki ayrı veritabanı var:

| | adres | ne |
|---|---|---|
| yerel | `127.0.0.1:5434/gabba` | Homebrew PostgreSQL 16, üretimden alınmış kopya |
| üretim | VPS `localhost:5432/gabba` | canlı mağaza |

- `.env.local` → **yerel** veritabanına bakar. `npm run dev` bunu kullanır.
- `.env.uretim` → üretim bağlantısı. Git'e girmez, yalnızca bilerek yüklenir.
- Üretime erişim SSH tüneli ister: `ssh -f -N -L 5433:localhost:5432 gabba`.
  Tünel kapalıyken üretime ulaşmak mümkün değil — normal durum budur, açık bırakma.

```bash
npm run senkron                      # kuru çalıştırma
npm run senkron -- --yaz             # YEREL kopyaya yazar
npm run senkron -- --yaz --uretim    # CANLI mağazaya yazar (tünel gerekir)
```

Senkron her çalıştırmada hedef veritabanını ekrana basar. `--uretim` verilmezse
yerele yazar; unutmak canlıyı bozmaz.

Yerel kopyayı tazelemek için üretimden yeni yedek alıp yükle — kopya zamanla
canlıdan uzaklaşır, bu beklenen bir durumdur.

> ⚠️ Portlar çakışmasın: **5432** makinede zaten kurulu olan PostgreSQL 18
> (`/Library/PostgreSQL/18`, CRM tarafı), **5433** SSH tüneli, **5434** bu proje.

**Gerçek yayın kararları canlı panelden verilir** (`185.22.184.99/admin`).
Yerel panel yalnızca deneme içindir.

## Yayın akışı

**Karar (28 Tem 2026): site kendi VPS'imizde çalışacak.** Natro'dan VPS alınıyor;
Vercel'den taşınılacak. Site ve PostgreSQL aynı sunucuda.

```
MacBook → GitHub (gabbahomeeu-coder/gabbaukraine, public) → VPS (Ubuntu)
```

- `next.config.ts` → `output: "standalone"` (VPS'e taşınabilir çıktı)
- Sunucuda: Caddy (SSL) + Node + PostgreSQL + systemd
- Önünde Cloudflare (CDN, önbellek, DDoS koruması) olmalı — tek sunucuyu
  reklam trafiğindeki ani yükten korur
- ⚠️ `www.gabbaukraine.com` hâlâ **Shopify'a** bağlı. Geçişte DNS Cloudflare'e,
  oradan VPS'e yönlendirilecek. Koddaki adresler (metadata, sitemap, JSON-LD)
  o an doğrulanmalı.

## Muhasebe sistemi bağlantısı

Ürün, fiyat, stok ve tedarikçi verisi müşterinin **kendi sunucusundaki özel
muhasebe yazılımından** gelir. Bağlantı **çift yönlüdür**:

- `GET /api/catalog` → katalog çekilir (biz okuruz)
- `POST /api/orders` → sipariş gönderilir (muhasebe kaydeder, stok düşer)

Muhasebe veritabanına **asla doğrudan bağlanılmaz**. Şartname:
https://claude.ai/code/artifact/82c943c6-40f9-40fe-b734-bdb7611d0718

## Git kuralları

`main`'e asla doğrudan push yapma:

1. Dal aç: `git checkout -b feat/...` veya `fix/...`
2. Commit et
3. `git push -u origin <branch>`
4. `gh pr create`

## Çalışma şekli

- **Her adımda önce ne yapacağını açıkla, onay bekle, sonra uygula.** Onaysız kod
  yazma, dosya oluşturma veya komut çalıştırma yok.
- Tasarım işlerinde çok sayıda alternatif üretme — tek iyi çözümü kur, üstünde birlikte
  iyileştir.
- Değişiklikten sonra `npm run build` çalıştır ve mobil görünümü gerçekten kontrol et.
