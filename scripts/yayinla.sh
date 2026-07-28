#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Siteyi sunucuya yayınla.
#
#   npm run yayinla            → mevcut dalı yayınlar
#   npm run yayinla -- main    → belirtilen dalı yayınlar
#
# Yaptığı iş: yerel değişiklikleri kontrol eder, dalı gönderir,
# sunucuda kodu günceller, göçleri uygular, derler ve servisi
# yeniden başlatır. Site yanıt vermezse günlüğü gösterir.
# ══════════════════════════════════════════════════════════════
set -e

SUNUCU="gabba"
DAL="${1:-$(git rev-parse --abbrev-ref HEAD)}"

echo "── yayınlanacak dal: $DAL"

# commit edilmemiş değişiklik var mı
if [ -n "$(git status --porcelain)" ]; then
  echo
  echo "  Commit edilmemiş değişiklikler var:"
  git status --short | head -10
  echo
  read -rp "  Yine de devam edilsin mi? (bu değişiklikler yayına GİTMEZ) [e/H] " yanit
  [[ "$yanit" =~ ^[eE]$ ]] || { echo "  iptal edildi"; exit 1; }
fi

echo "── dal gönderiliyor"
git push -q origin "$DAL"

echo "── sunucuda güncelleniyor"
ssh "$SUNUCU" "gabba-deploy '$DAL'"

echo
echo "── dışarıdan kontrol"
KOD=$(curl -s -o /dev/null -w "%{http_code}" http://185.22.184.99/)
SURE=$(curl -s -o /dev/null -w "%{time_total}" http://185.22.184.99/)
echo "   ana sayfa: HTTP $KOD (${SURE}s)"
[ "$KOD" = "200" ] || exit 1
