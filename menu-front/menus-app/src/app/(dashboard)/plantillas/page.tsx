"use client";
import { useState } from "react";

const categorias = ["Todas", "Restaurante", "Cafetería", "Postres", "Italiano", "Moderno"];

const plantillas = [
  {
    id: 1, nombre: "Clásico Elegante", categoria: "Restaurante",
    color: "#f5f0e8", textColor: "#2c1810", emoji: "🍽️", popular: false,
    config: {
      fuenteActiva: "Playfair Display", tamaño: 48, subtitulo: "RESTAURANTE",
      fondoActivo: { nombre: "Clásico", bg: "linear-gradient(135deg, #fefefe, #f8f4ee)", texto: "#2c1810", acento: "#8b4513" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
  {
    id: 2, nombre: "Moderno Minimalista", categoria: "Moderno",
    color: "#1a1a1a", textColor: "#ffffff", emoji: "⬛", popular: true,
    config: {
      fuenteActiva: "Montserrat", tamaño: 44, subtitulo: "EXPERIENCIA GASTRONÓMICA",
      fondoActivo: { nombre: "Oscuro", bg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", texto: "#ffffff", acento: "#a855f7" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
  {
    id: 3, nombre: "Cafetería Vintage", categoria: "Cafetería",
    color: "#3d2b1f", textColor: "#f5deb3", emoji: "☕", popular: false,
    config: {
      fuenteActiva: "Lora", tamaño: 42, subtitulo: "CAFÉ & REPOSTERÍA",
      fondoActivo: { nombre: "Sepia", bg: "linear-gradient(135deg, #fdf6e3, #f5e6c8)", texto: "#3b2a1a", acento: "#a0522d" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
  {
    id: 4, nombre: "Pastelería Dulce", categoria: "Postres",
    color: "#fce4ec", textColor: "#880e4f", emoji: "🍰", popular: true,
    config: {
      fuenteActiva: "Dancing Script", tamaño: 52, subtitulo: "POSTRES ARTESANALES",
      fondoActivo: { nombre: "Rosa", bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)", texto: "#831843", acento: "#ec4899" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
  {
    id: 5, nombre: "Restaurante Italiano", categoria: "Italiano",
    color: "#1b5e20", textColor: "#ffffff", emoji: "🍝", popular: false,
    config: {
      fuenteActiva: "EB Garamond", tamaño: 46, subtitulo: "CUCINA ITALIANA",
      fondoActivo: { nombre: "Verde", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", texto: "#14532d", acento: "#16a34a" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
  {
    id: 6, nombre: "Brunch Moderno", categoria: "Moderno",
    color: "#fff8e1", textColor: "#4e342e", emoji: "🍳", popular: false,
    config: {
      fuenteActiva: "Poppins", tamaño: 44, subtitulo: "BRUNCH & CAFÉ",
      fondoActivo: { nombre: "Naranja", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
  {
    id: 7, nombre: "Mariscos Frescos", categoria: "Restaurante",
    color: "#e3f2fd", textColor: "#0d47a1", emoji: "🦞", popular: false,
    config: {
      fuenteActiva: "Merriweather", tamaño: 44, subtitulo: "MARISCOS & MÁS",
      fondoActivo: { nombre: "Azul", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", texto: "#1e3a5f", acento: "#2563eb" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
  {
    id: 8, nombre: "Tacos & Antojitos", categoria: "Restaurante",
    color: "#fff3e0", textColor: "#bf360c", emoji: "🌮", popular: true,
    config: {
      fuenteActiva: "Oswald", tamaño: 48, subtitulo: "ANTOJERÍA MEXICANA",
      fondoActivo: { nombre: "Naranja", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
      secciones: [
        { id: 1, nombre: "SECCIÓN 1", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 2, nombre: "SECCIÓN 2", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
        { id: 3, nombre: "SECCIÓN 3", platillos: [{ nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }, { nombre: "Nombre del Platillo", precio: "$0", descripcion: "Descripción del platillo" }] },
      ],
    },
  },
];

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/" },
  { icon: "☰", label: "Mis Menús", href: "/mis-menus" },
  { icon: "▦", label: "Plantillas", href: "/plantillas" },
  { icon: "✏️", label: "Mis Diseños", href: "#" },
  { icon: "🖼️", label: "Medios", href: "#" },
  { icon: "🏢", label: "Mi Negocio", href: "/mi-negocio" },
  { icon: "💳", label: "Facturación", href: "/planes" },
  { icon: "⚙️", label: "Configuración", href: "/configuracion" },
];

type Plantilla = typeof plantillas[0];

export default function Plantillas() {
  const [activeNav] = useState("Plantillas");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [preview, setPreview] = useState<Plantilla | null>(null);

  const plantillasFiltradas = plantillas.filter((p) => {
    const coincideCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const usarPlantilla = (p: Plantilla) => {
    localStorage.setItem("plantilla_cargada", JSON.stringify(p.config));
    window.location.href = "/editor";
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
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: 16 }}>M</div>
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
                background: activeNav === item.label ? "#7c3aed22" : "transparent",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Plantillas</h1>
            <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Elige una plantilla para empezar tu menú</p>
          </div>
          <input
            type="text" placeholder="🔍 Buscar plantillas..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8, padding: "10px 16px", color: "white", fontSize: 13, outline: "none", width: 220 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {categorias.map((cat) => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)} style={{
              background: categoriaActiva === cat ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e28",
              border: categoriaActiva === cat ? "none" : "1px solid #2a2a35",
              borderRadius: 20, padding: "8px 18px",
              color: categoriaActiva === cat ? "white" : "#888",
              cursor: "pointer", fontSize: 13, fontWeight: categoriaActiva === cat ? 600 : 400,
            }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {plantillasFiltradas.map((p) => (
            <div key={p.id} style={{ position: "relative" }}
              onMouseEnter={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "1"; }}
              onMouseLeave={e => { const o = e.currentTarget.querySelector(".overlay") as HTMLElement; if (o) o.style.opacity = "0"; }}
            >
              {p.popular && (
                <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "linear-gradient(135deg, #7c3aed, #a855f7)", borderRadius: 20, padding: "3px 10px", color: "white", fontSize: 10, fontWeight: 700 }}>⭐ Popular</div>
              )}
              <div style={{ background: p.color, borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a35", cursor: "pointer", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
                <div style={{ fontSize: 48 }}>{p.emoji}</div>
                <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 16, color: p.textColor, textAlign: "center" }}>MENÚ</div>
                <div style={{ color: p.textColor, opacity: 0.6, fontSize: 11, textAlign: "center" }}>
                  — Sección 1 —<br/>— Sección 2 —<br/>— Sección 3 —
                </div>

                <div className="overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.2s", borderRadius: 12 }}>
                  <button
                    onClick={() => usarPlantilla(p)}
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 8, padding: "10px 20px", color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer", width: 140 }}
                  >✓ Usar plantilla</button>
                  <button
                    onClick={() => setPreview(p)}
                    style={{ background: "transparent", border: "1px solid #ffffff44", borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, cursor: "pointer", width: 140 }}
                  >👁 Vista previa</button>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{p.nombre}</div>
                <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{p.categoria}</div>
              </div>
            </div>
          ))}

          <div
            onClick={() => { localStorage.removeItem("plantilla_cargada"); window.location.href = "/editor"; }}
            style={{ border: "2px dashed #2a2a35", borderRadius: 12, cursor: "pointer", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#a855f7")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a35")}
          >
            <div style={{ fontSize: 36, color: "#a855f7" }}>+</div>
            <div style={{ color: "#666", fontSize: 13 }}>Crear desde cero</div>
          </div>
        </div>
      </main>

      {/* MODAL VISTA PREVIA */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: preview.config.fondoActivo.bg, borderRadius: 16, padding: "40px 36px", width: 360, maxHeight: "80vh", overflowY: "auto", fontFamily: preview.config.fuenteActiva, boxShadow: "0 30px 80px rgba(0,0,0,0.8)", position: "relative" }}>
            <button onClick={() => setPreview(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%", width: 28, height: 28, color: preview.config.fondoActivo.texto, cursor: "pointer", fontSize: 14 }}>✕</button>

            <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${preview.config.fondoActivo.acento}` }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: preview.config.fondoActivo.acento, marginBottom: 6, opacity: 0.6 }}>✦ ✦ ✦</div>
              <div style={{ fontSize: preview.config.tamaño / 2.8, color: preview.config.fondoActivo.texto, fontWeight: 700, letterSpacing: 4 }}>MENÚ</div>
              <div style={{ fontSize: 11, color: preview.config.fondoActivo.acento, letterSpacing: 6, marginTop: 4 }}>{preview.config.subtitulo}</div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: preview.config.fondoActivo.acento, marginTop: 6, opacity: 0.6 }}>✦ ✦ ✦</div>
            </div>

            {preview.config.secciones.map(sec => (
              <div key={sec.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: preview.config.fondoActivo.acento, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>{sec.nombre}</div>
                {sec.platillos.map((pl, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dotted ${preview.config.fondoActivo.acento}44`, padding: "5px 0" }}>
                    <div>
                      <div style={{ fontSize: 11, color: preview.config.fondoActivo.texto, fontWeight: 600 }}>{pl.nombre}</div>
                      <div style={{ fontSize: 9, color: preview.config.fondoActivo.texto, opacity: 0.6 }}>{pl.descripcion}</div>
                    </div>
                    <div style={{ fontSize: 11, color: preview.config.fondoActivo.acento, fontWeight: 700 }}>{pl.precio}</div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setPreview(null)} style={{ flex: 1, background: "transparent", border: `1px solid ${preview.config.fondoActivo.acento}`, borderRadius: 8, padding: "10px", color: preview.config.fondoActivo.acento, cursor: "pointer", fontSize: 12 }}>Cerrar</button>
              <button onClick={() => usarPlantilla(preview)} style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 8, padding: "10px", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>✓ Usar esta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}