"use client";
import { useState, useEffect } from "react";

const navItems = [
  { icon: '⊞', label: 'Dashboard', href: '/' },
  { icon: '☰', label: 'Mis Menús', href: '/mis-menus' },
  { icon: '▦', label: 'Plantillas', href: '/plantillas' },
  { icon: '📊', label: 'Analíticas', href: '/analiticas' },
  { icon: '🏢', label: 'Mi Negocio', href: '/mi-negocio' },
  { icon: '💳', label: 'Facturación', href: '/planes' },
  { icon: '⚙️', label: 'Configuración', href: '/configuracion' },
];

export default function MiNegocio() {
  const [logo, setLogo] = useState<string>("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Restaurante");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("mi_negocio");
    if (data) {
      const d = JSON.parse(data);
      setLogo(d.logo || "");
      setNombre(d.nombre || "");
      setTipo(d.tipo || "Restaurante");
      setDireccion(d.direccion || "");
      setTelefono(d.telefono || "");
      setEmail(d.email || "");
      setSitioWeb(d.sitioWeb || "");
      setInstagram(d.instagram || "");
      setFacebook(d.facebook || "");
      setTiktok(d.tiktok || "");
      setWhatsapp(d.whatsapp || "");
      setDescripcion(d.descripcion || "");
    }
  }, []);

  const handleLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = ev => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const guardar = () => {
    setGuardando(true);
    const data = { logo, nombre, tipo, direccion, telefono, email, sitioWeb, instagram, facebook, tiktok, whatsapp, descripcion };
    localStorage.setItem("mi_negocio", JSON.stringify(data));
    setTimeout(() => { setGuardando(false); setGuardado(true); setTimeout(() => setGuardado(false), 2000); }, 600);
  };

  const inputStyle: React.CSSProperties = {
    background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
    color: "white", fontSize: 13, outline: "none", padding: "10px 14px",
    width: "100%", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = { color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, display: "block" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "#16161d", display: "flex", flexDirection: "column", padding: "24px 0", borderRight: "1px solid #2a2a35", position: "fixed", height: "100vh", zIndex: 10 }}>
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
          {navItems.map(item => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: item.label === "Mi Negocio" ? "#7c3aed22" : "transparent", color: item.label === "Mi Negocio" ? "#a855f7" : "#888", fontSize: 13, fontWeight: item.label === "Mi Negocio" ? 600 : 400, borderLeft: item.label === "Mi Negocio" ? "2px solid #a855f7" : "2px solid transparent", cursor: "pointer" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
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
      <main style={{ marginLeft: 220, flex: 1, padding: 32, maxWidth: 800 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Mi Negocio</h1>
          <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Información de tu restaurante o negocio</p>
        </div>

        {/* LOGO */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Logo del negocio</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 100, height: 100, borderRadius: 12, background: "#16161d", border: "2px dashed #2a2a35", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {logo ? <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 32 }}>🏢</span>}
            </div>
            <div>
              <label style={{ cursor: "pointer" }}>
                <div style={{ background: "#7c3aed22", border: "1px solid #7c3aed44", borderRadius: 8, padding: "10px 18px", color: "#a855f7", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-block" }}>
                  📷 Subir logo
                </div>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleLogo(f); }} />
              </label>
              {logo && <button onClick={() => setLogo("")} style={{ display: "block", marginTop: 8, background: "transparent", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer" }}>✕ Quitar logo</button>}
              <p style={{ color: "#555", fontSize: 11, marginTop: 8 }}>PNG, JPG. Recomendado: 400x400px</p>
            </div>
          </div>
        </div>

        {/* DATOS PRINCIPALES */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Información principal</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>NOMBRE DEL NEGOCIO</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: La Trattoria" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>TIPO DE NEGOCIO</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["Restaurante", "Cafetería", "Pastelería", "Pizzería", "Bar", "Food Truck", "Mariscos", "Sushi", "Vegano", "Otro"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>DESCRIPCIÓN</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Describe tu negocio en pocas palabras..." rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        {/* CONTACTO */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Contacto y ubicación</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>TELÉFONO</label>
              <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+52 55 1234 5678" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="contacto@minegocio.com" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>DIRECCIÓN</label>
              <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Av. Principal 123, Ciudad, Estado" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>SITIO WEB</label>
              <input value={sitioWeb} onChange={e => setSitioWeb(e.target.value)} placeholder="https://minegocio.com" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Redes sociales</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "INSTAGRAM", icon: "📸", value: instagram, set: setInstagram, placeholder: "@minegocio" },
              { label: "FACEBOOK", icon: "📘", value: facebook, set: setFacebook, placeholder: "facebook.com/minegocio" },
              { label: "TIKTOK", icon: "🎵", value: tiktok, set: setTiktok, placeholder: "@minegocio" },
              { label: "WHATSAPP", icon: "💬", value: whatsapp, set: setWhatsapp, placeholder: "+52 55 1234 5678" },
            ].map(r => (
              <div key={r.label}>
                <label style={labelStyle}>{r.icon} {r.label}</label>
                <input value={r.value} onChange={e => r.set(e.target.value)} placeholder={r.placeholder} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={guardar} style={{ background: guardado ? "#16a34a" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 10, padding: "14px 32px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.3s" }}>
          {guardando ? "Guardando..." : guardado ? "✓ Guardado" : "💾 Guardar cambios"}
        </button>
      </main>
    </div>
  );
}