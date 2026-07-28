# KMP · Kampanya

> Günlük indirim, kuponlar ve kampanya kuralları.

- **Katman:** İş katmanı
- **Durum:** kapatılabilir
- **Bağımlı olduğu modüller:** KAT

## Alt modüller

| Künye | Ad | Sorumluluk |
|---|---|---|
| `KMP-01` | Günlük indirim | Her gün belirli ürünlere internet satışına özel indirim. |
| `KMP-02` | Kupon | İndirim kodları ve kullanım takibi. |
| `KMP-03` | Kural motoru | Hangi ürün hangi koşulda indirime girer — kodla değil kuralla. |

## Kılavuz — değişiklik arşivi

Bu bölüme alt modüllerde yapılan değişikliklerin özeti yükselir.
Ayrıntı için ilgili alt modülün kılavuzuna bakın.

<!-- KAYITLAR -->

### Düzeltme — Günlük kampanya silinmiş örnek ürünleri gösteriyordu

**28.07.2026 · 23:52** · Onur + Claude · `KMP-01`

**Önce:** lib/daily-deals.ts içinde beş ürünlük sabit bir dizi vardı ve görselleri public/images/products altından okunuyordu. Gerçek katalog gelince o 12 örnek ürün silindi, ama kampanya bölümü onları göstermeye devam etti. Ana sayfada canlıda genova-chair, madrid-table ve montana-armchair öneriliyordu; tıklayan müşteri 404 alıyordu.

**Sonra:** Kampanya veritabanından besleniyor: yayında olan, görseli bulunan, stoğu sıfırdan büyük ve 70.000 ₴ altındaki ürünler arasından tarih tohumlu üç tanesi seçiliyor. Uygun ürün yoksa boş liste dönüyor ve bölüm ana sayfada hiç görünmüyor. Karıştırma Fisher-Yates ile yapılıyor; önceki sort() yöntemi tarayıcıya göre farklı sonuç verebiliyordu.

**Neden:** Kampanya reklam trafiğinin indiği ana sayfanın ortasında duruyor. Kırık bağlantı burada doğrudan kayıp satış demek. Stok kontrolü de eklendi: indirimi görüp sipariş verilemeyen ürün güveni bozar.

---

