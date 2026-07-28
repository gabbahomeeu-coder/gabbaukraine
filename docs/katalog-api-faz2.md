# Katalog API — ürün ölçüleri

**Uç nokta:** `GET https://crm.gabbahome.eu/api/catalog`
**Tarih:** 29 Temmuz 2026
**Durum:** Faz 1 çalışıyor, 948 ürün canlı siteye aktarıldı.

Bu belgede tek bir konu var: **ürün ölçüleri.** İki ekleme gerekiyor —
ölçü alanları ve aynı ürünün farklı ölçülerinin gruplanması. İkisi de
**mevcut alanlara dokunmadan** yapılabilir.

---

## Faz 1 — çalışan kısım

Şu an gelen ürün kaydı:

```json
{
  "id": "PRD-2640",
  "sku": "BRAB-112",
  "name": "Консоль+Дзеркало",
  "isActive": true,
  "supplier":   { "id": "SUP-1", "name": "..." },
  "collection": { "id": "COL-7", "name": "BRAGA BLACK", "images": [ ... ] },
  "currency": "UAH",
  "price": 197953.0,
  "stock": 2,
  "images": [
    {
      "url": "https://img.gabbahome.eu/products/22.png",
      "type": "cutout",
      "index": 0,
      "width": 781,
      "height": 656,
      "orientation": "landscape"
    }
  ]
}
```

Bu yapıyla aktarılan veri: **4 tedarikçi, 57 koleksiyon, 948 ürün, 1706
benzersiz görsel.** Bekçi hiçbir kaydı reddetmedi — fiyat, stok ve para
birimi alanları temiz.

**Görsel indeksleme talebi tamamlanmış durumda.** `index`, `orientation`,
`width`, `height` ve `type` alanları sayesinde panelde koleksiyon kapağı
seçimi yatay/dikey ayrımıyla çalışıyor. Bu haliyle yeterli.

Eksik olan tek şey ölçü.

---

## 1 · Ölçü alanları

Mobilya alışverişinde ölçü, fiyattan sonra en çok sorulan bilgidir. Şu an
sitede hiçbir üründe ölçü gösterilemiyor.

Ürün kaydına eklenecek:

```json
"dimensions": {
  "widthCm": 220,
  "depthCm": 95,
  "heightCm": 76
}
```

**Kurallar**

- Birim santimetre, ondalık serbest (`76` ya da `76.5`).
- Bilinmeyen ölçü **`null`** olsun — tahmini ya da sıfır değer gönderilmesin.
  Sitede yanlış ölçü, eksik ölçüden çok daha kötüdür.
- Ölçü hiç yoksa `"dimensions": null` da kabul edilir.

**Bu bilgi CRM'de zaten var ama ada gömülü.** Şu anki veride:

```
Стіл 220см                    ← genişlik ad metninin içinde
Стіл 240см
Розкладний стіл (240cm-300cm)
```

Ad metninden ayrıştırmak güvenilir değil: derinlik ve yükseklik hiç yok,
yazım da tutarsız (`см`, `cm`, parantezli aralık). Ayrı alan gerekiyor.

---

## 2 · Ölçü varyantları

Aynı ürünün farklı ölçüleri şu an **ayrı ürün** olarak geliyor:

| id | name | price |
|---|---|---|
| PRD-xxxx | Стіл 220см | ... |
| PRD-yyyy | Стіл 240см | ... |

Sitede bunlar iki ayrı kart oluyor. Doğru davranış tek ürün sayfası ve
içinde ölçü seçimi: müşteri masayı bulur, 220 mi 240 mı seçer, fiyat ona
göre değişir. İki kart hem arama sonuçlarını böler hem müşteriyi
"hangisi?" sorusunda bırakır.

Bunun için hangi kayıtların aynı ürünün farklı ölçüsü olduğunu CRM'in
söylemesi gerekiyor:

```json
"variantGroup": "TBL-MADRID",
"variantLabel": "220 см"
```

**Kurallar**

- `variantGroup` — aynı ürünün tüm ölçüleri **aynı değeri** taşır. Değerin
  ne olduğu önemli değil, tutarlı olması yeterli (SKU kökü, ürün kodu,
  serbest metin — hepsi olur).
- `variantLabel` — müşteriye gösterilecek etiket. Ukraynaca yazılmalı,
  siteye olduğu gibi çıkacak.
- Tek ölçüsü olan ürünlerde ikisi de `null` — bunlar bugünkü gibi tek
  ürün olarak işlenir.
- Fiyat ve stok her kayıtta ayrı kalır; grup yalnızca birleştirme bilgisidir.

**Beklenen sonuç**

```json
{ "id": "PRD-1001", "name": "Стіл Madrid", "price": 84000,
  "variantGroup": "TBL-MADRID", "variantLabel": "220 см",
  "dimensions": { "widthCm": 220, "depthCm": 95, "heightCm": 76 } }

{ "id": "PRD-1002", "name": "Стіл Madrid", "price": 92000,
  "variantGroup": "TBL-MADRID", "variantLabel": "240 см",
  "dimensions": { "widthCm": 240, "depthCm": 95, "heightCm": 76 } }
```

Site bunları tek sayfada iki seçenek olarak gösterir.

---

## Geriye dönük uyumluluk

İki eklemenin de **mevcut alanlara etkisi yok.** Senkron:

- tanımadığı alanları görmezden gelir,
- eksik alanları `null` sayar,
- yeni alanlar geldiğinde ek bir sürüm gerektirmez.

Bu yüzden ikisi aynı anda yapılmak zorunda değil. Önce ölçü alanları
(1), sonra varyant grubu (2) gelebilir — arada site çalışmaya devam eder.

---

## Doğrulama

Değişiklikten sonra tek istekle kontrol edilebilir:

```bash
curl -H "Authorization: Bearer <anahtar>" \
     "https://crm.gabbahome.eu/api/catalog?page=1&pageSize=3" | jq '.items[0]'
```

Kontrol listesi:

- [ ] `dimensions` alanı var, birim cm
- [ ] Bilinmeyen ölçüler `null` — sıfır ya da tahmini değer yok
- [ ] Aynı ürünün farklı ölçüleri aynı `variantGroup` değerini taşıyor
- [ ] `variantLabel` Ukraynaca ve müşteriye gösterilebilir durumda
- [ ] Tek ölçülü üründe `variantGroup` ve `variantLabel` `null`

Site tarafında senkron kuru çalıştırma ile denenir; veritabanına hiçbir
şey yazmadan ne geleceğini raporlar.
