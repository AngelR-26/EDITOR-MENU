import { http } from './http.service';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  negocio?: string;
  plan: 'basico' | 'pro' | 'premium';
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  nombre: string;
  email: string;
  password: string;
  negocio?: string;
}

export interface AuthResponse {
  ok: boolean;
  mensaje: string;
  usuario: Usuario;
  accessToken: string;
}

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Iniciar sesión
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/api/auth/login', data, {
      requiresAuth: false,
    });
    
    // Guardar token en cookies
    if (response.accessToken) {
      const expiresInSeconds = 900; // 15 minutos
      const expires = new Date();
      expires.setTime(expires.getTime() + expiresInSeconds * 1000);
      
      if (typeof document !== 'undefined') {
        document.cookie = `access_token=${response.accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        
        // Guardar usuario en localStorage
        if (response.usuario) {
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }
      }
    }
    
    return response;
  },

  /**
   * Registrar usuario
   */
  async registro(data: RegistroRequest): Promise<{ ok: boolean; mensaje: string; usuario: Usuario }> {
    const response = await http.post<{ ok: boolean; mensaje: string; usuario: Usuario }>('/api/auth/register', data, { requiresAuth: false });
    
    // Guardar usuario en localStorage si el registro fue exitoso
    if (response.ok && response.usuario && typeof window !== 'undefined') {
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
    }
    
    return response;
  },

  /**
   * Obtener usuario actual
   */
  async getMe(): Promise<{ ok: boolean; usuario: Usuario }> {
    return http.get('/api/auth/me');
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    await http.logout();
    
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario');
    }
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(passwordActual: string, passwordNuevo: string): Promise<{ ok: boolean; mensaje: string }> {
    return http.put('/api/auth/password', { passwordActual, passwordNuevo });
  },

  /**
   * Refresh token (interno)
   */
  async refreshToken(): Promise<string> {
    const response = await http.post<{ ok: boolean; accessToken: string }>('/api/auth/refresh');
    return response.accessToken;
  },
};