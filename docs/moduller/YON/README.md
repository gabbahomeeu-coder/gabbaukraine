# YON · Yönetim

> Panel girişi, roller, işlem günlüğü ve sistem ayarları.

- **Katman:** Platform katmanı
- **Durum:** çekirdek — kapatılamaz
- **Bağımlı olduğu modüller:** MOD

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
| `YON-01` | Giriş | Yönetici kimlik doğrulaması ve oturum. |
| `YON-02` | Roller | Kim neyi görebilir ve değiştirebilir. |
| `YON-03` | Denetim kaydı | Her yönetici işlemini öncesi/sonrasıyla kaydeder. |
| `YON-04` | Sistem ayarları | Site geneli ayarlar. |

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->

### Ekleme — Panelde ürün düzenleme ve denetim günlüğü

**28.07.2026 · 12:59** · Onur + Claude · `YON-03`

**Önce:** Panelde ürün yönetimi yoktu; fiyat veya metin değiştirmek için kod değiştirip yeniden yayınlamak gerekiyordu.

**Sonra:** /admin/urunler altında liste ve düzenleme ekranı var: fiyat, ad, açıklama, malzeme, SEO alanları, öne çıkarma ve yayın durumu. Kayıt sonrası ilgili sayfalar tazeleniyor. Her değişiklik AuditLog'a öncesi/sonrasıyla yazılıyor. Stok düzeltmesi üzerine yazmıyor, hareket olarak ekleniyor.

**Neden:** Faz 1'in bitiş ölçütü buydu: ürün fiyatını panelden değiştirince site güncellenmeli. Doğrulandı: 69318 → 77777 değişikliği ürün ve ana sayfaya anında yansıdı, denetim kaydı yazıldı.

---


### Düzeltme — SSH şifre girişi açık kalmıştı

**28.07.2026 · 12:43** · Onur + Claude · `YON-01`

**Önce:** Şifreyle girişi kapatan ayar dosyası 99- ön ekiyle yazılmıştı. Ubuntu'nun cloud-init dosyası 50- ön ekiyle daha önce okunuyor ve SSH'ta İLK tanımlanan değer kazandığı için şifre girişi açık kalmaya devam ediyordu.

**Sonra:** Ayar dosyası 01-gabba.conf olarak yeniden adlandırıldı ve cloud-init dosyasındaki satır da düzeltildi. Doğrulandı: sunucu artık yalnızca publickey kabul ediyor.

**Neden:** Kurulumdan sonra 'kapattık' varsayıp geçseydik, sohbette paylaşılan şifreyle sunucuya erişim mümkün kalacaktı.

---

