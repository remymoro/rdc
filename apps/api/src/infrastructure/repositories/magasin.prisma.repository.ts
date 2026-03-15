import { Injectable } from '@nestjs/common';
import {
  IMagasinRepository,
  Magasin,
  MagasinId,
  MagasinImage,
  MagasinProps,
  CentreId,
  Nom,
  CodePostal,
  Ville,
  Adresse,
  Telephone,
  Email,
  StatutMagasin,
} from '@rdc/domain';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MagasinPrismaRepository implements IMagasinRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: MagasinId): Promise<Magasin | null> {
    const data = await this.prisma.magasin.findUnique({
      where: { id: id.value },
      include: { images: { orderBy: { ordre: 'asc' } } },
    });

    if (!data) return null;

    return Magasin.reconstituer(this.toProps(data));
  }

  async findAll(): Promise<Magasin[]> {
    const data = await this.prisma.magasin.findMany({
      include: { images: { orderBy: { ordre: 'asc' } } },
      orderBy: [{ centreId: 'asc' }, { nom: 'asc' }],
    });
    return data.map(d => Magasin.reconstituer(this.toProps(d)));
  }

  async findByCentreId(centreId: CentreId): Promise<Magasin[]> {
    const data = await this.prisma.magasin.findMany({
      where: { centreId: centreId.value },
      include: { images: { orderBy: { ordre: 'asc' } } },
      orderBy: { nom: 'asc' },
    });

    return data.map(d => Magasin.reconstituer(this.toProps(d)));
  }

  async findByUniqueKey(params: {
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
  }): Promise<Magasin | null> {
    const data = await this.prisma.magasin.findFirst({
      where: {
        nom: params.nom,
        ville: params.ville,
        codePostal: params.codePostal,
        adresse: params.adresse,
      },
      include: { images: { orderBy: { ordre: 'asc' } } },
    });

    if (!data) return null;

    return Magasin.reconstituer(this.toProps(data));
  }

  async save(magasin: Magasin): Promise<void> {
    await this.prisma.magasin.upsert({
      where: { id: magasin.id.value },
      create: {
        id: magasin.id.value,
        nom: magasin.nom.value,
        ville: magasin.ville.value,
        codePostal: magasin.codePostal.value,
        adresse: magasin.adresse.value,
        telephone: magasin.telephone?.value,
        email: magasin.email?.value,
        statut: magasin.statut,
        centreId: magasin.centreId.value,
      },
      update: {
        nom: magasin.nom.value,
        ville: magasin.ville.value,
        codePostal: magasin.codePostal.value,
        adresse: magasin.adresse.value,
        telephone: magasin.telephone?.value,
        email: magasin.email?.value,
        statut: magasin.statut,
        updatedAt: magasin.updatedAt,
      },
    });
  }

  async delete(id: MagasinId): Promise<void> {
    await this.prisma.magasin.delete({
      where: { id: id.value },
    });
  }

  async saveImage(magasinId: MagasinId, image: MagasinImage): Promise<void> {
    await this.prisma.magasinImage.create({
      data: {
        id: image.id,
        url: image.url,
        ordre: image.ordre,
        magasinId: magasinId.value,
        createdAt: image.createdAt,
      },
    });
  }

  async deleteImage(imageId: string): Promise<void> {
    await this.prisma.magasinImage.delete({
      where: { id: imageId },
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
    centreId: string;
    images: { id: string; url: string; ordre: number; createdAt: Date }[];
    createdAt: Date;
    updatedAt: Date;
  }): MagasinProps {
    return {
      id: MagasinId.create(data.id),
      nom: Nom.create(data.nom),
      ville: Ville.create(data.ville),
      codePostal: CodePostal.create(data.codePostal),
      adresse: Adresse.create(data.adresse),
      telephone: data.telephone ? Telephone.create(data.telephone) : undefined,
      email: data.email ? Email.create(data.email) : undefined,
      statut: data.statut as StatutMagasin,
      centreId: CentreId.create(data.centreId),
      images: data.images.map<MagasinImage>(img => ({
        id: img.id,
        url: img.url,
        ordre: img.ordre,
        createdAt: img.createdAt,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
