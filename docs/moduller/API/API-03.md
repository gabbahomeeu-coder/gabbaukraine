# API-03 · Entegrasyon merkezi

> Dış servis bağlantıları ve şifrelenmiş anahtarları tek yerde tutar.

- **Üst modül:** [API · Dış Temas](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle API-03 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Ekleme — Muhasebe bağlantısı çift yönlü oldu

**28.07.2026 · 09:34** · Onur + Claude

**Önce:** Sadece muhasebe→site yönü tasarlanmıştı: ürün, fiyat ve stok çekiliyordu. Siteden verilen sipariş muhasebeye geçmiyordu.

**Sonra:** Muhasebe geliştiricisi bir de sipariş alıcı uç yazacak. Satış anında sipariş muhasebeye gönderilecek, stok orada da düşecek. Idempotency-Key ile tekrar gönderimde çift kayıt oluşmayacak.

**Neden:** Tek yönlü akışta siteden satılan ürün muhasebede var görünüyor, showroom aynı ürünü ikinci kez satıyor. Ayrıca fatura kesilmiyor ve siparişler elle giriliyordu.

---

