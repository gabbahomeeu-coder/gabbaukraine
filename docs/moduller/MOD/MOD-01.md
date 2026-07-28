# MOD-01 · Kayıt defteri

> Modül ve alt modül tanımlarını tutar, panel haritasını üretir.

- **Üst modül:** [MOD · Modül Yönetimi](./README.md)
- **Yayınladığı olaylar:** —
- **Dinlediği olaylar:** —

## Kılavuz — değişiklik arşivi

Her düzeltme ve güncelleme buraya yazılır: tarih, saat, yazar, önce/sonra.
Yeni kayıt eklemek için:

```bash
node scripts/kilavuz.mjs ekle MOD-01 --tip duzeltme --baslik "..." --once "..." --sonra "..."
```

<!-- KAYITLAR -->

### Değişiklik — Site Vercel'den kendi VPS'imize taşınacak

**28.07.2026 · 09:43** · Onur + Claude

**Önce:** Site Vercel'de çalışıyordu; veritabanı için Supabase düşünülmüştü. İki ayrı hizmet, iki ayrı fatura, site-veritabanı arası ağ gecikmesi.

**Sonra:** Natro'dan alınacak VPS'te hem site hem PostgreSQL çalışacak. Önünde Cloudflare olacak. Vercel ve Supabase kullanılmayacak.

**Neden:** Kullanıcı altyapının tamamen kendi kontrolünde olmasını istiyor. Aynı makinede site ve veritabanı olması gecikmeyi de ortadan kaldırıyor.

---

