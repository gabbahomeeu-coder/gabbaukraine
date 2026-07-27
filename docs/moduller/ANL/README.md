# ANL · Analitik

> Kendi ziyaretçi analitiğimiz. Veri bizde kalır. Ziyaret kayıtları omurgaya değil kendi tablosuna yazılır.

- **Katman:** İş katmanı
- **Durum:** kapatılabilir
- **Bağımlı olduğu modüller:** MOD

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
| `ANL-01` | Ziyaretçi oturumu | Oturum başlangıcı, süresi ve kaynağı. |
| `ANL-02` | Sayfa akışı | Hangi sayfaya girdi, sonra nereye gitti — gerçek gezinme sırası. |
| `ANL-03` | Konum & cihaz | Şehir, cihaz, tarayıcı. |
| `ANL-04` | Canlı ziyaretçi | Şu anda sitede kim var, hangi sayfada. |
| `ANL-05` | Bildirim kuralları | Hangi ziyaret bildirim doğurur — her ziyaret değil, kurala uyanlar. Panelden aç/kapat. |
| `ANL-06` | A/B deneyleri | Hangi başlık, görsel veya fiyat gösterimi daha çok satıyor. |

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->
