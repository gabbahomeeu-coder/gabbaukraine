# API-01 · Dış kapı

> Mobil, bayi ve pazaryeri için dışarıya açılan uçlar.

- **Üst modül:** [API · Dış Temas](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle API-01 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Düzeltme — Görsel alanı tanımlı olmadığı için sayfalar 500 veriyordu

**28.07.2026 · 20:25** · Onur + Claude

**Önce:** next.config.ts izinli görsel alanını CATALOG_API_URL'den türetiyordu (crm.gabbahome.eu). Görseller img.gabbahome.eu'da barınıyor; next/image bu adresi reddedip sayfayı 500'e düşürüyordu. Ürünü olan her sayfa çöküyordu.

**Sonra:** CATALOG_IMAGE_HOSTS ortam değişkeni eklendi, virgülle birden çok alan yazılabiliyor; API alanı da listeye ekleniyor. .env.local'e img.gabbahome.eu yazıldı — SUNUCUDA DA TANIMLANMALI.

**Neden:** Görsel alanı ile API alanı aynı olmak zorunda değil. Bağımlılık örtük kaldığı için hata ancak ilk gerçek görsel geldiğinde ortaya çıktı.

---

