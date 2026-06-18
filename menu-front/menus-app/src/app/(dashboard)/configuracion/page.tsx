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

export default function Configuracion() {
  const [tab, setTab] = useState<"cuenta" | "preferencias">("cuenta");

  // Cuenta
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNuevo, setPasswordNuevo] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorPass, setErrorPass] = useState("");

  // Preferencias
  const [temaEditor, setTemaEditor] = useState("oscuro");
  const [idiomaMenu, setIdiomaMenu] = useState("es");
  const [autoGuardar, setAutoGuardar] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifVistas, setNotifVistas] = useState(false);
  const [moneda, setMoneda] = useState("MXN");

  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      const u = JSON.parse(usuario);
      setNombre(u.nombre || "");
      setEmail(u.email || "");
    }
    const prefs = localStorage.getItem("preferencias");
    if (prefs) {
      const p = JSON.parse(prefs);
      setTemaEditor(p.temaEditor || "oscuro");
      setIdiomaMenu(p.idiomaMenu || "es");
      setAutoGuardar(p.autoGuardar ?? true);
      setNotifEmail(p.notifEmail ?? true);
      setNotifVistas(p.notifVistas ?? false);
      setMoneda(p.moneda || "MXN");
    }
  }, []);

  const guardarCuenta = () => {
    if (passwordNuevo && passwordNuevo !== passwordConfirm) {
      setErrorPass("Las contraseñas no coinciden"); return;
    }
    if (passwordNuevo && passwordNuevo.length < 6) {
      setErrorPass("Mínimo 6 caracteres"); return;
    }
    setErrorPass("");
    setGuardando(true);
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    localStorage.setItem("usuario", JSON.stringify({ ...usuario, nombre, email, ...(passwordNuevo ? { password: passwordNuevo } : {}) }));
    setTimeout(() => { setGuardando(false); setGuardado(true); setPasswordActual(""); setPasswordNuevo(""); setPasswordConfirm(""); setTimeout(() => setGuardado(false), 2000); }, 600);
  };

  const guardarPreferencias = () => {
    setGuardando(true);
    localStorage.setItem("preferencias", JSON.stringify({ temaEditor, idiomaMenu, autoGuardar, notifEmail, notifVistas, moneda }));
    setTimeout(() => { setGuardando(false); setGuardado(true); setTimeout(() => setGuardado(false), 2000); }, 600);
  };

  const inputStyle: React.CSSProperties = { background: "#16161d", border: "1px solid #2a2a35", borderRadius: 8, color: "white", fontSize: 13, outline: "none", padding: "10px 14px", width: "100%", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, display: "block" };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "#7c3aed" : "#2a2a35", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
    </div>
  );

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
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: item.label === "Configuración" ? "#7c3aed22" : "transparent", color: item.label === "Configuración" ? "#a855f7" : "#888", fontSize: 13, fontWeight: item.label === "Configuración" ? 600 : 400, borderLeft: item.label === "Configuración" ? "2px solid #a855f7" : "2px solid transparent", cursor: "pointer" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
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
      <main style={{ marginLeft: 220, flex: 1, padding: 32, maxWidth: 740 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Configuración</h1>
          <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Ajusta tu cuenta y preferencias</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#1e1e28", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {(["cuenta", "preferencias"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setGuardado(false); }} style={{ background: tab === t ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent", border: "none", borderRadius: 8, padding: "8px 20px", color: tab === t ? "white" : "#666", fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: "pointer", textTransform: "capitalize" }}>
              {t === "cuenta" ? "👤 Cuenta" : "⚙️ Preferencias"}
            </button>
          ))}
        </div>

        {tab === "cuenta" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
              <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Datos de la cuenta</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>NOMBRE</label>
                  <input value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
              <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Cambiar contraseña</div>
              <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>Deja en blanco si no quieres cambiarla</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={labelStyle}>CONTRASEÑA ACTUAL</label>
                  <input value={passwordActual} onChange={e => setPasswordActual(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>NUEVA CONTRASEÑA</label>
                    <input value={passwordNuevo} onChange={e => setPasswordNuevo(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>CONFIRMAR CONTRASEÑA</label>
                    <input value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} />
                  </div>
                </div>
                {errorPass && <div style={{ color: "#f87171", fontSize: 12 }}>⚠️ {errorPass}</div>}
              </div>
            </div>

            <div style={{ background: "#dc262622", border: "1px solid #dc262644", borderRadius: 12, padding: 20 }}>
              <div style={{ color: "#f87171", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Zona de peligro</div>
              <div style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>Eliminar tu cuenta borrará todos tus menús permanentemente.</div>
              <button style={{ background: "transparent", border: "1px solid #dc2626", borderRadius: 8, padding: "8px 16px", color: "#f87171", fontSize: 13, cursor: "pointer" }}>🗑️ Eliminar mi cuenta</button>
            </div>

            <button onClick={guardarCuenta} style={{ background: guardado ? "#16a34a" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 10, padding: "14px 32px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {guardando ? "Guardando..." : guardado ? "✓ Guardado" : "💾 Guardar cambios"}
            </button>
          </div>
        )}

        {tab === "preferencias" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
              <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Editor</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>MONEDA PREDETERMINADA</label>
                    <select value={moneda} onChange={e => setMoneda(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                      {["MXN", "USD", "EUR", "COP", "ARS", "CLP", "PEN", "BRL"].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>IDIOMA DEL MENÚ</label>
                    <select value={idiomaMenu} onChange={e => setIdiomaMenu(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="it">Italiano</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #2a2a35" }}>
                  <div>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 500 }}>Auto-guardar</div>
                    <div style={{ color: "#555", fontSize: 12 }}>Guardar cambios automáticamente cada 2 minutos</div>
                  </div>
                  <Toggle value={autoGuardar} onChange={() => setAutoGuardar(!autoGuardar)} />
                </div>
              </div>
            </div>

            <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 12, padding: 24 }}>
              <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Notificaciones</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Notificaciones por email", desc: "Recibe resúmenes semanales de tus menús", value: notifEmail, set: () => setNotifEmail(!notifEmail) },
                  { label: "Alertas de vistas", desc: "Cuando tu menú alcanza un hito de visitas", value: notifVistas, set: () => setNotifVistas(!notifVistas) },
                ].map((n, i, arr) => (
                  <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #2a2a35" : "none" }}>
                    <div>
                      <div style={{ color: "white", fontSize: 13, fontWeight: 500 }}>{n.label}</div>
                      <div style={{ color: "#555", fontSize: 12 }}>{n.desc}</div>
                    </div>
                    <Toggle value={n.value} onChange={n.set} />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={guardarPreferencias} style={{ background: guardado ? "#16a34a" : "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 10, padding: "14px 32px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {guardando ? "Guardando..." : guardado ? "✓ Guardado" : "💾 Guardar preferencias"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}