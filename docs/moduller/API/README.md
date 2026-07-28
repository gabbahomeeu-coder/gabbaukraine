# API · Dış Temas

> Sistemin dış dünyayla tek teması. Katalog kaynağı, reklam, Telegram, ödeme, kargo — hepsi buradan geçer.

- **Katman:** Platform katmanı
- **Durum:** çekirdek — kapatılamaz
- **Bağımlı olduğu modüller:** MOD

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
| `API-01` | Dış kapı | Mobil, bayi ve pazaryeri için dışarıya açılan uçlar. |
| `API-02` | Anahtar & yetki | API anahtarları, yetki kapsamları ve oran sınırları. |
| `API-03` | Entegrasyon merkezi | Dış servis bağlantıları ve şifrelenmiş anahtarları tek yerde tutar. |
| `API-04` | Gelen webhook | Ödeme onayı, kargo durumu gibi dışarıdan gelen bildirimleri karşılar. |
| `API-05` | Katalog çekimi | Katalog sunucusundan ürün, fiyat, stok ve görselleri çeker. |
| `API-06` | Bekçi | Her atardamar geçişinde şekil, tekrar ve yetki kontrolü yapar; geçersiz veriyi karantinaya alır. |

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->

### Düzeltme — Dinleyicisi olmayan olaylar tespit edildi ve bağlandı

**28.07.2026 · 12:04** · Onur + Claude · `API-06`

**Önce:** Dokümanda tarif edilen bazı tepkiler kayıt defterine işlenmemişti. stok.tukendi, katalog.senkron.uyari ve olay.karantinaya.alindi olaylarını hiçbir modül dinlemiyordu — yani senkron bozulsa veya bekçi bir veriyi reddetse kimse haberdar olmayacaktı.

**Sonra:** Sekiz olay ilgili modüllere bağlandı. Arıza bildirimleri Telegram yönetici bildirimine, modül aç/kapat denetim kaydına, segment değişikliği reklam hedef kitlesine gidiyor. Dinleyicisiz tek olay musteri.olusturuldu kaldı; onun tepkisi henüz gerekmiyor.

**Neden:** Panel haritasında 'henüz dinleyen yok' uyarısı görülünce fark edildi. Sessiz kalan arıza, günlerce fark edilmeyen arızadır.

---


### Ekleme — Muhasebe bağlantısı çift yönlü oldu

**28.07.2026 · 09:34** · Onur + Claude · `API-03`

**Önce:** Sadece muhasebe→site yönü tasarlanmıştı: ürün, fiyat ve stok çekiliyordu. Siteden verilen sipariş muhasebeye geçmiyordu.

**Sonra:** Muhasebe geliştiricisi bir de sipariş alıcı uç yazacak. Satış anında sipariş muhasebeye gönderilecek, stok orada da düşecek. Idempotency-Key ile tekrar gönderimde çift kayıt oluşmayacak.

**Neden:** Tek yönlü akışta siteden satılan ürün muhasebede var görünüyor, showroom aynı ürünü ikinci kez satıyor. Ayrıca fatura kesilmiyor ve siparişler elle giriliyordu.

---

