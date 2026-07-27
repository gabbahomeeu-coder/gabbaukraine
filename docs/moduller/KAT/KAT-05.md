# KAT-05 · Dış senkron

> Katalog sunucusundan gelen veriyi işler; bizim yazdığımız alanları asla ezmez.

- **Üst modül:** [KAT · Katalog](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** `katalog.senkronlandi`

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle KAT-05 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Ekleme — Katalog verisi dış sunucudan çekilecek

**27.07.2026 · 23:53** · Onur + Claude

**Önce:** Ürün verisi lib/catalog.ts içinde elle yazılıydı: 12 ürün, sabit fiyat ve stok.

**Sonra:** Tedarikçi, koleksiyon, ürün, ölçü, fiyat ve stok dış sunucudan API ile çekiliyor. Bizim yazdığımız alanlar (SEO metni, öne çıkanlar, kumaş eşleşmeleri) senkronda korunuyor.

**Neden:** Fiyat ve stok yönetimi dış sistemde yapılıyor; iki yerde tutmak veri kaybına yol açar.

---

