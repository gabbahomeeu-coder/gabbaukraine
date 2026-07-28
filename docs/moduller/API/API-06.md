# API-06 · Bekçi

> Her atardamar geçişinde şekil, tekrar ve yetki kontrolü yapar; geçersiz veriyi karantinaya alır.

- **Üst modül:** [API · Dış Temas](./README.md)
- **Yayınladığı olaylar:** `olay.karantinaya.alindi`
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle API-06 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Düzeltme — Dinleyicisi olmayan olaylar tespit edildi ve bağlandı

**28.07.2026 · 12:04** · Onur + Claude

**Önce:** Dokümanda tarif edilen bazı tepkiler kayıt defterine işlenmemişti. stok.tukendi, katalog.senkron.uyari ve olay.karantinaya.alindi olaylarını hiçbir modül dinlemiyordu — yani senkron bozulsa veya bekçi bir veriyi reddetse kimse haberdar olmayacaktı.

**Sonra:** Sekiz olay ilgili modüllere bağlandı. Arıza bildirimleri Telegram yönetici bildirimine, modül aç/kapat denetim kaydına, segment değişikliği reklam hedef kitlesine gidiyor. Dinleyicisiz tek olay musteri.olusturuldu kaldı; onun tepkisi henüz gerekmiyor.

**Neden:** Panel haritasında 'henüz dinleyen yok' uyarısı görülünce fark edildi. Sessiz kalan arıza, günlerce fark edilmeyen arızadır.

---

