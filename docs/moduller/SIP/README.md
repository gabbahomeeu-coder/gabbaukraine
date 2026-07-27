# SIP · Sipariş

> Sepet, ödeme, kargo ve sipariş durumu. Paranın aktığı yer.

- **Katman:** İş katmanı
- **Durum:** çekirdek — kapatılamaz
- **Bağımlı olduğu modüller:** KAT, API

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
| `SIP-01` | Sepet | Seçilen ürün, ölçü ve kumaş; bağlantı kesilse de cihazda korunur. |
| `SIP-02` | Ödeme | Ödeme sağlayıcısına yönlendirme ve sonucun işlenmesi. |
| `SIP-03` | Kargo | Nova Poshta gönderi kaydı ve takibi. |
| `SIP-04` | Durum | Siparişin hangi aşamada olduğu ve müşteriye bildirimi. |
| `SIP-05` | İade | İade ve iptal süreci. |
| `SIP-06` | Taksit | Aylık ödeme tutarının hesaplanması ve gösterimi. |

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->

### Kaldırma — Stripe projeden çıkarıldı

**27.07.2026 · 23:53** · Onur + Claude · `SIP-02`

**Önce:** package.json içinde stripe ve @stripe/stripe-js paketleri duruyordu.

**Sonra:** İkisi de kaldırıldı. Ödeme için Ukrayna sağlayıcısı kullanılacak, sağlayıcı bağımsız bir adaptör yazılacak.

**Neden:** Stripe Ukrayna'da kullanılamıyor; boşuna bağımlılık ve kafa karışıklığı yaratıyordu.

---

