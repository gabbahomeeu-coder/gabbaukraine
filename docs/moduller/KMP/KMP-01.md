# KMP-01 · Günlük indirim

> Her gün belirli ürünlere internet satışına özel indirim.

- **Üst modül:** [KMP · Kampanya](./README.md)
- **Yayınladığı olaylar:** `kampanya.dondu`
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle KMP-01 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Düzeltme — Günlük kampanya silinmiş örnek ürünleri gösteriyordu

**28.07.2026 · 23:52** · Onur + Claude

**Önce:** lib/daily-deals.ts içinde beş ürünlük sabit bir dizi vardı ve görselleri public/images/products altından okunuyordu. Gerçek katalog gelince o 12 örnek ürün silindi, ama kampanya bölümü onları göstermeye devam etti. Ana sayfada canlıda genova-chair, madrid-table ve montana-armchair öneriliyordu; tıklayan müşteri 404 alıyordu.

**Sonra:** Kampanya veritabanından besleniyor: yayında olan, görseli bulunan, stoğu sıfırdan büyük ve 70.000 ₴ altındaki ürünler arasından tarih tohumlu üç tanesi seçiliyor. Uygun ürün yoksa boş liste dönüyor ve bölüm ana sayfada hiç görünmüyor. Karıştırma Fisher-Yates ile yapılıyor; önceki sort() yöntemi tarayıcıya göre farklı sonuç verebiliyordu.

**Neden:** Kampanya reklam trafiğinin indiği ana sayfanın ortasında duruyor. Kırık bağlantı burada doğrudan kayıp satış demek. Stok kontrolü de eklendi: indirimi görüp sipariş verilemeyen ürün güveni bozar.

---

