import { Injectable } from '@nestjs/common';
import { ICentreRepository, Centre, CentreId, CentreProps, Nom, CodePostal, Ville, Adresse, Telephone, Email, StatutCentre } from '@rdc/domain';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CentrePrismaRepository implements ICentreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: CentreId): Promise<Centre | null> {
    const data = await this.prisma.centre.findUnique({
      where: { id: id.value },
    });

    if (!data) return null;

    return Centre.reconstituer(this.toProps(data));
  }

  async findByUniqueKey(params: {
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
  }): Promise<Centre | null> {
    const data = await this.prisma.centre.findFirst({
      where: {
        nom: params.nom,
        ville: params.ville,
        codePostal: params.codePostal,
        adresse: params.adresse,
      },
    });

    if (!data) return null;

    return Centre.reconstituer(this.toProps(data));
  }

  async findAll(): Promise<Centre[]> {
    const data = await this.prisma.centre.findMany({
      orderBy: { nom: 'asc' },
    });

    return data.map(d => Centre.reconstituer(this.toProps(d)));
  }

  async save(centre: Centre): Promise<void> {
    await this.prisma.centre.upsert({
      where: { id: centre.id.value },
      create: {
        id: centre.id.value,
        nom: centre.nom.value,
        ville: centre.ville.value,
        codePostal: centre.codePostal.value,
        adresse: centre.adresse.value,
        telephone: centre.telephone?.value,
        email: centre.email?.value,
        statut: centre.statut,
      },
      update: {
        nom: centre.nom.value,
        ville: centre.ville.value,
        codePostal: centre.codePostal.value,
        adresse: centre.adresse.value,
        telephone: centre.telephone?.value,
        email: centre.email?.value,
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

  private toProps(data: {
    id: string;
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
    telephone: string | null;
    email: string | null;
    statut: string;
    createdAt: Date;
    updatedAt: Date;
  }): CentreProps {
    return {
      id: CentreId.create(data.id),
      nom: Nom.create(data.nom),
      ville: Ville.create(data.ville),
      codePostal: CodePostal.create(data.codePostal),
      adresse: Adresse.create(data.adresse),
      telephone: data.telephone ? Telephone.create(data.telephone) : undefined,
      email: data.email ? Email.create(data.email) : undefined,
      statut: data.statut as StatutCentre,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
