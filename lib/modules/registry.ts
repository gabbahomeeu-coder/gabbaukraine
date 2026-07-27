/**
 * ══════════════════════════════════════════════════════════════
 * MODÜL KAYIT DEFTERİ — MOD-01
 *
 * Sistemin tek doğruluk kaynağı. Panel ekranı, kılavuz dosyaları ve
 * veritabanındaki modül kayıtları hep buradan üretilir.
 *
 * Künye biçimi:  KAT      → modül
 *                KAT-03   → alt modül
 *
 * Kurallar:
 *  - Alt modüller aynı modül içinde SİNİR SİSTEMİ ile konuşur (doğrudan çağrı)
 *  - Modüller arası her geçiş ATARDAMAR'dır: olay yayınlanır, omurga taşır
 *  - Her atardamar geçişi BEKÇİ'den geçer (şekil · tekrar · yetki)
 * ══════════════════════════════════════════════════════════════
 */

export type ModuleLayer = "PLATFORM" | "IS";

export type SubModuleDef = {
  /** künye — "KAT-03" */
  code: string;
  name: string;
  /** tek cümlelik sorumluluk */
  responsibility: string;
  /** yayınladığı olaylar (atardamar çıkışı) */
  emits?: string[];
  /** dinlediği olaylar (atardamar girişi) */
  listens?: string[];
};

export type ModuleDef = {
  /** künye — "KAT" */
  code: string;
  name: string;
  layer: ModuleLayer;
  /** çekirdek modül panelden kapatılamaz */
  isCore: boolean;
  /** çalışmak için gereken modüller */
  dependsOn: string[];
  summary: string;
  subModules: SubModuleDef[];
};

/* ───────────────────────── PLATFORM KATMANI ───────────────────────── */

const MOD: ModuleDef = {
  code: "MOD",
  name: "Modül Yönetimi",
  layer: "PLATFORM",
  isCore: true,
  dependsOn: [],
  summary:
    "Modül kayıt defteri: hangi modül var, açık mı, ayarları ne, sağlıklı mı. Kılavuz arşivini tutar.",
  subModules: [
    {
      code: "MOD-01",
      name: "Kayıt defteri",
      responsibility: "Modül ve alt modül tanımlarını tutar, panel haritasını üretir.",
    },
    {
      code: "MOD-02",
      name: "Aç/kapat",
      responsibility: "Modülleri devreye alır veya çıkarır, bağımlılıkları kontrol eder.",
      emits: ["modul.acildi", "modul.kapatildi"],
    },
    {
      code: "MOD-03",
      name: "Ayarlar",
      responsibility: "Her modülün kendi ayarlarını saklar; panel formu bu tanımdan üretilir.",
    },
    {
      code: "MOD-04",
      name: "Sağlık",
      responsibility: "Modüllerin çalışır durumda olup olmadığını düzenli kontrol eder.",
      emits: ["modul.saglik.dustu"],
    },
    {
      code: "MOD-05",
      name: "Kılavuz arşivi",
      responsibility:
        "Her düzeltme ve güncellemeyi tarih, saat, yazar, önce/sonra ile kaydeder; alt modül kaydını üst modüle yükseltir.",
    },
  ],
};

const API: ModuleDef = {
  code: "API",
  name: "Dış Temas",
  layer: "PLATFORM",
  isCore: true,
  dependsOn: ["MOD"],
  summary:
    "Sistemin dış dünyayla tek teması. Katalog kaynağı, reklam, Telegram, ödeme, kargo — hepsi buradan geçer.",
  subModules: [
    {
      code: "API-01",
      name: "Dış kapı",
      responsibility: "Mobil, bayi ve pazaryeri için dışarıya açılan uçlar.",
    },
    {
      code: "API-02",
      name: "Anahtar & yetki",
      responsibility: "API anahtarları, yetki kapsamları ve oran sınırları.",
    },
    {
      code: "API-03",
      name: "Entegrasyon merkezi",
      responsibility: "Dış servis bağlantıları ve şifrelenmiş anahtarları tek yerde tutar.",
    },
    {
      code: "API-04",
      name: "Gelen webhook",
      responsibility: "Ödeme onayı, kargo durumu gibi dışarıdan gelen bildirimleri karşılar.",
      emits: ["odeme.basarili", "odeme.basarisiz", "kargo.durum.degisti"],
    },
    {
      code: "API-05",
      name: "Katalog çekimi",
      responsibility: "Katalog sunucusundan ürün, fiyat, stok ve görselleri çeker.",
      emits: ["katalog.senkronlandi", "katalog.senkron.uyari"],
    },
    {
      code: "API-06",
      name: "Bekçi",
      responsibility:
        "Her atardamar geçişinde şekil, tekrar ve yetki kontrolü yapar; geçersiz veriyi karantinaya alır.",
      emits: ["olay.karantinaya.alindi"],
    },
  ],
};

const YON: ModuleDef = {
  code: "YON",
  name: "Yönetim",
  layer: "PLATFORM",
  isCore: true,
  dependsOn: ["MOD"],
  summary: "Panel girişi, roller, işlem günlüğü ve sistem ayarları.",
  subModules: [
    { code: "YON-01", name: "Giriş", responsibility: "Yönetici kimlik doğrulaması ve oturum." },
    { code: "YON-02", name: "Roller", responsibility: "Kim neyi görebilir ve değiştirebilir." },
    {
      code: "YON-03",
      name: "Denetim kaydı",
      responsibility: "Her yönetici işlemini öncesi/sonrasıyla kaydeder.",
    },
    { code: "YON-04", name: "Sistem ayarları", responsibility: "Site geneli ayarlar." },
  ],
};

const DIL: ModuleDef = {
  code: "DIL",
  name: "Diller",
  layer: "PLATFORM",
  isCore: true,
  dependsOn: ["MOD"],
  summary:
    "Çok dilli içerik altyapısı. Ukraynaca varsayılan; Rusça ve İngilizce sonradan doldurulur.",
  subModules: [
    { code: "DIL-01", name: "Dil yönetimi", responsibility: "Hangi diller açık, hangisi varsayılan." },
    {
      code: "DIL-02",
      name: "Çeviri havuzu",
      responsibility: "Ürün, koleksiyon ve içerik metinlerinin dil karşılıkları.",
    },
    {
      code: "DIL-03",
      name: "Biçim & para birimi",
      responsibility: "Tarih, sayı ve para biçimleri; ₴ gösterimi.",
    },
  ],
};

/* ─────────────────────────── İŞ KATMANI ─────────────────────────── */

const KAT: ModuleDef = {
  code: "KAT",
  name: "Katalog",
  layer: "IS",
  isCore: true,
  dependsOn: ["MOD", "API", "DIL"],
  summary:
    "Ürün, koleksiyon, stok ve kumaş. Fiyat/stok dış sunucudan gelir — bu modül verinin sahibi değil aynasıdır.",
  subModules: [
    {
      code: "KAT-01",
      name: "Ürün & ölçüler",
      responsibility: "Ürün kaydı, taban fiyat ve dış sunucudan gelen ölçüler.",
      emits: ["urun.guncellendi"],
    },
    {
      code: "KAT-02",
      name: "Koleksiyon & kategori",
      responsibility: "Ürünlerin gruplanması ve site içindeki düzeni.",
    },
    {
      code: "KAT-03",
      name: "Stok",
      responsibility: "Adet takibi hareketlerle tutulur; rezervasyon ve düşüm burada.",
      emits: ["stok.tukendi", "stok.azaldi"],
      listens: ["odeme.basarili", "siparis.iptal"],
    },
    {
      code: "KAT-04",
      name: "Medya",
      responsibility: "Ürün görselleri; çoğu dış sunucuda barınır.",
    },
    {
      code: "KAT-05",
      name: "Dış senkron",
      responsibility:
        "Katalog sunucusundan gelen veriyi işler; bizim yazdığımız alanları asla ezmez.",
      listens: ["katalog.senkronlandi"],
    },
    {
      code: "KAT-06",
      name: "Yerel zenginleştirme",
      responsibility: "SEO metni, öne çıkanlar, koleksiyon düzeni — senkronda korunur.",
    },
    {
      code: "KAT-07",
      name: "Tedarikçi",
      responsibility: "Hangi ürün hangi tedarikçiden; maliyet ve teslim süresi.",
    },
    {
      code: "KAT-08",
      name: "Varyant & kumaş",
      responsibility:
        "Ölçü seçenekleri (kendi fiyatı ve stoğu olan) ile kumaş seçenekleri (fiyat farkı ekleyen).",
    },
    {
      code: "KAT-09",
      name: "Ölçü asistanı",
      responsibility: "Müşterinin odasına sığıp sığmayacağını gösterir.",
    },
  ],
};

const SIP: ModuleDef = {
  code: "SIP",
  name: "Sipariş",
  layer: "IS",
  isCore: true,
  dependsOn: ["KAT", "API"],
  summary: "Sepet, ödeme, kargo ve sipariş durumu. Paranın aktığı yer.",
  subModules: [
    {
      code: "SIP-01",
      name: "Sepet",
      responsibility: "Seçilen ürün, ölçü ve kumaş; bağlantı kesilse de cihazda korunur.",
      emits: ["sepete.eklendi", "siparis.olusturuldu"],
    },
    {
      code: "SIP-02",
      name: "Ödeme",
      responsibility: "Ödeme sağlayıcısına yönlendirme ve sonucun işlenmesi.",
      listens: ["odeme.basarili", "odeme.basarisiz"],
    },
    { code: "SIP-03", name: "Kargo", responsibility: "Nova Poshta gönderi kaydı ve takibi." },
    {
      code: "SIP-04",
      name: "Durum",
      responsibility: "Siparişin hangi aşamada olduğu ve müşteriye bildirimi.",
      emits: ["siparis.durum.degisti"],
    },
    { code: "SIP-05", name: "İade", responsibility: "İade ve iptal süreci." },
    {
      code: "SIP-06",
      name: "Taksit",
      responsibility: "Aylık ödeme tutarının hesaplanması ve gösterimi.",
    },
  ],
};

const MUS: ModuleDef = {
  code: "MUS",
  name: "Müşteri",
  layer: "IS",
  isCore: false,
  dependsOn: ["SIP"],
  summary: "Profil, adres, iletişim geçmişi ve segmentler — CRM katmanı.",
  subModules: [
    {
      code: "MUS-01",
      name: "Profil",
      responsibility: "Müşteri kaydı; her sipariş ve talepte oluşur veya güncellenir.",
      emits: ["musteri.olusturuldu"],
      listens: ["siparis.olusturuldu", "talep.olusturuldu"],
    },
    { code: "MUS-02", name: "Adres", responsibility: "Teslimat ve fatura adresleri." },
    {
      code: "MUS-03",
      name: "İletişim geçmişi",
      responsibility: "Telefon, WhatsApp ve Telegram görüşmelerinin kaydı.",
    },
    {
      code: "MUS-04",
      name: "Segment",
      responsibility: "Müşteri grupları; hedefleme ve raporlama için.",
      emits: ["segment.degisti"],
    },
  ],
};

const TLP: ModuleDef = {
  code: "TLP",
  name: "Talepler",
  layer: "IS",
  isCore: false,
  dependsOn: ["MUS"],
  summary:
    "Kumaş örneği, showroom randevusu ve geri arama. Premium mobilyada en yüksek niyetli müşteri buradan gelir.",
  subModules: [
    {
      code: "TLP-01",
      name: "Kumaş örneği",
      responsibility: "Müşteriye ücretsiz kumaş örneği gönderimi talebi.",
      emits: ["talep.olusturuldu"],
    },
    {
      code: "TLP-02",
      name: "Showroom randevusu",
      responsibility: "Şubeye ziyaret randevusu; satışçı önceden hazırlanır.",
      emits: ["talep.olusturuldu", "randevu.olusturuldu"],
    },
    { code: "TLP-03", name: "Geri arama", responsibility: "Müşterinin aranma talebi." },
    {
      code: "TLP-04",
      name: "Talep akışı",
      responsibility: "Taleplerin durumu: yeni, ilgileniliyor, tamamlandı.",
    },
  ],
};

const KMP: ModuleDef = {
  code: "KMP",
  name: "Kampanya",
  layer: "IS",
  isCore: false,
  dependsOn: ["KAT"],
  summary: "Günlük indirim, kuponlar ve kampanya kuralları.",
  subModules: [
    {
      code: "KMP-01",
      name: "Günlük indirim",
      responsibility: "Her gün belirli ürünlere internet satışına özel indirim.",
      emits: ["kampanya.dondu"],
    },
    { code: "KMP-02", name: "Kupon", responsibility: "İndirim kodları ve kullanım takibi." },
    {
      code: "KMP-03",
      name: "Kural motoru",
      responsibility: "Hangi ürün hangi koşulda indirime girer — kodla değil kuralla.",
    },
  ],
};

const REK: ModuleDef = {
  code: "REK",
  name: "Reklam",
  layer: "IS",
  isCore: false,
  dependsOn: ["API", "ANL"],
  summary: "Google Ads kampanyaları, bütçe ve reklam geri dönüşü.",
  subModules: [
    { code: "REK-01", name: "Google Ads bağlantısı", responsibility: "Reklam hesabına bağlantı." },
    { code: "REK-02", name: "Kampanya & bütçe", responsibility: "Kampanya durumu ve harcama." },
    { code: "REK-03", name: "Hedef kitle", responsibility: "Yeniden hedefleme listeleri." },
    {
      code: "REK-04",
      name: "Geri dönüş",
      responsibility: "Hangi reklam hangi satışı getirdi.",
      listens: ["odeme.basarili"],
    },
  ],
};

const ANL: ModuleDef = {
  code: "ANL",
  name: "Analitik",
  layer: "IS",
  isCore: false,
  dependsOn: ["MOD"],
  summary:
    "Kendi ziyaretçi analitiğimiz. Veri bizde kalır. Ziyaret kayıtları omurgaya değil kendi tablosuna yazılır.",
  subModules: [
    {
      code: "ANL-01",
      name: "Ziyaretçi oturumu",
      responsibility: "Oturum başlangıcı, süresi ve kaynağı.",
    },
    {
      code: "ANL-02",
      name: "Sayfa akışı",
      responsibility: "Hangi sayfaya girdi, sonra nereye gitti — gerçek gezinme sırası.",
    },
    { code: "ANL-03", name: "Konum & cihaz", responsibility: "Şehir, cihaz, tarayıcı." },
    {
      code: "ANL-04",
      name: "Canlı ziyaretçi",
      responsibility: "Şu anda sitede kim var, hangi sayfada.",
      emits: ["ziyaretci.geldi"],
    },
    {
      code: "ANL-05",
      name: "Bildirim kuralları",
      responsibility:
        "Hangi ziyaret bildirim doğurur — her ziyaret değil, kurala uyanlar. Panelden aç/kapat.",
    },
    {
      code: "ANL-06",
      name: "A/B deneyleri",
      responsibility: "Hangi başlık, görsel veya fiyat gösterimi daha çok satıyor.",
    },
  ],
};

const OLC: ModuleDef = {
  code: "OLC",
  name: "Dış Ölçüm",
  layer: "IS",
  isCore: false,
  dependsOn: ["API"],
  summary: "Meta Pixel, GA4 ve sunucu taraflı dönüşüm bildirimi.",
  subModules: [
    { code: "OLC-01", name: "Pixel & GA4", responsibility: "Tarayıcı tarafı ölçüm kodları." },
    {
      code: "OLC-02",
      name: "Sunucu olayları",
      responsibility: "Dönüşümleri sunucudan bildirir — tarayıcı engellense de kaybolmaz.",
      listens: ["odeme.basarili", "sepete.eklendi"],
    },
    {
      code: "OLC-03",
      name: "Dönüşüm eşleme",
      responsibility: "Hangi olay hangi platformda hangi dönüşüme karşılık geliyor.",
    },
  ],
};

const TLG: ModuleDef = {
  code: "TLG",
  name: "Telegram",
  layer: "IS",
  isCore: false,
  dependsOn: ["API"],
  summary: "Bot üzerinden yönetici ve müşteri bildirimleri.",
  subModules: [
    { code: "TLG-01", name: "Bot & kanal", responsibility: "Bot bağlantısı ve hedef sohbetler." },
    {
      code: "TLG-02",
      name: "Yönetici bildirimi",
      responsibility: "Sipariş, talep ve kurala uyan ziyaretler yöneticiye düşer.",
      listens: ["siparis.olusturuldu", "talep.olusturuldu", "ziyaretci.geldi", "modul.saglik.dustu"],
    },
    {
      code: "TLG-03",
      name: "Müşteri bildirimi",
      responsibility: "Sipariş durumu ve kargo bilgisi müşteriye.",
      listens: ["siparis.durum.degisti"],
    },
    {
      code: "TLG-04",
      name: "Komutlar",
      responsibility: "Telegram üzerinden hızlı sorgu ve işlem.",
    },
  ],
};

const RPR: ModuleDef = {
  code: "RPR",
  name: "Raporlama",
  layer: "IS",
  isCore: false,
  dependsOn: ["SIP", "ANL"],
  summary: "Tüm modüllerden veri toplayıp tek yerde gösterir.",
  subModules: [
    { code: "RPR-01", name: "Satış", responsibility: "Ciro, sipariş adedi, ortalama sepet." },
    { code: "RPR-02", name: "Trafik", responsibility: "Ziyaretçi, kaynak ve dönüşüm oranı." },
    { code: "RPR-03", name: "Reklam geri dönüşü", responsibility: "Harcama ve getiri karşılaştırması." },
    { code: "RPR-04", name: "Stok & tedarikçi", responsibility: "Tükenen ürünler, tedarik süreleri." },
    { code: "RPR-05", name: "Dışa aktarma", responsibility: "Raporların tablo veya PDF çıktısı." },
    {
      code: "RPR-06",
      name: "Kârlılık",
      responsibility: "Maliyet ve satış farkı — hangi ürün gerçekten kazandırıyor.",
    },
  ],
};

const ICR: ModuleDef = {
  code: "ICR",
  name: "İçerik",
  layer: "IS",
  isCore: false,
  dependsOn: ["DIL"],
  summary: "Blog, sabit sayfalar ve SEO alanları — organik trafiğin motoru.",
  subModules: [
    {
      code: "ICR-01",
      name: "Blog",
      responsibility: "Yazılar; Ukraynaca içerik planı hazır.",
      emits: ["icerik.yayinlandi"],
    },
    { code: "ICR-02", name: "Sayfalar", responsibility: "Hakkımızda, iletişim, sık sorulanlar." },
    { code: "ICR-03", name: "SEO alanları", responsibility: "Başlık, açıklama ve yapılandırılmış veri." },
    {
      code: "ICR-04",
      name: "Yayın kuyruğu",
      responsibility: "Zamanlanmış yayın ve sosyal paylaşım.",
      listens: ["kampanya.dondu", "icerik.yayinlandi"],
    },
  ],
};

/* ─────────────────────────── DIŞA AKTARIM ─────────────────────────── */

export const MODULES: ModuleDef[] = [
  // platform
  MOD,
  API,
  YON,
  DIL,
  // iş
  KAT,
  SIP,
  MUS,
  TLP,
  KMP,
  REK,
  ANL,
  OLC,
  TLG,
  RPR,
  ICR,
];

export const MODULE_MAP = new Map(MODULES.map((m) => [m.code, m]));

export const SUB_MODULES = MODULES.flatMap((m) =>
  m.subModules.map((s) => ({ ...s, moduleCode: m.code }))
);

export const SUB_MODULE_MAP = new Map(SUB_MODULES.map((s) => [s.code, s]));

/** Bir modülün yayınladığı tüm olaylar */
export function emittedEvents(moduleCode: string): string[] {
  const m = MODULE_MAP.get(moduleCode);
  if (!m) return [];
  return [...new Set(m.subModules.flatMap((s) => s.emits ?? []))];
}

/** Bir olayı kimler dinliyor */
export function listenersOf(eventName: string) {
  return SUB_MODULES.filter((s) => s.listens?.includes(eventName));
}

/** Sistemdeki tüm olay adları — atardamar sözleşmesi */
export const ALL_EVENTS = [
  ...new Set(
    SUB_MODULES.flatMap((s) => [...(s.emits ?? []), ...(s.listens ?? [])])
  ),
].sort();
