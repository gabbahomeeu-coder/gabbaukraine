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

### Değişiklik — .env.uretim git tarafından yok sayılmıyordu

**28.07.2026 · 22:54** · Onur + Claude · `YON-01`

**Önce:** .gitignore yalnızca .env, .env.local ve .env.*.local kalıplarını içeriyordu. Yeni oluşturulan .env.uretim hiçbirine uymuyordu; depo herkese açık olduğu için üretim veritabanı parolası ilk commit'te yayınlanacaktı.

**Sonra:** .env.* kalıbı eklendi, .env.example ünlem işaretiyle ayrık tutuldu. Üç dosyayla doğrulandı: .env.local, .env.uretim ve .env.production yok sayılıyor; git'te izlenen tek env dosyası .env.example.

**Neden:** Depo herkese açık. Gizli dosya kalıpları eklenirken tek tek yazmak yerine geniş kalıp + istisna kullanmak, sonraki dosyalarda aynı hatayı önler.

---


### Düzeltme — Yerel geliştirme doğrudan üretim veritabanına yazıyordu

**28.07.2026 · 22:54** · Onur + Claude · `YON-01`

**Önce:** Yerel .env.local, SSH tüneli üzerinden (localhost:5433) sunucudaki canlı veritabanına bağlanıyordu. 'npm run dev' ile açılan panelde yapılan her deneme -- ürün yayına alma, fiyat değiştirme, stok düzeltme -- canlı mağazayı anında değiştiriyordu. Kullanıcı panelde deneme yaparken 3 ürünü canlıda yayına almış, bunu ancak sonradan fark etti.

**Sonra:** Makineye Homebrew PostgreSQL 16 kuruldu, 5434 portunda çalışıyor (5432'de kurulu PG18, 5433'te tünel var). Üretimden alınan yedek yerel kopyaya yüklendi: 948 ürün, 57 koleksiyon, 2639 görsel. .env.local artık yerele bakıyor; üretim bağlantısı .env.uretim dosyasına taşındı ve .gitignore'a eklendi. Senkron aracı hedef veritabanını her çalıştırmada yazdırıyor, üretime yazmak için --uretim bayrağı şart. Tünel kapatıldı. Doğrulandı: yerelde 5 ürün yayına alındı, üretim 3'te kaldı.

**Neden:** Tek veritabanı hem geliştirme hem üretim için kullanılınca deneme ile gerçek işlem arasında hiçbir sınır kalmıyor. Ayrım kodla değil bağlantıyla kurulmalı: yanlış komut yazılsa bile üretime ulaşamamalı.

---


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

