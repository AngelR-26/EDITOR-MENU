'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function Registro() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [negocio, setNegocio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.registro({ nombre, email, password, negocio: negocio || undefined });
      // Redirigir a login después del registro exitoso
      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f13',
      fontFamily: "'Segoe UI', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #7c3aed22, transparent 70%)',
        top: -100,
        right: -100,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #a855f722, transparent 70%)',
        bottom: -100,
        left: -100,
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: 900,
        minHeight: 600,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        zIndex: 1,
      }}>
        {/* Panel izquierdo - decorativo */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 20,
            }}>M</div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>MENU</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>

          {/* Texto central */}
          <div>
            <h2 style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 700,
              margin: '0 0 16px',
              lineHeight: 1.3,
            }}>
              Comienza gratis hoy mismo
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
            }}>
              Únete a cientos de restaurantes que ya usan Menu Master
            </p>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              '✓ Plan básico gratuito para siempre',
              '✓ Sin tarjeta de crédito requerida',
              '✓ Cancela cuando quieras',
              '✓ Soporte 24/7 incluido',
            ].map((f) => (
              <div key={f} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho - formulario */}
        <div style={{
          width: 400,
          background: '#16161d',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Título */}
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
            Crea tu cuenta gratis 🚀
          </h1>
          <p style={{ color: '#666', fontSize: 13, margin: '0 0 28px' }}>
            Empieza a diseñar menús hoy mismo
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{
                  color: '#888',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 6,
                }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#0f0f13',
                    border: '1px solid #2a2a35',
                    borderRadius: 8,
                    padding: '11px 14px',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#a855f7')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a35')}
                />
              </div>

              <div>
                <label style={{
                  color: '#888',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 6,
                }}>
                  NOMBRE DEL NEGOCIO
                </label>
                <input
                  type="text"
                  placeholder="Ej. Restaurante El Buen Sabor"
                  value={negocio}
                  onChange={e => setNegocio(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f0f13',
                    border: '1px solid #2a2a35',
                    borderRadius: 8,
                    padding: '11px 14px',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#a855f7')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a35')}
                />
              </div>

              <div>
                <label style={{
                  color: '#888',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 6,
                }}>
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  placeholder="tucorreo@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#0f0f13',
                    border: '1px solid #2a2a35',
                    borderRadius: 8,
                    padding: '11px 14px',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#a855f7')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a35')}
                />
              </div>

              <div>
                <label style={{
                  color: '#888',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 6,
                }}>
                  CONTRASEÑA
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    background: '#0f0f13',
                    border: '1px solid #2a2a35',
                    borderRadius: 8,
                    padding: '11px 14px',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#a855f7')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a35')}
                />
              </div>

              {error && (
                <div style={{
                  color: '#ef4444',
                  fontSize: 12,
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading
                    ? 'linear-gradient(135deg, #666, #888)'
                    : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '13px',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                  transition: 'opacity 0.2s',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p style={{ color: '#555', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
            ¿Ya tienes cuenta?{' '}
            <a
              href="/login"
              style={{
                color: '#a855f7',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}