-- CreateTable
CREATE TABLE "MagasinImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "magasinId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagasinImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MagasinImage_magasinId_idx" ON "MagasinImage"("magasinId");

-- AddForeignKey
ALTER TABLE "MagasinImage" ADD CONSTRAINT "MagasinImage_magasinId_fkey" FOREIGN KEY ("magasinId") REFERENCES "Magasin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
