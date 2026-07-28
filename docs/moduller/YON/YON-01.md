# YON-01 · Giriş

> Yönetici kimlik doğrulaması ve oturum.

- **Üst modül:** [YON · Yönetim](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle YON-01 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Düzeltme — SSH şifre girişi açık kalmıştı

**28.07.2026 · 12:43** · Onur + Claude

**Önce:** Şifreyle girişi kapatan ayar dosyası 99- ön ekiyle yazılmıştı. Ubuntu'nun cloud-init dosyası 50- ön ekiyle daha önce okunuyor ve SSH'ta İLK tanımlanan değer kazandığı için şifre girişi açık kalmaya devam ediyordu.

**Sonra:** Ayar dosyası 01-gabba.conf olarak yeniden adlandırıldı ve cloud-init dosyasındaki satır da düzeltildi. Doğrulandı: sunucu artık yalnızca publickey kabul ediyor.

**Neden:** Kurulumdan sonra 'kapattık' varsayıp geçseydik, sohbette paylaşılan şifreyle sunucuya erişim mümkün kalacaktı.

---

