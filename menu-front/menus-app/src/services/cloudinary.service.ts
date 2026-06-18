/**
 * Servicio de Cloudinary para subir imágenes
 * 
 * Configuración requerida en .env.local:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (ej: menus-app)
 * - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (ej: menu_preset)
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

export const cloudinaryService = {
  /**
   * Subir imagen a Cloudinary
   * @param file - Archivo de imagen a subir
   * @param folder - Carpeta opcional en Cloudinary (default: 'menu-master')
   * @returns URL segura de la imagen
   */
  async uploadImage(file: File, folder: string = 'menu-master'): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error('Cloudinary no está configurado. Revisa las variables de entorno.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('tags', 'menu,platillo');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Error al subir imagen');
      }

      const data: CloudinaryUploadResponse = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir imagen a Cloudinary:', error);
      throw error;
    }
  },

  /**
   * Obtener URL optimizada de imagen
   * @param url - URL original de Cloudinary
   * @param width - Ancho deseado
   * @param height - Alto deseado
   * @returns URL optimizada
   */
  getOptimizedUrl(url: string, width: number = 400, height: number = 400): string {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    // Reemplazar 'upload' con transformaciones
    return url.replace(
      '/upload/',
      `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
    );
  },

  /**
   * Eliminar imagen de Cloudinary
   * NOTA: Requiere backend para firmar la petición
   * @param publicId - ID público de la imagen
   */
  async deleteImage(publicId: string): Promise<void> {
    // Esta función requiere implementación en el backend
    // porque necesita firmar la petición con el API Secret
    console.warn('Eliminar imágenes requiere implementación en el backend');
    throw new Error('Función no implementada - requiere backend');
  },
};