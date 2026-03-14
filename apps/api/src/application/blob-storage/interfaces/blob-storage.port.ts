export interface IBlobStorageService {
  upload(blobName: string, buffer: Buffer, mimeType: string): Promise<string>;
  delete(blobName: string): Promise<void>;
}
