# KAT-08 · Varyant & kumaş

> Ölçü seçenekleri (kendi fiyatı ve stoğu olan) ile kumaş seçenekleri (fiyat farkı ekleyen).

- **Üst modül:** [KAT · Katalog](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle KAT-08 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Ekleme — Ölçü ve kumaş iki ayrı boyut olarak kuruldu

**27.07.2026 · 23:52** · Onur + Claude

**Önce:** Varyant kavramı yoktu; ürün tek fiyat ve tek ölçüydü. Müşteri kumaş veya ölçü seçemiyordu.

**Sonra:** Ölçü varyantı kendi fiyatı ve stoğu olan kayıt (Variant); kumaş ise fiyat farkı ekleyen ayrı bir seçenek (Fabric). Fiyat = varyant fiyatı + kumaş farkı - indirim.

**Neden:** Dış sunucu Madrid Kanepe'yi tek kayıt olarak veriyor, kumaş seçeneklerini vermiyor. Bazı ürünlerin farklı ölçüleri ve bu ölçülerin farklı fiyatları var.

---

