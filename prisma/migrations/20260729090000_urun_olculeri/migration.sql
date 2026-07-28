-- Kaynaktaki ölçü metni. Sayısal alanlar (widthCm/depthCm/heightCm) yalnızca
-- net üçlüyü taşıyabiliyor; raw ikinci parçayı ve oturma yüksekliğini de içeriyor.
ALTER TABLE "products" ADD COLUMN "dimensionsRaw" TEXT;
