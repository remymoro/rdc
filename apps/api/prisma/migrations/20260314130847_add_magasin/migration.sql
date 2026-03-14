-- CreateTable
CREATE TABLE "Magasin" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "statut" "StatutCentre" NOT NULL DEFAULT 'ACTIF',
    "centreId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Magasin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Magasin_centreId_idx" ON "Magasin"("centreId");

-- CreateIndex
CREATE UNIQUE INDEX "Magasin_nom_ville_codePostal_adresse_key" ON "Magasin"("nom", "ville", "codePostal", "adresse");

-- AddForeignKey
ALTER TABLE "Magasin" ADD CONSTRAINT "Magasin_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
