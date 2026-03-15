-- CreateEnum
CREATE TYPE "StatutCollecte" AS ENUM ('PREPARATION', 'INSCRIPTIONS_OUVERTES', 'INSCRIPTIONS_FERMEES', 'EN_COURS', 'SAISIE_EN_COURS', 'TERMINEE');

-- CreateEnum
CREATE TYPE "StatutParticipation" AS ENUM ('EN_ATTENTE', 'CONFIRME', 'REFUSE');

-- CreateTable
CREATE TABLE "Collecte" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "dateFinSaisie" TIMESTAMP(3) NOT NULL,
    "statut" "StatutCollecte" NOT NULL DEFAULT 'PREPARATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collecte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipationMagasin" (
    "collecteId" TEXT NOT NULL,
    "magasinId" TEXT NOT NULL,
    "statut" "StatutParticipation" NOT NULL DEFAULT 'EN_ATTENTE',

    CONSTRAINT "ParticipationMagasin_pkey" PRIMARY KEY ("collecteId","magasinId")
);

-- CreateTable
CREATE TABLE "Produit" (
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "famille" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "collecteId" TEXT NOT NULL,
    "magasinId" TEXT NOT NULL,
    "benevoleNom" TEXT NOT NULL,
    "benevolePrenom" TEXT NOT NULL,
    "benevoleTel" TEXT,
    "heureDebut" TIMESTAMP(3) NOT NULL,
    "heureFin" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneSaisie" (
    "slotId" TEXT NOT NULL,
    "produitCode" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "LigneSaisie_pkey" PRIMARY KEY ("slotId","produitCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collecte_nom_key" ON "Collecte"("nom");

-- CreateIndex
CREATE INDEX "ParticipationMagasin_collecteId_idx" ON "ParticipationMagasin"("collecteId");

-- CreateIndex
CREATE INDEX "Slot_collecteId_idx" ON "Slot"("collecteId");

-- CreateIndex
CREATE INDEX "Slot_magasinId_idx" ON "Slot"("magasinId");

-- AddForeignKey
ALTER TABLE "ParticipationMagasin" ADD CONSTRAINT "ParticipationMagasin_collecteId_fkey" FOREIGN KEY ("collecteId") REFERENCES "Collecte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationMagasin" ADD CONSTRAINT "ParticipationMagasin_magasinId_fkey" FOREIGN KEY ("magasinId") REFERENCES "Magasin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_collecteId_fkey" FOREIGN KEY ("collecteId") REFERENCES "Collecte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_magasinId_fkey" FOREIGN KEY ("magasinId") REFERENCES "Magasin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneSaisie" ADD CONSTRAINT "LigneSaisie_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneSaisie" ADD CONSTRAINT "LigneSaisie_produitCode_fkey" FOREIGN KEY ("produitCode") REFERENCES "Produit"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
