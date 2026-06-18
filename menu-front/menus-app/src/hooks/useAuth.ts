'use client';

import { useEffect, useState } from 'react';
import { authService, Usuario } from '@/services/auth.service';

/**
 * Hook para manejar la autenticación
 */
export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await authService.getMe();
        setUsuario(response.usuario);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar usuario');
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUsuario(response.usuario);
      setError(null);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    }
  };

  const registro = async (nombre: string, email: string, password: string, negocio?: string) => {
    try {
      const response = await authService.registro({ nombre, email, password, negocio });
      setError(null);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  return {
    usuario,
    loading,
    error,
    login,
    registro,
    logout,
    isAuthenticated: !!usuario,
  };
}