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

### Düzeltme — Ölçü metninden çıkarım yapılıyordu, 92 aksesuarda uydurma değer üretti

**29.07.2026 · 02:09** · Onur + Claude · `KAT-05`

**Önce:** Sayısal ölçü gelmeyen üründe raw metninden ayrıştırma yapılıyordu. CRM aksesuarlarda bilerek sayısal ölçü göndermiyor, çünkü aksesuar ölçüleri düzenli değil: 98 aksesuarın 79'u 'x' ile yazılmış (10 x 27 см), 10'u tek sayı (115 см), 3'ü hacim (150 мл). Ayrıştırıcı bunları genişlik sanıp yazdı — difüzörün 150 mililitresi genişlik 150 cm, yapay ağacın 115 cm boyu genişlik oldu. 92 üründe yanlış veri.

**Sonra:** Metinden çıkarım tamamen kaldırıldı. Sayısal alanlar yalnızca CRM gönderdiyse dolar (831 ürün), ham metin dimensionsRaw'da olduğu gibi durur (922 ürün) ve ürün sayfasında aynen gösterilir. Yeniden senkronda 92 uydurma değer temizlendi.

**Neden:** Ölçünün hangi eksene ait olduğu metinden bilinemez. '10 x 27' şamdanda çap ve yükseklik; genişlik-derinlik diye yazmak yanlış. Kaynakta ne yazıyorsa o gösterilir, yorum yapılmaz.

---


### Ekleme — Ürün ölçüleri senkrona alındı

**29.07.2026 · 01:55** · Onur + Claude · `KAT-05`

**Önce:** CRM ürün ölçüsü göndermiyordu; 948 ürünün widthCm/depthCm/heightCm alanları boştu ve sitede hiçbir üründe ölçü gösterilemiyordu. Ölçü bilgisi yalnızca ürün adının içinde geçiyordu (Стіл 220см).

**Sonra:** CRM dimensions alanını ekledi: raw metni her zaman, sayısal üçlü net ölçüsü olanlarda. Senkron ikisini de okuyor. 922/948 ürün ölçü aldı, 833'ünde üç ölçü tam. Sayısal alan boş gelen 91 üründe raw metninden ayrıştırma yapılıyor. products tablosuna dimensionsRaw kolonu eklendi.

**Neden:** Ölçü mobilya alışverişinde fiyattan sonra en çok sorulan bilgi. raw metni sayısal alanların taşıyamadığı bilgiyi içeriyor (ikinci parça, oturma yüksekliği), atılmaması gerekiyordu.

---


### Düzeltme — Dekupe ürün fotoğrafları kartlarda kırpılıyordu

**28.07.2026 · 23:44** · Onur + Claude · `KAT-01`

**Önce:** Ürün kartları 5/3 kutuda 'object-fit: cover' ve ayrıca scale(1.1) kullanıyordu. Bu kural eski örnek fotoğraflara göre yazılmıştı (5:3 çekim). CRM'den gelen 933 dekupenin oranı ise ~6:5 (781x656); cover ile mobilyanın yaklaşık üçte biri kırpılıyor, koleksiyon sayfasında ürünler yarım görünüyordu.

**Sonra:** Ürün kartlarında kutu 5/4, yerleşim 'contain'. Fotoğrafın tamamı görünüyor, artan boşluk kartın beyaz zeminiyle kaynaşıyor. Büyük scale kaldırıldı, dokunma geri bildirimi 1.03'e indi. Ürün sayfası galerisi 4/3 + contain. Koleksiyon kapakları ve kategori kartları stüdyo çekimi olduğu için cover kalmaya devam ediyor.

**Neden:** Kırpma kuralı görsel malzemeye bağlıdır; malzeme değişince kural da değişmeli. CLAUDE.md'deki '5:3 + cover' maddesi de güncellendi, yoksa sonraki sayfalarda aynı hata tekrarlanır.

---


### Değişiklik — Kapak havuzu türe göre üç bölüme ayrıldı

**28.07.2026 · 23:38** · Onur + Claude · `KAT-02`

**Önce:** Tüm görseller tek listede karışık duruyordu: yatay stüdyo çekimi, dikey stüdyo çekimi ve beyaz zeminli ürün dekupesi yan yana. Kapak ararken hangisinin ne işe yaradığını ayırmak gerekiyordu.

**Sonra:** Üç ayrı bölüm: yatay stüdyo, dikey stüdyo, ürün dekupeleri. Her bölümde başlık, sayı ve ne işe yaradığını anlatan tek satır var. Süzgeç düğmeleri bölüme atlamak için duruyor. Sıra kasıtlı — dekupe kapak için en az uygun olan, en sonda.

**Neden:** Geniş ekran kapağı yatay, telefon kapağı dikey ister. Karışık liste bu ayrımı gizliyordu; gruplama kararın kendisini görünür kılıyor.

---


### Değişiklik — Kapak havuzunda kutular fotoğrafın oranını alıyor

**28.07.2026 · 23:21** · Onur + Claude · `KAT-02`

**Önce:** Tüm kutular sabit 4/3 oranındaydı ve görsel 'cover' ile yerleştiriliyordu. Dikey fotoğrafların üstü ve altı kırpılıyor, kapak seçerken fotoğrafın tamamı görülemiyordu.

**Sonra:** Her kutu kendi fotoğrafının en-boy oranını alıyor (--oran değişkeni, media.width/height'tan). Izgara yerine sütun düzeni kullanılıyor; farklı boydaki kutular yan yana gelince boşluk kalmıyor. Ölçüsü bilinmeyen görsel için 4/3 yedeği duruyor.

**Neden:** Kapak seçimi görsel bir karar; kırpılmış önizleme yanlış seçime yol açar. Özellikle telefon kapağı için dikey fotoğrafın tamamının görünmesi şart.

---


### Düzeltme — Kapak seçme sayfası katalog fotoğraflarını hiç okumuyordu

**28.07.2026 · 23:15** · Onur + Claude · `KAT-02`

**Önce:** Sayfa görsel havuzunu yalnızca YAYINDAKİ ürünlerin görsellerinden topluyordu. Senkronun koleksiyona bağladığı 1706 stüdyo fotoğrafını (media.collectionId) hiç sorgulamıyordu. Tüm ürünler yayına kapalı olduğu için havuz bomboş geliyordu; kapak seçilemeyince koleksiyon da yayına alınamıyordu — kilitli bir döngü.

**Sonra:** Havuz üç kaynaktan besleniyor: koleksiyonun stüdyo fotoğrafları, içindeki ürünlerin dekupeleri, seçili kapaklar. Ürünler yayın durumundan bağımsız okunuyor. Yatay/dikey süzgeci eklendi, başlıkta sayılar görünüyor. LUNA örneği: 71 görsel, 48 yatay, 23 dikey.

**Neden:** Sayfa senkron yazılmadan önce hazırlanmıştı; o zaman koleksiyona bağlı görsel diye bir şey yoktu. Yeni veri yolu açılınca eski okuma kodu güncellenmemiş.

---


### Ekleme — Koleksiyon yayın anahtarı

**28.07.2026 · 20:25** · Onur + Claude · `KAT-02`

**Önce:** Senkron 57 koleksiyonu yayına kapalı açıyordu ama panelde açma yolu yoktu. Ürünleri yayına alsan bile /collections/<slug> 404 veriyordu.

**Sonra:** Koleksiyon listesine ürünlerdekiyle aynı yayın anahtarı eklendi. Kapağı olmayan koleksiyon yayına alınamıyor. Satırda 'yayındaki ürün / toplam ürün' ve kapağı eksik olanlar için uyarı rozeti var.

**Neden:** Koleksiyon sayfası ürünlerden bağımsız bir yayın kararı; ikisi ayrı ayrı açılmalı.

---


### Değişiklik — Panel yayına kapalı ürünleri göremiyordu

**28.07.2026 · 20:25** · Onur + Claude · `KAT-01`

**Önce:** Ürün listesi 'tumUrunler()' okuyordu, o da 'where: isActive true' ile süzüyor. 948 ürün yayına kapalı gelince panel bomboş görünüyordu; açılacak ürün listede olmadığı için hiçbiri açılamıyordu. Ayrıca liste 12 ürüne göre yazılmıştı: arama, süzgeç ve sayfalama yoktu.

**Sonra:** 'panelUrunleri()' eklendi: yayın durumuna bakmadan okur, sayfa başı 50 kayıt döndürür, ürün/koleksiyon/adres araması ve durum süzgeci (hepsi, yayında, kapalı, görselsiz) alır. Satırda tek tıkla aç/kapa düğmesi var. Site tarafındaki 'tumUrunler()' değişmedi, hâlâ yalnızca yayındakileri döndürüyor.

**Neden:** Panelin ve sitenin okuma kuralları AYNI olamaz: site yayındakini gösterir, panel hepsini yönetir. Tek fonksiyonu paylaşmak bu kilidi doğurdu.

---


### Değişiklik — Kategori tahmini tamamlandı, eksik kategori otomatik açılıyor

**28.07.2026 · 20:11** · Onur + Claude · `KAT-05`

**Önce:** Kural listesi 948 üründen 46'sını sınıflandıramıyordu: Стелаж, Вітраж, Дресуар, Камін, Колона, ТВ блок, Узголівʼя, Спальний комплект. Ayrıca 'accessory' kategorisi veritabanında yoktu, 98 aksesuar kategorisiz kalıyordu.

**Sonra:** Eksik kalıplar eklendi; yatak kuralı masa kuralından öne alındı, çünkü 'спальний комплект' içinde 'стіл' geçebiliyor. Senkron eksik kategoriyi Ukraynaca adıyla kendi açıyor, var olanın adına ve sırasına dokunmuyor. 948 ürünün tamamı kategoriye oturdu.

**Neden:** CRM kategori alanı göndermiyor, kategori ürün adından çıkarılıyor. Kategorisiz ürün ana sayfadaki kategori kartlarında hiç görünmez.

---


### Düzeltme — Boş örnek koleksiyonlar gerçek koleksiyonların adresini tutuyordu

**28.07.2026 · 20:11** · Onur + Claude · `KAT-05`

**Önce:** Örnek ürünler silindiğinde koleksiyonları kalmıştı. CRM'den gelen LUNA, MOKA, MONTANA, LEORA aynı slug'ı bulduğu için '-2' ekiyle kaydedildi: /collections/luna-2.

**Sonra:** Ürünsüz ve görselsiz 5 örnek koleksiyon silindi, '-2' ekleri kaldırıldı. Adresler /collections/luna biçiminde.

**Neden:** Ürün silmek koleksiyonu silmiyor. Adres SEO'nun parçası; sonradan değiştirmek bağlantı kırar, ilk yüklemede düzeltilmeli.

---


### Düzeltme — Yeni ürünlerin stoğu yazılmıyordu

**28.07.2026 · 20:11** · Onur + Claude · `KAT-05`

**Önce:** Stok bloğu 'if (!kuru && mevcut)' koşuluyla çalışıyordu. 'mevcut' yalnızca daha önce kaydedilmiş ürünlerde dolu olduğu için ilk yüklemede 948 ürünün hiçbirine stok hareketi açılmadı; hepsi sitede stoksuz görünecekti.

**Sonra:** Ürün kimliği create ve update dallarının ikisinden de 'urunId' değişkenine alınıyor, stok bloğu 'if (!kuru && urunId)' ile çalışıyor. Yeni üründe mevcut stok 0 sayılıp fark kadar giriş açılıyor. Gerçek çalıştırmada 422 ürüne stok hareketi yazıldı.

**Neden:** Hata yalnızca ilk yüklemede ortaya çıkıyordu; sonraki çalıştırmalarda ürünler mevcut sayıldığı için stok yazılıyordu. Kuru çalıştırma stok yazmadığı için raporda da görünmedi.

---


### Düzeltme — Ürünü olmayan koleksiyon kartlarındaki saydamlık kaldırıldı

**28.07.2026 · 13:44** · Onur + Claude · `KAT-02`

**Önce:** Leora ve Moka koleksiyonlarının ürünü olmadığı için kartlarına %74 saydamlık uygulanmıştı. Amaç 'tıklanamaz' sinyali vermekti.

**Sonra:** Saydamlık kaldırıldı, görseller tam kalitede gösteriliyor. Bilgi belirginleştirilmiş 'Скоро' etiketiyle veriliyor.

**Neden:** Vitrin sayfasında soluk fotoğraf, kullanıcı tarafından arayüz durumu değil GÖRSEL KALİTESİZLİK olarak okunuyor. Kullanıcı bunu fark edip sordu. Arayüz mantığı (pasif öğe soluk olur) panelde doğru, vitrinde yanlış — müşteri o fotoğrafa bakıp markayı yargılıyor.

---


### Değişiklik — Site artık veritabanından okuyor

**28.07.2026 · 12:59** · Onur + Claude · `KAT-01`

**Önce:** Ürün ve koleksiyon verisi lib/catalog.ts dosyasından okunuyordu. Veritabanı kurulmuş ve doldurulmuştu ama site onu kullanmıyordu — veri iki yerde birden duruyordu.

**Sonra:** lib/db/catalog.ts okuma katmanı yazıldı. Ana sayfa, ürün ve koleksiyon sayfaları veritabanından besleniyor. lib/catalog.ts yalnızca ilk tohumlama için duruyor. Stok, StockMove hareketlerinin toplamı olarak hesaplanıyor.

**Neden:** İki veri kaynağı er geç çelişir. Panelden yapılan değişikliğin siteye yansıması ancak tek kaynakla mümkün.

---


### Ekleme — Ürün sayfasında ölçü ve kumaş seçimi devreye girdi

**28.07.2026 · 12:19** · Onur + Claude · `KAT-08`

**Önce:** Ürün sayfası tek fiyat gösteriyordu. Müşteri ölçü veya kumaş seçemiyor, fiyatın neye göre değiştiğini göremiyordu.

**Sonra:** Ölçü kartları (her biri kendi fiyatı ve stok durumuyla) ve gruplu kumaş seçici eklendi. Fiyat seçimle birlikte anlık güncelleniyor: taban fiyat + kumaş farkı. Seçilen ölçü ve kumaş WhatsApp siparişine ve alt bara yansıyor.

**Neden:** Konfigüre edilebilen üründe müşteri satın alma sürecine dahil oluyor; premium mobilyada dönüşümü belirgin artıran unsur.

---


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

