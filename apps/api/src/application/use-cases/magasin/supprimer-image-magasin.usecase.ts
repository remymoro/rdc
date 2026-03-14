import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IMagasinRepository, MagasinId } from '@rdc/domain';
import type { IBlobStorageService } from '../../blob-storage/interfaces/blob-storage.port';

@Injectable()
export class SupprimerImageMagasinUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
    @Inject('IBlobStorageService') private readonly blobStorage: IBlobStorageService,
  ) {}

  async execute(magasinId: string, imageId: string): Promise<void> {
    const magasin = await this.magasins.findById(MagasinId.create(magasinId));

    if (!magasin) {
      throw new DomainNotFoundException(`Magasin ${magasinId} introuvable`, 'MAGASIN_NOT_FOUND');
    }

    const image = magasin.images.find(img => img.id === imageId);

    if (!image) {
      throw new DomainNotFoundException(`Image ${imageId} introuvable`, 'IMAGE_NOT_FOUND');
    }

    const blobName = new URL(image.url).pathname.replace(/^\/[^/]+\//, '');
    await this.blobStorage.delete(blobName);
    await this.magasins.deleteImage(imageId);
  }
}
