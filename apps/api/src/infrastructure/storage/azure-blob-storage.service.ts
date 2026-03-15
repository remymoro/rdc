import { Injectable } from '@nestjs/common';
import {
  BlobServiceClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import type { IBlobStorageService } from '../../application/blob-storage/interfaces/blob-storage.port';

@Injectable()
export class AzureBlobStorageService implements IBlobStorageService {
  private readonly client: BlobServiceClient;
  private readonly containerName: string;
  private readonly credential: StorageSharedKeyCredential;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING est requis');
    }

    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME ?? 'images';
    this.client = BlobServiceClient.fromConnectionString(connectionString);

    const accountName = this.extract(connectionString, 'AccountName');
    const accountKey = this.extract(connectionString, 'AccountKey');
    this.credential = new StorageSharedKeyCredential(accountName, accountKey);
  }

  async upload(blobName: string, buffer: Buffer, mimeType: string): Promise<string> {
    const containerClient = this.client.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });
    return blockBlobClient.url;
  }

  async delete(blobName: string): Promise<void> {
    const containerClient = this.client.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  }

  generateSasUrl(blobName: string, expiresInMinutes = 60): string {
    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + expiresInMinutes);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn,
      },
      this.credential,
    ).toString();

    const accountName = this.credential.accountName;
    return `https://${accountName}.blob.core.windows.net/${this.containerName}/${blobName}?${sasToken}`;
  }

  private extract(connectionString: string, key: string): string {
    const match = connectionString.match(new RegExp(`${key}=([^;]+)`));
    if (!match) throw new Error(`Clé ${key} introuvable dans la connection string`);
    return match[1];
  }
}
