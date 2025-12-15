import cloudinary from ".";
import { UploadApiResponse } from 'cloudinary';

export const uploadServiceImageBuffer = async (
  buffer: Buffer,
  serviceId: string,
  imageName: 'cover' | 'thumbnail' | `gallery_${number}`,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `services/${serviceId}`,
        public_id: imageName,
        resource_type: 'image',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );

    stream.end(buffer);
  });
};

export const uploadServiceImageUrl = async (
  imageUrl: string,
  serviceId: string,
  imageName: 'cover' | 'thumbnail' | `gallery_${number}`,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      {
        folder: `services/${serviceId}`,
        public_id: imageName,
        resource_type: 'image',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );
  });
};
