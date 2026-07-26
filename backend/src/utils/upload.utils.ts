import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export async function uploadToCloudinary(
  filePath: string,
  folder = 'kitking'
): Promise<UploadApiResponse> {
  return cloudinary.uploader.upload(filePath, {
    folder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'auto',
  });
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder = 'kitking',
  filename?: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        use_filename: true,
        public_id: filename,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed: no result'));
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
