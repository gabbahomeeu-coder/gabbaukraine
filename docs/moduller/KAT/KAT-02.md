# KAT-02 · Koleksiyon & kategori

> Ürünlerin gruplanması ve site içindeki düzeni.

- **Üst modül:** [KAT · Katalog](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle KAT-02 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Düzeltme — Kapak seçme sayfası katalog fotoğraflarını hiç okumuyordu

**28.07.2026 · 23:15** · Onur + Claude

**Önce:** Sayfa görsel havuzunu yalnızca YAYINDAKİ ürünlerin görsellerinden topluyordu. Senkronun koleksiyona bağladığı 1706 stüdyo fotoğrafını (media.collectionId) hiç sorgulamıyordu. Tüm ürünler yayına kapalı olduğu için havuz bomboş geliyordu; kapak seçilemeyince koleksiyon da yayına alınamıyordu — kilitli bir döngü.

**Sonra:** Havuz üç kaynaktan besleniyor: koleksiyonun stüdyo fotoğrafları, içindeki ürünlerin dekupeleri, seçili kapaklar. Ürünler yayın durumundan bağımsız okunuyor. Yatay/dikey süzgeci eklendi, başlıkta sayılar görünüyor. LUNA örneği: 71 görsel, 48 yatay, 23 dikey.

**Neden:** Sayfa senkron yazılmadan önce hazırlanmıştı; o zaman koleksiyona bağlı görsel diye bir şey yoktu. Yeni veri yolu açılınca eski okuma kodu güncellenmemiş.

---


### Ekleme — Koleksiyon yayın anahtarı

**28.07.2026 · 20:25** · Onur + Claude

**Önce:** Senkron 57 koleksiyonu yayına kapalı açıyordu ama panelde açma yolu yoktu. Ürünleri yayına alsan bile /collections/<slug> 404 veriyordu.

**Sonra:** Koleksiyon listesine ürünlerdekiyle aynı yayın anahtarı eklendi. Kapağı olmayan koleksiyon yayına alınamıyor. Satırda 'yayındaki ürün / toplam ürün' ve kapağı eksik olanlar için uyarı rozeti var.

**Neden:** Koleksiyon sayfası ürünlerden bağımsız bir yayın kararı; ikisi ayrı ayrı açılmalı.

---


### Düzeltme — Ürünü olmayan koleksiyon kartlarındaki saydamlık kaldırıldı

**28.07.2026 · 13:44** · Onur + Claude

**Önce:** Leora ve Moka koleksiyonlarının ürünü olmadığı için kartlarına %74 saydamlık uygulanmıştı. Amaç 'tıklanamaz' sinyali vermekti.

**Sonra:** Saydamlık kaldırıldı, görseller tam kalitede gösteriliyor. Bilgi belirginleştirilmiş 'Скоро' etiketiyle veriliyor.

**Neden:** Vitrin sayfasında soluk fotoğraf, kullanıcı tarafından arayüz durumu değil GÖRSEL KALİTESİZLİK olarak okunuyor. Kullanıcı bunu fark edip sordu. Arayüz mantığı (pasif öğe soluk olur) panelde doğru, vitrinde yanlış — müşteri o fotoğrafa bakıp markayı yargılıyor.

---

