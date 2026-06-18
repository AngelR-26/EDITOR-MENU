'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { menusService } from '@/services/menus.service';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';

interface Menu {
  id: number;
  nombre: string;
  estado: string;
}

const navItems = [
  { icon: '⊞', label: 'Dashboard', href: '/' },
  { icon: '☰', label: 'Mis Menús', href: '/mis-menus' },
  { icon: '▦', label: 'Plantillas', href: '/plantillas' },
  { icon: '📊', label: 'Analíticas', href: '/analiticas' },
  { icon: '🏢', label: 'Mi Negocio', href: '/mi-negocio' },
  { icon: '💳', label: 'Facturación', href: '/planes' },
  { icon: '⚙️', label: 'Configuración', href: '/configuracion' },
];

export default function Dashboard() {
  const router = useRouter();
  const { usuario, loading, logout } = useAuth();
  const [menuRecientes, setMenuRecientes] = useState<Menu[]>([]);
  const [activeNav, setActiveNav] = useState('Dashboard');

  useEffect(() => {
    async function loadMenus() {
      try {
        const data = await menusService.getAll();
        if (data.ok) {
          setMenuRecientes(data.menus.slice(0, 3));
        }
      } catch (error) {
        console.error('Error al cargar menús:', error);
      }
    }

    if (!loading) {
      loadMenus();
    }
  }, [loading]);

  const handleCerrarSesion = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0f0f13',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '4px solid #2a2a35',
          borderTop: '4px solid #a855f7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  const publicadosCount = menuRecientes.filter(m => m.estado === 'publicado').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#0f0f13' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        background: '#16161d',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        borderRight: '1px solid #2a2a35',
        position: 'fixed',
        height: '100vh',
        zIndex: 10,
      }}>
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #2a2a35' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
            }}>M</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MENU</div>
              <div style={{ color: '#a855f7', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: activeNav === item.label ? 'linear-gradient(135deg, #7c3aed22, #a855f722)' : 'transparent',
                  color: activeNav === item.label ? '#a855f7' : '#888',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: activeNav === item.label ? 600 : 400,
                  borderLeft: activeNav === item.label ? '2px solid #a855f7' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (activeNav !== item.label) {
                    (e.currentTarget as HTMLElement).style.color = 'white';
                  }
                }}
                onMouseLeave={e => {
                  if (activeNav !== item.label) {
                    (e.currentTarget as HTMLElement).style.color = '#888';
                  }
                }}
                onClick={() => setActiveNav(item.label)}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            </a>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid #2a2a35', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="/landing" style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                color: '#888',
                cursor: 'pointer',
                fontSize: 13,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#888')}
            >
              <span>🌐</span> Landing Page
            </div>
          </a>
          <div
            onClick={handleCerrarSesion}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              color: '#888',
              cursor: 'pointer',
              fontSize: 13,
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#888')}
          >
            <span>🚪</span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>
              ¡Bienvenido, {usuario?.nombre || 'Usuario'}! 👋
            </h1>
            <p style={{ color: '#666', fontSize: 13, margin: '4px 0 0' }}>
              Aquí tienes un resumen de tu cuenta
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{
              background: '#1e1e28',
              border: '1px solid #2a2a35',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#888',
              cursor: 'pointer',
              fontSize: 18,
            }}>🔔</button>
            <a href="/analiticas">
              <button style={{
                background: '#1e1e28',
                border: '1px solid #2a2a35',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#888',
                cursor: 'pointer',
                fontSize: 18,
              }}>📊</button>
            </a>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}>
              {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Menús creados', value: String(menuRecientes.length || 0), icon: '📋', href: '/mis-menus' },
            { label: 'Publicados', value: String(publicadosCount), icon: '✅', href: '/mis-menus' },
            { label: 'Vistas este mes', value: '256', icon: '👁️', href: '/analiticas' },
            { label: 'Plan actual', value: usuario?.plan || 'Basico', icon: '⭐', highlight: true, href: '/planes' },
          ].map((stat) => (
            <a key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: stat.highlight ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#1e1e28',
                border: stat.highlight ? 'none' : '1px solid #2a2a35',
                borderRadius: 12,
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: stat.highlight ? 'rgba(255,255,255,0.8)' : '#666', fontSize: 12, marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Menús Recientes */}
        <div style={{ background: '#1e1e28', border: '1px solid #2a2a35', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, margin: 0 }}>Menús recientes</h2>
            <a href="/mis-menus" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent',
                border: '1px solid #2a2a35',
                borderRadius: 8,
                padding: '6px 14px',
                color: '#a855f7',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}>Ver todos</button>
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {menuRecientes.length > 0 ? menuRecientes.map((menu) => (
              <a key={menu.id} href="/editor" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#16161d',
                  border: '1px solid #2a2a35',
                  borderRadius: 10,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#a855f7')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a35')}
                >
                  <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>🍽️</div>
                  <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{menu.nombre}</div>
                  <div style={{ color: '#555', fontSize: 11, marginTop: 4 }}>{menu.estado}</div>
                </div>
              </a>
            )) : (
              <div style={{ color: '#555', fontSize: 13, padding: 16 }}>No hay menús aún</div>
            )}
            <a href="/plantillas" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#16161d',
                border: '2px dashed #2a2a35',
                borderRadius: 10,
                padding: 16,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minHeight: 100,
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#a855f7')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a35')}
              >
                <div style={{ fontSize: 28, color: '#a855f7' }}>+</div>
                <div style={{ color: '#666', fontSize: 12 }}>Crear nuevo menú</div>
              </div>
            </a>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <a href="/analiticas" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#1e1e28',
            border: '1px solid #2a2a35',
            borderRadius: 12,
            padding: 24,
            cursor: 'pointer',
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#a855f7')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#2a2a35')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, margin: 0 }}>Estadísticas rápidas</h2>
              <span style={{ color: '#a855f7', fontSize: 12, fontWeight: 600 }}>Ver analíticas →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'Vistas totales', value: '1,256' },
                { label: 'Descargas', value: '342' },
                { label: 'Impresiones', value: '128' },
                { label: 'QR Escaneos', value: '786' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ color: '#555', fontSize: 12, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </a>
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}