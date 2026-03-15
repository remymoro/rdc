import { Injectable } from '@nestjs/common';
import {
  Collecte,
  CollecteId,
  CollecteProps,
  ICollecteRepository,
  MagasinId,
  Nom,
  PeriodeCollecte,
  StatutCollecte,
  StatutParticipation,
} from '@rdc/domain';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectePrismaRepository implements ICollecteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: CollecteId): Promise<Collecte | null> {
    const data = await this.prisma.collecte.findUnique({
      where: { id: id.value },
      include: { participations: true },
    });

    if (!data) return null;

    return Collecte.reconstituer(this.toProps(data));
  }

  async findAll(): Promise<Collecte[]> {
    const data = await this.prisma.collecte.findMany({
      include: { participations: true },
      orderBy: { createdAt: 'desc' },
    });

    return data.map(d => Collecte.reconstituer(this.toProps(d)));
  }

  async save(collecte: Collecte): Promise<void> {
    const participations = collecte.participations;

    await this.prisma.$transaction(async tx => {
      await tx.collecte.upsert({
        where: { id: collecte.id.value },
        create: {
          id: collecte.id.value,
          nom: collecte.nom.value,
          dateDebut: collecte.periode.dateDebut,
          dateFin: collecte.periode.dateFin,
          dateFinSaisie: collecte.periode.dateFinSaisie,
          statut: collecte.statut,
          createdAt: collecte.createdAt,
          updatedAt: collecte.updatedAt,
        },
        update: {
          nom: collecte.nom.value,
          dateDebut: collecte.periode.dateDebut,
          dateFin: collecte.periode.dateFin,
          dateFinSaisie: collecte.periode.dateFinSaisie,
          statut: collecte.statut,
          updatedAt: collecte.updatedAt,
        },
      });

      // Sync participations : supprimer celles qui ne sont plus dans l'agrégat
      const magasinIds = participations.map(p => p.magasinId.value);

      await tx.participationMagasin.deleteMany({
        where: {
          collecteId: collecte.id.value,
          magasinId: { notIn: magasinIds },
        },
      });

      // Upsert des participations actuelles
      for (const p of participations) {
        await tx.participationMagasin.upsert({
          where: {
            collecteId_magasinId: {
              collecteId: collecte.id.value,
              magasinId: p.magasinId.value,
            },
          },
          create: {
            collecteId: collecte.id.value,
            magasinId: p.magasinId.value,
            statut: p.statut,
          },
          update: {
            statut: p.statut,
          },
        });
      }
    });
  }

  async delete(id: CollecteId): Promise<void> {
    await this.prisma.collecte.delete({
      where: { id: id.value },
    });
  }

  private toProps(data: {
    id: string;
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    dateFinSaisie: Date;
    statut: string;
    createdAt: Date;
    updatedAt: Date;
    participations: { magasinId: string; statut: string }[];
  }): CollecteProps {
    return {
      id: CollecteId.create(data.id),
      nom: Nom.create(data.nom),
      periode: PeriodeCollecte.create(data.dateDebut, data.dateFin, data.dateFinSaisie),
      statut: data.statut as StatutCollecte,
      participations: data.participations.map(p => ({
        magasinId: MagasinId.create(p.magasinId),
        statut: p.statut as StatutParticipation,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
