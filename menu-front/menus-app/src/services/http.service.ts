/**
 * Servicio HTTP para manejar todas las peticiones al backend
 * Maneja automáticamente los tokens y refresh
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
  skipRefresh?: boolean; // Para evitar bucles infinitos
}

class HttpService {
  private accessToken: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.loadToken();
  }

  // Cargar token desde cookies
  private loadToken() {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/access_token=([^;]+)/);
      this.accessToken = match ? match[1] : null;
    }
  }

  // Guardar token en cookies
  private saveToken(token: string, expiresInDays: number = 1 / 96) { // 15 minutos por defecto
    if (typeof document !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
      document.cookie = `access_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      this.accessToken = token;
    }
  }

  // Eliminar token
  private clearToken() {
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      this.accessToken = null;
    }
  }

  // Suscribirse a refresh de token
  private subscribeToRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  // Notificar a todos los subscribers
  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  // Método principal para hacer requests
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, skipRefresh = false, ...fetchConfig } = config;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchConfig.headers,
    };

    // Agregar token si es requerido
    if (requiresAuth && this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchConfig,
        headers,
        credentials: 'include', // Incluir cookies para refresh token
      });

      // Manejar respuesta 401
      if (response.status === 401) {
        // Token expirado - intentar refresh (solo si no estamos ya refrescando)
        if (requiresAuth && !skipRefresh && !this.isRefreshing) {
          try {
            const newToken = await this.refreshToken();
            // Reintentar con nuevo token
            return this.request<T>(endpoint, { ...config, skipRefresh: true });
          } catch (refreshError) {
            // Refresh falló - limpiar y redirigir a login
            this.clearToken();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw new Error('Sesión expirada');
          }
        }
        throw new Error('No autorizado');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ mensaje: 'Error en la petición' }));
        throw new Error(error.mensaje || `HTTP ${response.status}`);
      }

      // Parsear respuesta
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('HTTP Error:', error);
      throw error;
    }
  }

  // Métodos HTTP convenientes
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Refresh token - solo se llama cuando el access token expira
  private async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      // Esperar a que termine el refresh en curso
      return new Promise((resolve) => {
        this.subscribeToRefresh((token) => resolve(token));
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Enviar refresh token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ mensaje: 'Refresh failed' }));
        console.error('Refresh token error:', error);
        throw new Error(error.mensaje || 'Refresh failed');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      // Guardar nuevo access token
      this.saveToken(newAccessToken);
      
      // Notificar a todos los subscribers
      this.onRefreshed(newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('Refresh token failed:', error);
      this.clearToken();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Logout
  async logout() {
    try {
      await this.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }
}

// Exportar instancia única
export const http = new HttpService();