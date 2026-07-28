# KAT-05 · Dış senkron

> Katalog sunucusundan gelen veriyi işler; bizim yazdığımız alanları asla ezmez.

- **Üst modül:** [KAT · Katalog](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** `katalog.senkronlandi`

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle KAT-05 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Ekleme — Ürün ölçüleri senkrona alındı

**29.07.2026 · 01:55** · Onur + Claude

**Önce:** CRM ürün ölçüsü göndermiyordu; 948 ürünün widthCm/depthCm/heightCm alanları boştu ve sitede hiçbir üründe ölçü gösterilemiyordu. Ölçü bilgisi yalnızca ürün adının içinde geçiyordu (Стіл 220см).

**Sonra:** CRM dimensions alanını ekledi: raw metni her zaman, sayısal üçlü net ölçüsü olanlarda. Senkron ikisini de okuyor. 922/948 ürün ölçü aldı, 833'ünde üç ölçü tam. Sayısal alan boş gelen 91 üründe raw metninden ayrıştırma yapılıyor. products tablosuna dimensionsRaw kolonu eklendi.

**Neden:** Ölçü mobilya alışverişinde fiyattan sonra en çok sorulan bilgi. raw metni sayısal alanların taşıyamadığı bilgiyi içeriyor (ikinci parça, oturma yüksekliği), atılmaması gerekiyordu.

---


### Değişiklik — Kategori tahmini tamamlandı, eksik kategori otomatik açılıyor

**28.07.2026 · 20:11** · Onur + Claude

**Önce:** Kural listesi 948 üründen 46'sını sınıflandıramıyordu: Стелаж, Вітраж, Дресуар, Камін, Колона, ТВ блок, Узголівʼя, Спальний комплект. Ayrıca 'accessory' kategorisi veritabanında yoktu, 98 aksesuar kategorisiz kalıyordu.

**Sonra:** Eksik kalıplar eklendi; yatak kuralı masa kuralından öne alındı, çünkü 'спальний комплект' içinde 'стіл' geçebiliyor. Senkron eksik kategoriyi Ukraynaca adıyla kendi açıyor, var olanın adına ve sırasına dokunmuyor. 948 ürünün tamamı kategoriye oturdu.

**Neden:** CRM kategori alanı göndermiyor, kategori ürün adından çıkarılıyor. Kategorisiz ürün ana sayfadaki kategori kartlarında hiç görünmez.

---


### Düzeltme — Boş örnek koleksiyonlar gerçek koleksiyonların adresini tutuyordu

**28.07.2026 · 20:11** · Onur + Claude

**Önce:** Örnek ürünler silindiğinde koleksiyonları kalmıştı. CRM'den gelen LUNA, MOKA, MONTANA, LEORA aynı slug'ı bulduğu için '-2' ekiyle kaydedildi: /collections/luna-2.

**Sonra:** Ürünsüz ve görselsiz 5 örnek koleksiyon silindi, '-2' ekleri kaldırıldı. Adresler /collections/luna biçiminde.

**Neden:** Ürün silmek koleksiyonu silmiyor. Adres SEO'nun parçası; sonradan değiştirmek bağlantı kırar, ilk yüklemede düzeltilmeli.

---


### Düzeltme — Yeni ürünlerin stoğu yazılmıyordu

**28.07.2026 · 20:11** · Onur + Claude

**Önce:** Stok bloğu 'if (!kuru && mevcut)' koşuluyla çalışıyordu. 'mevcut' yalnızca daha önce kaydedilmiş ürünlerde dolu olduğu için ilk yüklemede 948 ürünün hiçbirine stok hareketi açılmadı; hepsi sitede stoksuz görünecekti.

**Sonra:** Ürün kimliği create ve update dallarının ikisinden de 'urunId' değişkenine alınıyor, stok bloğu 'if (!kuru && urunId)' ile çalışıyor. Yeni üründe mevcut stok 0 sayılıp fark kadar giriş açılıyor. Gerçek çalıştırmada 422 ürüne stok hareketi yazıldı.

**Neden:** Hata yalnızca ilk yüklemede ortaya çıkıyordu; sonraki çalıştırmalarda ürünler mevcut sayıldığı için stok yazılıyordu. Kuru çalıştırma stok yazmadığı için raporda da görünmedi.

---


### Ekleme — Katalog verisi dış sunucudan çekilecek

**27.07.2026 · 23:53** · Onur + Claude

**Önce:** Ürün verisi lib/catalog.ts içinde elle yazılıydı: 12 ürün, sabit fiyat ve stok.

**Sonra:** Tedarikçi, koleksiyon, ürün, ölçü, fiyat ve stok dış sunucudan API ile çekiliyor. Bizim yazdığımız alanlar (SEO metni, öne çıkanlar, kumaş eşleşmeleri) senkronda korunuyor.

**Neden:** Fiyat ve stok yönetimi dış sistemde yapılıyor; iki yerde tutmak veri kaybına yol açar.

---

