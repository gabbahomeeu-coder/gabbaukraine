# KAT-01 · Ürün & ölçüler

> Ürün kaydı, taban fiyat ve dış sunucudan gelen ölçüler.

- **Üst modül:** [KAT · Katalog](./README.md)
- **Yayınladığı olaylar:** `urun.guncellendi`
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle KAT-01 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Değişiklik — Panel yayına kapalı ürünleri göremiyordu

**28.07.2026 · 20:25** · Onur + Claude

**Önce:** Ürün listesi 'tumUrunler()' okuyordu, o da 'where: isActive true' ile süzüyor. 948 ürün yayına kapalı gelince panel bomboş görünüyordu; açılacak ürün listede olmadığı için hiçbiri açılamıyordu. Ayrıca liste 12 ürüne göre yazılmıştı: arama, süzgeç ve sayfalama yoktu.

**Sonra:** 'panelUrunleri()' eklendi: yayın durumuna bakmadan okur, sayfa başı 50 kayıt döndürür, ürün/koleksiyon/adres araması ve durum süzgeci (hepsi, yayında, kapalı, görselsiz) alır. Satırda tek tıkla aç/kapa düğmesi var. Site tarafındaki 'tumUrunler()' değişmedi, hâlâ yalnızca yayındakileri döndürüyor.

**Neden:** Panelin ve sitenin okuma kuralları AYNI olamaz: site yayındakini gösterir, panel hepsini yönetir. Tek fonksiyonu paylaşmak bu kilidi doğurdu.

---


### Değişiklik — Site artık veritabanından okuyor

**28.07.2026 · 12:59** · Onur + Claude

**Önce:** Ürün ve koleksiyon verisi lib/catalog.ts dosyasından okunuyordu. Veritabanı kurulmuş ve doldurulmuştu ama site onu kullanmıyordu — veri iki yerde birden duruyordu.

**Sonra:** lib/db/catalog.ts okuma katmanı yazıldı. Ana sayfa, ürün ve koleksiyon sayfaları veritabanından besleniyor. lib/catalog.ts yalnızca ilk tohumlama için duruyor. Stok, StockMove hareketlerinin toplamı olarak hesaplanıyor.

**Neden:** İki veri kaynağı er geç çelişir. Panelden yapılan değişikliğin siteye yansıması ancak tek kaynakla mümkün.

---

