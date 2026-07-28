# MOD-04 · Sağlık

> Modüllerin çalışır durumda olup olmadığını düzenli kontrol eder.

- **Üst modül:** [MOD · Modül Yönetimi](./README.md)
- **Yayınladığı olaylar:** `modul.saglik.dustu`
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle MOD-04 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Düzeltme — Panelden yapılan değişiklikler siteye yansımıyordu

**28.07.2026 · 18:52** · Onur + Claude

**Önce:** Panelde fiyat, vitrin veya kapak değiştirildiğinde kaydediliyordu ama site eski hâlinde kalıyordu. Sayfa yeniden üretilmek istendiğinde yazacak yer bulamıyordu: sunucudaki .next/standalone/.next/cache dizini hiç oluşturulmamıştı.

**Sonra:** Yayınlama betiği artık bu dizini oluşturup derleme önbelleğini kopyalıyor. Doğrulandı: panelden fiyat değişikliği kaydedildiği anda site güncellendi.

**Neden:** Next.js standalone çıktısı ISR önbelleğini kendiliğinden taşımıyor. Bu eksik, panelin tamamını işlevsiz bırakıyordu — kullanıcı 'güncellemeler siteye yansımıyor' diyerek fark etti.

---


### Ekleme — Sunucu kuruldu, site canlıya alındı

**28.07.2026 · 12:43** · Onur + Claude

**Önce:** Kod yalnızca yerel makinede çalışıyordu. Veritabanı yoktu, yayın ortamı yoktu.

**Sonra:** Natro VPS'te Ubuntu 24.04 üzerine kuruldu: Node 22, PostgreSQL 16 (yalnızca yerel erişim), Caddy, systemd servisi, ufw, fail2ban. Site http://185.22.184.99 adresinde yayında. Gecelik veritabanı yedeği 03:30'da alınıyor, 14 gün saklanıyor. npm run yayinla ile tek komutla güncelleme yapılıyor.

**Neden:** Vercel ve Supabase yerine kendi altyapımızda çalışma kararı verildi; kontrol ve maliyet bizde.

---

