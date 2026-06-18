"use client";
import { useState } from "react";

const navItems = [
  { icon: '⊞', label: 'Dashboard', href: '/' },
  { icon: '☰', label: 'Mis Menús', href: '/mis-menus' },
  { icon: '▦', label: 'Plantillas', href: '/plantillas' },
  { icon: '📊', label: 'Analíticas', href: '/analiticas' },
  { icon: '🏢', label: 'Mi Negocio', href: '/mi-negocio' },
  { icon: '💳', label: 'Facturación', href: '/planes' },
  { icon: '⚙️', label: 'Configuración', href: '/configuracion' },
];

const topMenus = [
  { nombre: "Menú Restaurante", vistas: 512 },
  { nombre: "Menú Cafetería", vistas: 312 },
  { nombre: "Menú Postres", vistas: 198 },
  { nombre: "Menú Bebidas", vistas: 156 },
  { nombre: "Menú Desayunos", vistas: 78 },
];

// Datos simulados para la gráfica
const datosGrafica = [
  { dia: "1 May", vistas: 30 },
  { dia: "8 May", vistas: 55 },
  { dia: "15 May", vistas: 40 },
  { dia: "22 May", vistas: 80 },
  { dia: "31 May", vistas: 65 },
];

const maxVistas = Math.max(...datosGrafica.map(d => d.vistas));

export default function Analiticas() {
  const [activeNav] = useState("Dashboard");
  const [periodo, setPeriodo] = useState("01 May 2024 - 31 May 2024");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220, background: "#16161d", display: "flex", flexDirection: "column",
        padding: "24px 0", borderRight: "1px solid #2a2a35",
        position: "fixed", height: "100vh", zIndex: 10,
      }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: "bold", fontSize: 16,
            }}>M</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MENU</div>
              <div style={{ color: "#a855f7", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MASTER</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8,
                background: activeNav === item.label ? "linear-gradient(135deg, #7c3aed22, #a855f722)" : "transparent",
                color: activeNav === item.label ? "#a855f7" : "#888",
                cursor: "pointer", fontSize: 13, fontWeight: activeNav === item.label ? 600 : 400,
                borderLeft: activeNav === item.label ? "2px solid #a855f7" : "2px solid transparent",
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            </a>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "#888", fontSize: 13, cursor: "pointer" }}>
            <span>🚪</span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, padding: 32 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Analíticas</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Métricas de tus menús publicados</p>
          </div>
          <select
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              color: "white", padding: "8px 14px", fontSize: 12, outline: "none", cursor: "pointer",
            }}
          >
            <option>01 May 2024 - 31 May 2024</option>
            <option>01 Abr 2024 - 30 Abr 2024</option>
            <option>01 Mar 2024 - 31 Mar 2024</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Vistas totales", value: "1,256", cambio: "+12%", positivo: true, icon: "👁️" },
            { label: "Descargas", value: "342", cambio: "+8%", positivo: true, icon: "⬇️" },
            { label: "QR Escaneos", value: "786", cambio: "+18%", positivo: true, icon: "📱" },
            { label: "Impresiones", value: "128", cambio: "+5%", positivo: true, icon: "🖨️" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#1e1e28", border: "1px solid #2a2a35",
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <span style={{
                  background: stat.positivo ? "#16a34a22" : "#dc262622",
                  color: stat.positivo ? "#4ade80" : "#f87171",
                  border: `1px solid ${stat.positivo ? "#16a34a44" : "#dc262644"}`,
                  borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600,
                }}>{stat.cambio} vs mes anterior</span>
              </div>
              <div style={{ color: "white", fontSize: 26, fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Gráfica + Top menús */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>

          {/* Gráfica de vistas */}
          <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 24px" }}>Vistas por día</h2>

            {/* Gráfica de barras simple */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160, paddingBottom: 8 }}>
              {datosGrafica.map((d) => (
                <div key={d.dia} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#666", fontSize: 10 }}>{d.vistas}</span>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    background: "linear-gradient(180deg, #a855f7, #7c3aed)",
                    height: `${(d.vistas / maxVistas) * 120}px`,
                    transition: "height 0.3s",
                    minHeight: 4,
                  }} />
                  <span style={{ color: "#555", fontSize: 10, textAlign: "center" }}>{d.dia}</span>
                </div>
              ))}
            </div>

            {/* Línea base */}
            <div style={{ borderTop: "1px solid #2a2a35", marginTop: 8 }} />
          </div>

          {/* Top menús */}
          <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 20px" }}>Top menús</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {topMenus.map((menu, i) => (
                <div key={menu.nombre}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: i === 0 ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#2a2a35",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: 10, fontWeight: 700,
                      }}>{i + 1}</span>
                      <span style={{ color: "white", fontSize: 12 }}>{menu.nombre}</span>
                    </div>
                    <span style={{ color: "#666", fontSize: 12 }}>{menu.vistas}</span>
                  </div>
                  {/* Barra de progreso */}
                  <div style={{ background: "#2a2a35", borderRadius: 4, height: 4 }}>
                    <div style={{
                      height: 4, borderRadius: 4,
                      background: i === 0 ? "linear-gradient(90deg, #7c3aed, #a855f7)" : "#3a3a45",
                      width: `${(menu.vistas / topMenus[0].vistas) * 100}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}