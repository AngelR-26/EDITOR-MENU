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

const planes = [
  {
    id: "basico",
    nombre: "BÁSICO",
    precio: 99,
    descripcion: "Ideal para emprendedores que inician.",
    emoji: "🌱",
    popular: false,
    features: ["1 Menú", "5 Plantillas", "Exportar a PDF", "Soporte por email"],
  },
  {
    id: "profesional",
    nombre: "PROFESIONAL",
    precio: 399,
    descripcion: "Para restaurantes y cafeterías en crecimiento.",
    emoji: "⚡",
    popular: true,
    features: ["Menús ilimitados", "Plantillas Premium", "Exportar PDF / PNG", "Código QR", "Soporte prioritario"],
  },
  {
    id: "empresarial",
    nombre: "EMPRESARIAL",
    precio: 799,
    descripcion: "Para marcas con múltiples sucursales.",
    emoji: "🏢",
    popular: false,
    features: ["Todo en Profesional", "Usuarios ilimitados", "Marca Blanca", "Colaboración", "Soporte 24/7"],
  },
  {
    id: "ilimitado",
    nombre: "ILIMITADO",
    precio: 1499,
    descripcion: "Para marcas que quieren lo mejor.",
    emoji: "💎",
    popular: false,
    features: ["Todo en Empresarial", "API Personalizada", "Control de Permisos", "Soporte Dedicado"],
  },
];

// ⚠️ Cambia este número por el tuyo (52 = México)
const WHATSAPP_NUMBER = "522381172308";
const WHATSAPP_NUMBER_2 = "5212383198822";

export default function Planes() {
  const [activeNav] = useState("Facturación");

  const handleWhatsApp = (planNombre: string, planPrecio: number) => {
  const mensaje = `¡Hola! 👋 Estoy interesado en el plan *${planNombre}* ($${planPrecio}/mes) de Menu Master. Me gustaría más información y activar mi plan.`;
  const url1 = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  const url2 = `https://wa.me/${WHATSAPP_NUMBER_2}?text=${encodeURIComponent(mensaje)}`;
  window.open(url1, "_blank");
  setTimeout(() => window.open(url2, "_blank"), 500);
};

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
          <div
            onClick={() => {
              localStorage.removeItem("usuario");
              document.cookie = "usuario=; path=/; max-age=0";
              window.location.href = "/login";
            }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: "#888", fontSize: 13, cursor: "pointer" }}
          >
            <span>🚪</span> Cerrar sesión
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, padding: 32 }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 700, margin: 0 }}>Planes y Precios</h1>
          <p style={{ color: "#666", fontSize: 15, margin: "10px 0 0" }}>Elige el plan perfecto para tu negocio</p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {planes.map((plan) => (
            <div key={plan.id} style={{ position: "relative" }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  borderRadius: 20, padding: "4px 16px",
                  color: "white", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", zIndex: 2,
                }}>⭐ MÁS POPULAR</div>
              )}
              <div style={{
                background: plan.popular ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
                border: plan.popular ? "none" : "1px solid #2a2a35",
                borderRadius: 16, padding: 24,
                display: "flex", flexDirection: "column", gap: 20,
                height: "100%", boxSizing: "border-box",
              }}>
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{plan.emoji}</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{plan.nombre}</div>
                  <div style={{ color: plan.popular ? "rgba(255,255,255,0.7)" : "#666", fontSize: 12, marginTop: 4 }}>{plan.descripcion}</div>
                </div>
                <div>
                  <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>${plan.precio}</span>
                  <span style={{ color: plan.popular ? "rgba(255,255,255,0.7)" : "#666", fontSize: 13 }}>/mes</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: plan.popular ? "white" : "#a855f7", fontSize: 14 }}>✓</span>
                      <span style={{ color: plan.popular ? "rgba(255,255,255,0.9)" : "#aaa", fontSize: 13 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleWhatsApp(plan.nombre, plan.precio)}
                  style={{
                    background: plan.popular ? "white" : "linear-gradient(135deg, #25d366, #128c7e)",
                    border: "none", borderRadius: 10, padding: "12px",
                    color: plan.popular ? "#7c3aed" : "white",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  <span style={{ fontSize: 16 }}>💬</span> Elegir Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: "center", marginTop: 40,
          background: "#1e1e28", border: "1px solid #2a2a35",
          borderRadius: 12, padding: "20px", maxWidth: 500, margin: "40px auto 0",
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Tus datos están 100% seguros</div>
          <div style={{ color: "#666", fontSize: 12, marginTop: 6 }}>
            Al dar clic en "Elegir Plan" se abrirá WhatsApp para que un asesor te ayude a activar tu plan.
          </div>
        </div>

      </main>
    </div>
  );
}