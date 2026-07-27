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
