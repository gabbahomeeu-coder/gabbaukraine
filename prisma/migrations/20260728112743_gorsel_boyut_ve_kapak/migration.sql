-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "mobileImage" TEXT;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "kind" TEXT,
ADD COLUMN     "width" INTEGER;
