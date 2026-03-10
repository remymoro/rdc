import { Injectable } from '@nestjs/common';
import { ICentreRepository, Centre, CentreId, CentreProps, Nom, CodePostal, StatutCentre } from '@rdc/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CentrePrismaRepository implements ICentreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: CentreId): Promise<Centre | null> {
    const data = await this.prisma.centre.findUnique({
      where: { id: id.value },
    });

    if (!data) return null;

    return Centre.reconstituer({
      id: CentreId.create(data.id),
      nom: Nom.create(data.nom),
      ville: data.ville,
      codePostal: CodePostal.create(data.codePostal),
      adresse: data.adresse,
      telephone: data.telephone ?? undefined,
      email: data.email ?? undefined,
      statut: data.statut as StatutCentre,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as CentreProps);
  }

  async findAll(): Promise<Centre[]> {
    const data = await this.prisma.centre.findMany({
      orderBy: { nom: 'asc' },
    });

    return data.map(d => Centre.reconstituer({
      id: CentreId.create(d.id),
      nom: Nom.create(d.nom),
      ville: d.ville,
      codePostal: CodePostal.create(d.codePostal),
      adresse: d.adresse,
      telephone: d.telephone ?? undefined,
      email: d.email ?? undefined,
      statut: d.statut as StatutCentre,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    } as CentreProps));
  }

  async save(centre: Centre): Promise<void> {
    await this.prisma.centre.upsert({
      where: { id: centre.id.value },
      create: {
        id: centre.id.value,
        nom: centre.nom.value,
        ville: centre.ville,
        codePostal: centre.codePostal.value,
        adresse: centre.adresse,
        telephone: centre.telephone,
        email: centre.email,
        statut: centre.statut,
      },
      update: {
        nom: centre.nom.value,
        ville: centre.ville,
        codePostal: centre.codePostal.value,
        adresse: centre.adresse,
        telephone: centre.telephone,
        email: centre.email,
        statut: centre.statut,
        updatedAt: centre.updatedAt,
      },
    });
  }

  async delete(id: CentreId): Promise<void> {
    await this.prisma.centre.delete({
      where: { id: id.value },
    });
  }
}
