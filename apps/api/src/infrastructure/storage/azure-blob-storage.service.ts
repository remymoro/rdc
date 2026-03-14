import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import type { IBlobStorageService } from '../../application/blob-storage/interfaces/blob-storage.port';

@Injectable()
export class AzureBlobStorageService implements IBlobStorageService {
  private readonly client: BlobServiceClient;
  private readonly containerName: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING est requis');
    }
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME ?? 'rdc';
    this.client = BlobServiceClient.fromConnectionString(connectionString);
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
}
