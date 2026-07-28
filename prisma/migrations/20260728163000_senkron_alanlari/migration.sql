-- Yayın kararı ile kaynak durumunu ayır:
--   isActive     → sitede yayında mı (bizim kararımız, senkron dokunmaz)
--   sourceActive → kaynakta satışta mı (senkron günceller)
ALTER TABLE "products" ALTER COLUMN "isActive" SET DEFAULT false;
ALTER TABLE "products" ADD COLUMN "sourceActive" BOOLEAN NOT NULL DEFAULT true;

-- Görseller artık koleksiyona da bağlanabiliyor.
-- Koleksiyon ortam fotoğrafları her üründe tekrarlanmasın diye.
ALTER TABLE "media" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "media" ADD COLUMN "collectionId" TEXT;
ALTER TABLE "media" ADD COLUMN "externalId" TEXT;

CREATE UNIQUE INDEX "media_externalId_key" ON "media"("externalId");
CREATE INDEX "media_collectionId_idx" ON "media"("collectionId");

ALTER TABLE "media" ADD CONSTRAINT "media_collectionId_fkey"
  FOREIGN KEY ("collectionId") REFERENCES "collections"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
