# MOD · Modül Yönetimi

> Modül kayıt defteri: hangi modül var, açık mı, ayarları ne, sağlıklı mı. Kılavuz arşivini tutar.

- **Katman:** Platform katmanı
- **Durum:** çekirdek — kapatılamaz
- **Bağımlı olduğu modüller:** yok

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
| `MOD-01` | Kayıt defteri | Modül ve alt modül tanımlarını tutar, panel haritasını üretir. |
| `MOD-02` | Aç/kapat | Modülleri devreye alır veya çıkarır, bağımlılıkları kontrol eder. |
| `MOD-03` | Ayarlar | Her modülün kendi ayarlarını saklar; panel formu bu tanımdan üretilir. |
| `MOD-04` | Sağlık | Modüllerin çalışır durumda olup olmadığını düzenli kontrol eder. |
| `MOD-05` | Kılavuz arşivi | Her düzeltme ve güncellemeyi tarih, saat, yazar, önce/sonra ile kaydeder; alt modül kaydını üst modüle yükseltir. |

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->

### Değişiklik — Site Vercel'den kendi VPS'imize taşınacak

**28.07.2026 · 09:43** · Onur + Claude · `MOD-01`

**Önce:** Site Vercel'de çalışıyordu; veritabanı için Supabase düşünülmüştü. İki ayrı hizmet, iki ayrı fatura, site-veritabanı arası ağ gecikmesi.

**Sonra:** Natro'dan alınacak VPS'te hem site hem PostgreSQL çalışacak. Önünde Cloudflare olacak. Vercel ve Supabase kullanılmayacak.

**Neden:** Kullanıcı altyapının tamamen kendi kontrolünde olmasını istiyor. Aynı makinede site ve veritabanı olması gecikmeyi de ortadan kaldırıyor.

---

