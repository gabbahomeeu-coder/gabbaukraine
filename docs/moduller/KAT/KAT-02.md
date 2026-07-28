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

