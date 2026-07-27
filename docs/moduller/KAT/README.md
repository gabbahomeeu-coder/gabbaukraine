# KAT · Katalog

> Ürün, koleksiyon, stok ve kumaş. Fiyat/stok dış sunucudan gelir — bu modül verinin sahibi değil aynasıdır.

- **Katman:** İş katmanı
- **Durum:** çekirdek — kapatılamaz
- **Bağımlı olduğu modüller:** MOD, API, DIL

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
| `KAT-01` | Ürün & ölçüler | Ürün kaydı, taban fiyat ve dış sunucudan gelen ölçüler. |
| `KAT-02` | Koleksiyon & kategori | Ürünlerin gruplanması ve site içindeki düzeni. |
| `KAT-03` | Stok | Adet takibi hareketlerle tutulur; rezervasyon ve düşüm burada. |
| `KAT-04` | Medya | Ürün görselleri; çoğu dış sunucuda barınır. |
| `KAT-05` | Dış senkron | Katalog sunucusundan gelen veriyi işler; bizim yazdığımız alanları asla ezmez. |
| `KAT-06` | Yerel zenginleştirme | SEO metni, öne çıkanlar, koleksiyon düzeni — senkronda korunur. |
| `KAT-07` | Tedarikçi | Hangi ürün hangi tedarikçiden; maliyet ve teslim süresi. |
| `KAT-08` | Varyant & kumaş | Ölçü seçenekleri (kendi fiyatı ve stoğu olan) ile kumaş seçenekleri (fiyat farkı ekleyen). |
| `KAT-09` | Ölçü asistanı | Müşterinin odasına sığıp sığmayacağını gösterir. |

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->

### Ekleme — Katalog verisi dış sunucudan çekilecek

**27.07.2026 · 23:53** · Onur + Claude · `KAT-05`

**Önce:** Ürün verisi lib/catalog.ts içinde elle yazılıydı: 12 ürün, sabit fiyat ve stok.

**Sonra:** Tedarikçi, koleksiyon, ürün, ölçü, fiyat ve stok dış sunucudan API ile çekiliyor. Bizim yazdığımız alanlar (SEO metni, öne çıkanlar, kumaş eşleşmeleri) senkronda korunuyor.

**Neden:** Fiyat ve stok yönetimi dış sistemde yapılıyor; iki yerde tutmak veri kaybına yol açar.

---


### Ekleme — Ölçü ve kumaş iki ayrı boyut olarak kuruldu

**27.07.2026 · 23:52** · Onur + Claude · `KAT-08`

**Önce:** Varyant kavramı yoktu; ürün tek fiyat ve tek ölçüydü. Müşteri kumaş veya ölçü seçemiyordu.

**Sonra:** Ölçü varyantı kendi fiyatı ve stoğu olan kayıt (Variant); kumaş ise fiyat farkı ekleyen ayrı bir seçenek (Fabric). Fiyat = varyant fiyatı + kumaş farkı - indirim.

**Neden:** Dış sunucu Madrid Kanepe'yi tek kayıt olarak veriyor, kumaş seçeneklerini vermiyor. Bazı ürünlerin farklı ölçüleri ve bu ölçülerin farklı fiyatları var.

---

