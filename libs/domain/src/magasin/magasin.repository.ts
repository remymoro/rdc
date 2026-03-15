import { Magasin } from './magasin.entity';
import { MagasinImage } from './magasin.entity';
import { MagasinId } from '../value-objects/magasin-id.vo';
import { CentreId } from '../value-objects/centre-id.vo';

export interface IMagasinRepository {
  findById(id: MagasinId): Promise<Magasin | null>;
  findAll(): Promise<Magasin[]>;
  findByCentreId(centreId: CentreId): Promise<Magasin[]>;
  findByUniqueKey(params: {
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
  }): Promise<Magasin | null>;
  save(magasin: Magasin): Promise<void>;
  delete(id: MagasinId): Promise<void>;
  saveImage(magasinId: MagasinId, image: MagasinImage): Promise<void>;
  deleteImage(imageId: string): Promise<void>;
}
