# YON-03 · Denetim kaydı

> Her yönetici işlemini öncesi/sonrasıyla kaydeder.

- **Üst modül:** [YON · Yönetim](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle YON-03 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Ekleme — Panelde ürün düzenleme ve denetim günlüğü

**28.07.2026 · 12:59** · Onur + Claude

**Önce:** Panelde ürün yönetimi yoktu; fiyat veya metin değiştirmek için kod değiştirip yeniden yayınlamak gerekiyordu.

**Sonra:** /admin/urunler altında liste ve düzenleme ekranı var: fiyat, ad, açıklama, malzeme, SEO alanları, öne çıkarma ve yayın durumu. Kayıt sonrası ilgili sayfalar tazeleniyor. Her değişiklik AuditLog'a öncesi/sonrasıyla yazılıyor. Stok düzeltmesi üzerine yazmıyor, hareket olarak ekleniyor.

**Neden:** Faz 1'in bitiş ölçütü buydu: ürün fiyatını panelden değiştirince site güncellenmeli. Doğrulandı: 69318 → 77777 değişikliği ürün ve ana sayfaya anında yansıdı, denetim kaydı yazıldı.

---

