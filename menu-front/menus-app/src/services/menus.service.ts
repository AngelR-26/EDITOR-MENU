import { http } from './http.service';

export interface Menu {
  id: number;
  user_id: number;
  nombre: string;
  estado: 'borrador' | 'publicado';
  data_json?: any;
  plantilla_id?: number;
  qr_code_url?: string;
  public_url?: string;
  es_publico?: boolean;
  organizacion_id?: number;
  etiquetas?: any[];
  created_at: string;
  updated_at: string;
}

export interface CreateMenuRequest {
  nombre: string;
  estado?: 'borrador' | 'publicado';
  data_json?: any;
  plantilla_id?: number;
}

export interface UpdateMenuRequest {
  nombre?: string;
  estado?: 'borrador' | 'publicado';
  data_json?: any;
}

/**
 * Servicio para gestión de menús
 */
export const menusService = {
  /**
   * Obtener todos los menús del usuario
   */
  async getAll(estado?: string): Promise<{ ok: boolean; total: number; menus: Menu[] }> {
    const endpoint = estado ? `/api/menus?estado=${estado}` : '/api/menus';
    return http.get(endpoint);
  },

  /**
   * Obtener un menú por ID
   */
  async getById(id: number): Promise<{ ok: boolean; menu: Menu }> {
    return http.get(`/api/menus/${id}`);
  },

  /**
   * Crear un nuevo menú
   */
  async create(data: CreateMenuRequest): Promise<{ ok: boolean; mensaje: string; menuId: number }> {
    return http.post('/api/menus', data);
  },

  /**
   * Actualizar un menú
   */
  async update(id: number, data: UpdateMenuRequest): Promise<{ ok: boolean; mensaje: string }> {
    return http.put(`/api/menus/${id}`, data);
  },

  /**
   * Eliminar un menú
   */
  async delete(id: number): Promise<{ ok: boolean; mensaje: string }> {
    return http.delete(`/api/menus/${id}`);
  },

  /**
   * Publicar un menú
   */
  async publish(id: number): Promise<{ ok: boolean; mensaje: string; publicUrl: string; qrCodeUrl: string }> {
    return http.post(`/api/menus/${id}/publish`);
  },
};