import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

type ResponseUpload = { public_id: string; url: string };

export async function uploadImages(
  files: File | File[],
  options?: {
    folder?: string;
    maxFiles?: number;
  }
): Promise<(ResponseUpload | null | undefined)[]> {
  try {
    // Convertir a array
    const fileArray = Array.isArray(files) ? files : [files];

    // Configuración
    const config = {
      folder: options?.folder || "tienda-alli-ecommerce",
      maxFiles: options?.maxFiles || 10,
    };

    // Validar cantidad
    if (fileArray.length > config.maxFiles) {
      throw new Error(`Máximo ${config.maxFiles} archivos permitidos`);
    }

    // Subir en paralelo
    const uploadPromises = fileArray.map(async (file) => {
      try {
        // Convertir a buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Subir a Cloudinary
        const result: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              format: "webp",
              folder: config.folder,
              resource_type: "auto",
              allowed_formats: ["webp"],
              transformation: [{ quality: "auto" }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        return { public_id: result?.public_id!, url: result?.secure_url! };
      } catch (error) {
        console.error(`Error subiendo ${file.name}:`, error);
        return null;
      }
    });

    // Esperar todas las subidas
    const images = await Promise.all(uploadPromises);

    // Filtrar nulos y retornar
    return images;
  } catch (error) {
    console.error("Error en uploadImages:", error);
    throw error;
  }
}

export async function deleteImages(public_ids: string[]): Promise<void> {
  return await cloudinary.api.delete_resources(public_ids, (error, result) => {
    if (error) {
      throw Error(error);
    }
    return result;
  });
}
export default cloudinary;
