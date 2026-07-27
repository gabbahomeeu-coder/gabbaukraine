# SIP-02 · Ödeme

> Ödeme sağlayıcısına yönlendirme ve sonucun işlenmesi.

- **Üst modül:** [SIP · Sipariş](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** `odeme.basarili`, `odeme.basarisiz`

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle SIP-02 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Kaldırma — Stripe projeden çıkarıldı

**27.07.2026 · 23:53** · Onur + Claude

**Önce:** package.json içinde stripe ve @stripe/stripe-js paketleri duruyordu.

**Sonra:** İkisi de kaldırıldı. Ödeme için Ukrayna sağlayıcısı kullanılacak, sağlayıcı bağımsız bir adaptör yazılacak.

**Neden:** Stripe Ukrayna'da kullanılamıyor; boşuna bağımlılık ve kafa karışıklığı yaratıyordu.

---

