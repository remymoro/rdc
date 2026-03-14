import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IMagasinRepository, MagasinImage, MagasinId } from '@rdc/domain';
import { randomUUID } from 'crypto';
import type { IBlobStorageService } from '../../blob-storage/interfaces/blob-storage.port';

@Injectable()
export class AjouterImageMagasinUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
    @Inject('IBlobStorageService') private readonly blobStorage: IBlobStorageService,
  ) {}

  async execute(magasinId: string, file: {
    buffer: Buffer;
    mimeType: string;
    originalName: string;
  }, ordre = 0): Promise<MagasinImage> {
    const magasin = await this.magasins.findById(MagasinId.create(magasinId));

    if (!magasin) {
      throw new DomainNotFoundException(`Magasin ${magasinId} introuvable`, 'MAGASIN_NOT_FOUND');
    }

    const ext = file.originalName.split('.').pop() ?? 'jpg';
    const blobName = `magasins/${magasinId}/${randomUUID()}.${ext}`;
    const url = await this.blobStorage.upload(blobName, file.buffer, file.mimeType);

    const image: MagasinImage = {
      id: randomUUID(),
      url,
      ordre,
      createdAt: new Date(),
    };

    await this.magasins.saveImage(MagasinId.create(magasinId), image);

    return image;
  }
}
