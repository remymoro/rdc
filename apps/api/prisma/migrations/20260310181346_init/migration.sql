-- CreateEnum
CREATE TYPE "StatutCentre" AS ENUM ('ACTIF', 'INACTIF', 'ARCHIVE');

-- CreateTable
CREATE TABLE "Centre" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "statut" "StatutCentre" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Centre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Centre_nom_ville_codePostal_adresse_key" ON "Centre"("nom", "ville", "codePostal", "adresse");
