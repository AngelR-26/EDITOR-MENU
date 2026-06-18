"use client";
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cloudinaryService } from "@/services/cloudinary.service";


const fuentes = [
  "Playfair Display", "Georgia", "Arial", "Montserrat", "Times New Roman",
  "Lora", "Raleway", "Oswald", "Merriweather", "Poppins",
  "EB Garamond", "Cinzel", "Dancing Script", "Josefin Sans", "Libre Baskerville"
];
const fondos = [
  { nombre: "Clásico", bg: "linear-gradient(135deg, #fefefe, #f8f4ee)", texto: "#2c1810", acento: "#8b4513" },
  { nombre: "Oscuro", bg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", texto: "#ffffff", acento: "#a855f7" },
  { nombre: "Verde", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", texto: "#14532d", acento: "#16a34a" },
  { nombre: "Azul", bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", texto: "#1e3a5f", acento: "#2563eb" },
  { nombre: "Rosa", bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)", texto: "#831843", acento: "#ec4899" },
  { nombre: "Sepia", bg: "linear-gradient(135deg, #fdf6e3, #f5e6c8)", texto: "#3b2a1a", acento: "#a0522d" },
  { nombre: "Noche Azul", bg: "linear-gradient(135deg, #0f172a, #1e293b)", texto: "#e2e8f0", acento: "#38bdf8" },
  { nombre: "Menta", bg: "linear-gradient(135deg, #f0faf5, #c6f0dc)", texto: "#134e2a", acento: "#10b981" },
  { nombre: "Lavanda", bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)", texto: "#3b0764", acento: "#7c3aed" },
  { nombre: "Naranja", bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", texto: "#7c2d12", acento: "#ea580c" },
  { nombre: "Carbón", bg: "linear-gradient(135deg, #18181b, #27272a)", texto: "#fafafa", acento: "#facc15" },
  { nombre: "Rojo Vino", bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)", texto: "#4c0519", acento: "#be123c" },
];
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Platillo = { 
  nombre: string; 
  precio: string; 
  descripcion: string; 
  imagen?: string;
  colorTexto?: string;
  imagenPos?: { x: number; y: number };
};
type Seccion = { id: number; nombre: string; platillos: Platillo[] };

const seccionesIniciales: Seccion[] = [
  { id: 1, nombre: "ENTRADAS", platillos: [
    { nombre: "Bruschetta Clásica", precio: "$85", descripcion: "Pan tostado con tomate" },
    { nombre: "Ensalada César", precio: "$90", descripcion: "Lechuga romana, crutones" },
    { nombre: "Sopa del Día", precio: "$70", descripcion: "Pregunta al mesero" },
  ]},
  { id: 2, nombre: "PLATOS FUERTES", platillos: [
    { nombre: "Salmón al Grill", precio: "$220", descripcion: "Con vegetales asados" },
    { nombre: "Filete a la Parrilla", precio: "$250", descripcion: "Término a tu elección" },
    { nombre: "Pasta Alfredo", precio: "$180", descripcion: "Con crema y parmesano" },
  ]},
  { id: 3, nombre: "POSTRES", platillos: [
    { nombre: "Cheesecake de Fresa", precio: "$90", descripcion: "Con salsa de fresas" },
    { nombre: "Volcán de Chocolate", precio: "$95", descripcion: "Con helado de vainilla" },
    { nombre: "Tiramisú", precio: "$85", descripcion: "Receta italiana original" },
  ]},
];

export default function Editor() {
  const [nombreMenu, setNombreMenu] = useState("Menú Restaurante");
  const [subtitulo, setSubtitulo] = useState("RESTAURANTE");
  const [fuenteActiva, setFuenteActiva] = useState("Playfair Display");
  const [fondoActivo, setFondoActivo] = useState(fondos[0]);
  const [tamaño, setTamaño] = useState(48);
  const [guardado, setGuardado] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [secciones, setSecciones] = useState<Seccion[]>(seccionesIniciales);
  const [editando, setEditando] = useState<{tipo: string, seccionId?: number, platilloIdx?: number, campo?: string} | null>(null);
  const [herramienta, setHerramienta] = useState("Texto");
  const [mostrarDescripciones, setMostrarDescripciones] = useState(true);
  const [mostrarImagenes, setMostrarImagenes] = useState(true);
  const [orientacion, setOrientacion] = useState<"vertical" | "horizontal">("vertical");
  const [colorTitulo, setColorTitulo] = useState("");
  const [colorSubtitulo, setColorSubtitulo] = useState("");
  const [fuenteTitulo, setFuenteTitulo] = useState("");
  const [elementoActivo, setElementoActivo] = useState<{
    tipo: 'titulo' | 'subtitulo' | 'platillo';
    seccionId?: number;
    platilloIdx?: number;
    nombre: string;
  } | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null); // ID del menú que se está editando
  const [usuarioId, setUsuarioId] = useState<number>(1); // ID por defecto
  const [cargandoMenu, setCargandoMenu] = useState(false); // Estado para saber si se está cargando un menú
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Cargar usuario y menú al iniciar
  useEffect(() => {
    // Obtener usuario del localStorage
    const usuarioData = localStorage.getItem("usuario");
    if (!usuarioData) {
      // Si no hay usuario, redirigir al login
      window.location.href = "/login";
      return;
    }
    
    const usuario = JSON.parse(usuarioData);
    setUsuarioId(usuario.id || 1);
    
    // Si hay un menuId en localStorage, cargar ese menú ANTES de permitir cualquier acción
    const menuIdToLoad = localStorage.getItem("editor_menu_id");
    if (menuIdToLoad) {
      const menuIdNum = Number(menuIdToLoad);
      if (isNaN(menuIdNum) || menuIdNum <= 0) {
        console.error('❌ editor_menu_id inválido:', menuIdToLoad);
        localStorage.removeItem("editor_menu_id");
        return;
      }
      
      console.log('🔍 Cargando menú:', menuIdNum);
      setCargandoMenu(true);
      
      // Cargar el menú y esperar a que termine
      cargarMenu(menuIdNum).then((exitoso) => {
        if (!exitoso) {
          console.error('❌ No se pudo cargar el menú, creando uno nuevo');
          setMenuId(null); // Resetear a null para crear uno nuevo
        }
        localStorage.removeItem("editor_menu_id");
      }).finally(() => {
        setCargandoMenu(false);
      });
    }
    
    // Cargar plantilla si existe (solo si no se está cargando un menú)
    if (!menuIdToLoad) {
      const guardada = localStorage.getItem("plantilla_cargada");
      if (guardada) {
        try {
          const config = JSON.parse(guardada);
          if (config.fuenteActiva) setFuenteActiva(config.fuenteActiva);
          if (config.fondoActivo) setFondoActivo(config.fondoActivo);
          if (config.tamaño) setTamaño(config.tamaño);
          if (config.subtitulo) setSubtitulo(config.subtitulo);
          if (config.secciones) setSecciones(config.secciones);
          localStorage.removeItem("plantilla_cargada");
        } catch {}
      }
    }
  }, []);
  
  // Función para cargar un menú existente
  const cargarMenu = async (id: number) => {
    try {
      console.log('🔄 Cargando menú:', id);
      const res = await fetch(`${API}/api/menus/${id}`);
      const data = await res.json();
      console.log('📨 Respuesta del servidor:', data);
      
      if (data.ok && data.menu) {
        const menu = data.menu;
        
        // IMPORTANTE: Actualizar menuId PRIMERO para que el guardado funcione
        setMenuId(menu.id);
        setNombreMenu(menu.nombre);
        
        if (menu.data_json) {
          const config = JSON.parse(menu.data_json);
          console.log('⚙️ Configuración del menú:', config);
          
          // Cargar todas las propiedades de configuración
          if (config.fuenteActiva !== undefined) setFuenteActiva(config.fuenteActiva);
          if (config.fondoActivo !== undefined) setFondoActivo(config.fondoActivo);
          if (config.tamaño !== undefined) setTamaño(config.tamaño);
          if (config.subtitulo !== undefined) setSubtitulo(config.subtitulo);
          if (config.secciones !== undefined) {
            console.log('📋 Secciones cargadas:', config.secciones.length);
            setSecciones(config.secciones);
          }
          if (config.colorTitulo !== undefined) setColorTitulo(config.colorTitulo);
          if (config.colorSubtitulo !== undefined) setColorSubtitulo(config.colorSubtitulo);
          if (config.fuenteTitulo !== undefined) setFuenteTitulo(config.fuenteTitulo);
        }
        setGuardado(true);
        console.log('✅ Menú cargado correctamente con ID:', menu.id);
        return true;
      } else {
        console.error('❌ No se pudo cargar el menú:', data.mensaje);
        alert('Error al cargar el menú: ' + data.mensaje);
        return false;
      }
    } catch (error) {
      console.error("❌ Error al cargar menú:", error);
      alert('Error de conexión al cargar el menú');
      return false;
    }
  };
  const [textoResaltado, setTextoResaltado] = useState("");
  const [tamañoResaltado, setTamañoResaltado] = useState(24);
  const [exportando, setExportando] = useState(false);
  


  const editarNombreSeccion = (seccionId: number, valor: string) => {
    setSecciones(prev => prev.map(s => s.id === seccionId ? { ...s, nombre: valor } : s));
  };

const editarPlatillo = (seccionId: number, idx: number, campo: keyof Platillo, valor: string | { x: number; y: number }) => {
    setSecciones(prev => prev.map(s =>
      s.id === seccionId ? { ...s, platillos: s.platillos.map((p, i) => i === idx ? { ...p, [campo]: valor } : p) } : s
    ));
  };

  const subirImagen = async (seccionId: number, idx: number, file: File) => {
    try {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('❌ El archivo debe ser una imagen');
        return;
      }
      
      // Validar tamaño máximo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ La imagen no debe pesar más de 5MB');
        return;
      }
      
      // Intentar subir a Cloudinary
      try {
        const imageUrl = await cloudinaryService.uploadImage(file, 'menu-master/platillos');
        
        // Guardar URL en el platillo
        editarPlatillo(seccionId, idx, "imagen", imageUrl);
        setGuardado(false);
        
        console.log('✅ Imagen subida a Cloudinary:', imageUrl);
      } catch (cloudinaryError) {
        // Fallback: usar base64 si Cloudinary falla
        console.warn('⚠️ Cloudinary falló, usando base64:', cloudinaryError);
        
        const reader = new FileReader();
        reader.onload = ev => {
          const imagenUrl = ev.target?.result as string;
          editarPlatillo(seccionId, idx, "imagen", imagenUrl);
          setGuardado(false);
          console.log('✅ Imagen guardada en base64 (fallback)');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      alert('❌ Error al subir imagen: ' + (error as Error).message);
    }
  };

  const eliminarImagen = (seccionId: number, idx: number) => {
    editarPlatillo(seccionId, idx, "imagen", "");
    setGuardado(false);
  };

  const agregarPlatillo = (seccionId: number) => {
    setSecciones(prev => prev.map(s =>
      s.id === seccionId ? { ...s, platillos: [...s.platillos, { nombre: "Nuevo platillo", precio: "$0", descripcion: "Descripción" }] } : s
    ));
    setGuardado(false);
  };

  const eliminarPlatillo = (seccionId: number, idx: number) => {
    setSecciones(prev => prev.map(s =>
      s.id === seccionId ? { ...s, platillos: s.platillos.filter((_, i) => i !== idx) } : s
    ));
    setGuardado(false);
  };

  const agregarSeccion = () => {
    const nuevaId = Math.max(...secciones.map(s => s.id)) + 1;
    setSecciones(prev => [...prev, { id: nuevaId, nombre: "NUEVA SECCIÓN", platillos: [{ nombre: "Nuevo platillo", precio: "$0", descripcion: "Descripción" }] }]);
    setGuardado(false);
  };

  const eliminarSeccion = (seccionId: number) => {
    if (secciones.length <= 1) return;
    setSecciones(prev => prev.filter(s => s.id !== seccionId));
    setGuardado(false);
  };

  const exportarPDF = async () => {
      if (!menuRef.current) return;
      
      // Ocultar elementos de UI antes de exportar
      setExportando(true);
      
      // Esperar a que React actualice el DOM
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const canvas = await html2canvas(menuRef.current, { 
          scale: 2, 
          useCORS: true,
          logging: false,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: orientacion === "horizontal" ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width / 2, canvas.height / 2],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`${nombreMenu}.pdf`);
      } finally {
        // Restaurar elementos de UI
        setExportando(false);
      }
    };

  const handleGuardar = async (estado: string) => {
    // Validar que no se esté cargando un menú
    if (cargandoMenu) {
      alert('⏳ Cargando menú, por favor espera...');
      return;
    }
    
    // Validar que haya un nombre de menú
    if (!nombreMenu || nombreMenu.trim() === "") {
      alert('❌ El menú debe tener un nombre');
      return;
    }
    
    setGuardando(true);
    setGuardado(false);
    try {
      // Filtrar las secciones para quitar platillos vacíos
      const seccionesFiltradas = secciones.map(seccion => ({
        ...seccion,
        platillos: seccion.platillos.filter(p => p.nombre && p.nombre.trim() !== "")
      }));
      
      const dataJson = JSON.stringify({ 
        secciones: seccionesFiltradas, 
        fuenteActiva, 
        fondoActivo, 
        tamaño, 
        subtitulo, 
        colorTitulo, 
        colorSubtitulo, 
        fuenteTitulo 
      });
      
      let res;
      let esActualizacion = menuId !== null && menuId !== undefined;
      
      if (esActualizacion) {
        // ACTUALIZAR menú existente
        console.log('✏️ Actualizando menú ID:', menuId);
        res = await fetch(`${API}/api/menus/${menuId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombreMenu,
            estado,
            data_json: dataJson,
          }),
        });
      } else {
        // CREAR menú nuevo
        console.log('✨ Creando menú nuevo, user_id:', usuarioId);
        res = await fetch(`${API}/api/menus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombreMenu,
            estado,
            data_json: dataJson,
            user_id: usuarioId,
          }),
        });
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || 'Error al guardar');
      }
      
      const data = await res.json();
      
      if (!data.ok) {
        throw new Error(data.mensaje || 'Error al guardar');
      }
      
      // Éxito
      setGuardado(true);
      
      // Si es un menú nuevo, guardar el ID para futuras actualizaciones
      if (!esActualizacion && data.menuId) {
        setMenuId(data.menuId);
        console.log('✅ Menú creado con ID:', data.menuId);
      } else if (esActualizacion) {
        console.log('✅ Menú actualizado correctamente');
      }
      
      if (estado === "Publicado") {
        alert("🚀 ¡Menú publicado!");
        // Disparar evento para que mis-menus recargue
        window.dispatchEvent(new CustomEvent('menuGuardado'));
        // Esperar un poco antes de redirigir
        setTimeout(() => {
          window.location.href = "/mis-menus";
        }, 500);
      } else {
        alert("💾 ¡Guardado como borrador!");
        // Disparar evento para que mis-menus recargue
        window.dispatchEvent(new CustomEvent('menuGuardado'));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Error: " + (error as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0f0f13", overflow: "hidden" }}>

      {/* SIDEBAR IZQUIERDO */}
      <aside style={{
        width: 56, background: "#16161d", borderRight: "1px solid #2a2a35",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "12px 0", gap: 4, zIndex: 10,
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "bold", fontSize: 14, marginBottom: 12,
          }}>M</div>
        </a>
        {[{ icon: "T", label: "Texto" }, { icon: "🎨", label: "Fondos" }, { icon: "☰", label: "Secciones" }, { icon: "🖼️", label: "Imágenes" }].map(h => (
          <button key={h.label} onClick={() => setHerramienta(h.label)} style={{
            width: 44, height: 44, borderRadius: 8, border: "none",
            background: herramienta === h.label ? "#7c3aed33" : "transparent",
            color: herramienta === h.label ? "#a855f7" : "#666",
            cursor: "pointer", fontSize: 16,
            borderLeft: herramienta === h.label ? "2px solid #a855f7" : "2px solid transparent",
          }} title={h.label}>{h.icon}</button>
        ))}
      </aside>

      {/* PANEL CENTRAL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* BARRA SUPERIOR */}
        <div style={{
          height: 52, background: "#16161d", borderBottom: "1px solid #2a2a35",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/mis-menus" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>← Volver</a>
            <span style={{ color: "#333" }}>|</span>
            
            <input
              value={nombreMenu}
              onChange={e => { setNombreMenu(e.target.value); setGuardado(false); }}
              style={{
                background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
                color: "white", fontSize: 13, fontWeight: 600, outline: "none",
                padding: "4px 10px", width: 180,
              }}
            />
            <span style={{
              background: guardado ? "#16a34a22" : "#ca8a0422",
              color: guardado ? "#4ade80" : "#fbbf24",
              border: `1px solid ${guardado ? "#16a34a44" : "#ca8a0444"}`,
              borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600,
            }}>
              {guardando ? "● Guardando..." : guardado ? "● Guardado" : "● Sin guardar"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select value={fuenteActiva} onChange={e => { setFuenteActiva(e.target.value); setGuardado(false); }} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
              color: "white", padding: "4px 8px", fontSize: 11, outline: "none",
            }}>
              {fuentes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input type="number" value={tamaño} onChange={e => { setTamaño(Number(e.target.value)); setGuardado(false); }} style={{
              width: 48, background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
              color: "white", padding: "4px 6px", fontSize: 11, outline: "none", textAlign: "center",
            }}
            onSelect={e => {
  const el = e.target as HTMLInputElement;
  setTextoResaltado(el.value.substring(el.selectionStart || 0, el.selectionEnd || 0));
}} />
            <button onClick={() => setMostrarDescripciones(!mostrarDescripciones)} style={{
              background: mostrarDescripciones ? "#7c3aed33" : "#1e1e28",
              border: "1px solid #2a2a35", borderRadius: 6,
              color: mostrarDescripciones ? "#a855f7" : "#aaa",
              padding: "4px 8px", cursor: "pointer", fontSize: 11,
            }}>📝</button>
            <button onClick={() => setMostrarImagenes(!mostrarImagenes)} style={{
              background: mostrarImagenes ? "#7c3aed33" : "#1e1e28",
              border: "1px solid #2a2a35", borderRadius: 6,
              color: mostrarImagenes ? "#a855f7" : "#aaa",
              padding: "4px 8px", cursor: "pointer", fontSize: 11,
            }}>🖼️</button>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={exportarPDF} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              color: "#aaa", padding: "7px 12px", cursor: "pointer", fontSize: 12,
            }}>📄 PDF</button>
            <button onClick={() => handleGuardar("Borrador")} style={{
              background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 8,
              color: "#aaa", padding: "7px 12px", cursor: "pointer", fontSize: 12,
            }}>💾 Borrador</button>
            <button onClick={() => handleGuardar("Publicado")} style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none",
              borderRadius: 8, color: "white", padding: "7px 14px",
              cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>🚀 Publicar</button>
          </div>
        </div>

        {/* CANVAS */}
        <div style={{
          flex: 1, overflow: "auto", background: "#0a0a0e",
          display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 32,
        }}>
          <div ref={menuRef} style={{
              width: orientacion === "vertical" ? 440 : 760,
              display: orientacion === "horizontal" ? "grid" : "block",
              gridTemplateColumns: orientacion === "horizontal" ? "repeat(2, 1fr)" : undefined,
              gap: orientacion === "horizontal" ? 24 : undefined,
              background: fondoActivo.bg,
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              padding: "36px 32px",
              fontFamily: fuenteActiva,
            }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: `2px solid ${fondoActivo.acento}` }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: fondoActivo.acento, marginBottom: 8, opacity: 0.6 }}>✦ ✦ ✦</div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => { setNombreMenu(e.currentTarget.textContent || ""); setGuardado(false); }}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: editando?.tipo === "titulo" ? `2px solid ${fondoActivo.acento}` : "2px solid transparent",
                  outline: "none", fontSize: tamaño / 2.8,
                  color: colorTitulo || fondoActivo.texto,
                  fontWeight: 700,
                  fontFamily: fuenteTitulo || fuenteActiva,
                  letterSpacing: 4,
                  textAlign: "center", width: "100%", cursor: "text",
                  WebkitTextFillColor: colorTitulo || fondoActivo.texto,
                }}
                onSelect={e => {
                  const el = e.target as HTMLElement;
                  setTextoResaltado(el.textContent?.substring(0, el.textContent?.length || 0) || "");
                }}
                onFocus={() => {
                  setEditando({ tipo: "titulo" });
                  setElementoActivo({ tipo: 'titulo', nombre: nombreMenu });
                }}
                onBlurCapture={() => { setEditando(null); setElementoActivo(null); }}
              >
                {nombreMenu.toUpperCase()}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => { setSubtitulo(e.currentTarget.textContent || ""); setGuardado(false); }}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: editando?.tipo === "subtitulo" ? `2px solid ${fondoActivo.acento}` : "2px solid transparent",
                  outline: "none", fontSize: tamaño / 5,
                  color: colorSubtitulo || fondoActivo.acento,
                  fontWeight: 400,
                  fontFamily: fuenteTitulo || fuenteActiva,
                  letterSpacing: 6,
                  textAlign: "center", width: "100%", cursor: "text", marginTop: 4,
                  WebkitTextFillColor: colorSubtitulo || fondoActivo.acento,
                }}
                onSelect={e => {
                  const el = e.target as HTMLElement;
                  setTextoResaltado(el.textContent?.substring(0, el.textContent?.length || 0) || "");
                }}
                onFocus={() => {
                  setEditando({ tipo: "subtitulo" });
                  setElementoActivo({ tipo: 'subtitulo', nombre: subtitulo });
                }}
                onBlurCapture={() => { setEditando(null); setElementoActivo(null); }}
              >
                {subtitulo}
              </div>
              <div style={{ fontSize: 10, letterSpacing: 4, color: fondoActivo.acento, marginTop: 8, opacity: 0.6 }}>✦ ✦ ✦</div>
            </div>

            {/* Secciones */}
            {secciones.map((seccion) => (
              <div key={seccion.id} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => { editarNombreSeccion(seccion.id, e.currentTarget.textContent || ""); setGuardado(false); }}
                    style={{
                      background: "transparent", border: "none",
                      borderBottom: editando?.tipo === "seccion" && editando?.seccionId === seccion.id
                        ? `1px solid ${fondoActivo.acento}` : "1px solid transparent",
                      outline: "none", fontSize: 10, letterSpacing: 3,
                      color: fondoActivo.acento, fontWeight: 700, textAlign: "center",
                      cursor: "text", fontFamily: fuenteActiva,
                      WebkitTextFillColor: fondoActivo.acento,
                    }}
                    onSelect={e => {
                      const el = e.target as HTMLElement;
                      setTextoResaltado(el.textContent?.substring(0, el.textContent?.length || 0) || "");
                    }}
                    onFocus={() => setEditando({ tipo: "seccion", seccionId: seccion.id })}
                    onBlurCapture={() => setEditando(null)}
                  >
                    {seccion.nombre}
                  </div>
                  <button 
                    onClick={() => eliminarSeccion(seccion.id)} 
                    style={{
                      background: "transparent", border: "none", color: "#ff4444",
                      cursor: "pointer", fontSize: 11, padding: 0, 
                      opacity: exportando ? 0 : 0.4,
                      pointerEvents: exportando ? "none" : "auto",
                    }}>✕</button>
                </div>

                {seccion.platillos.map((platillo, idx) => (
                  <div key={idx} style={{ marginBottom: 10, padding: "6px 0", borderBottom: `1px dotted ${fondoActivo.acento}44` }}>

                    {/* Imagen del platillo */}
                    {mostrarImagenes && (
                      <div style={{ marginBottom: 6 }}>
                        {platillo.imagen ? (
                            <div
                              style={{ 
                                position: "relative", 
                                width: 100,
                                height: 100,
                                overflow: "hidden", 
                                borderRadius: 6, 
                                cursor: "grab",
                                border: `1px solid ${fondoActivo.acento}33`,
                                margin: "0 auto",
                              }}
                              onMouseDown={(e) => {
                                const startX = e.clientX;
                                const startY = e.clientY;
                                const pos = platillo.imagenPos || { x: 0, y: 0 };
                                const onMove = (mv: MouseEvent) => {
                                  editarPlatillo(seccion.id, idx, "imagenPos", {
                                    x: pos.x + (mv.clientX - startX),
                                    y: pos.y + (mv.clientY - startY),
                                  });
                                };
                                const onUp = () => {
                                  window.removeEventListener("mousemove", onMove);
                                  window.removeEventListener("mouseup", onUp);
                                };
                                window.addEventListener("mousemove", onMove);
                                window.addEventListener("mouseup", onUp);
                              }}
                            >
                              <img
                                src={platillo.imagen}
                                alt={platillo.nombre}
                                draggable={false}
                                style={{
                                  position: "absolute",
                                  left: platillo.imagenPos?.x ?? 0,
                                  top: platillo.imagenPos?.y ?? 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius: 6,
                                  userSelect: "none",
                                  pointerEvents: "none",
                                }}
                              />
                              <button
                                onClick={(e) => { e.stopPropagation(); eliminarImagen(seccion.id, idx); }}
                                style={{
                                  position: "absolute", top: 4, right: 4,
                                  background: "rgba(0,0,0,0.6)", border: "none",
                                  borderRadius: "50%", color: "white", cursor: "pointer",
                                  width: 20, height: 20, fontSize: 10, zIndex: 2,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  opacity: exportando ? 0 : 1,
                                  pointerEvents: exportando ? "none" : "auto",
                                }}
                              >✕</button>
                            </div>
                        ) : (
                          <label style={{ 
                            cursor: "pointer", display: "block",
                            opacity: exportando ? 0 : 0.5,
                            pointerEvents: exportando ? "none" : "auto",
                          }}>
                            <div style={{
                              border: `1px dashed ${fondoActivo.acento}55`,
                              borderRadius: 6, padding: "8px",
                              textAlign: "center",
                              color: fondoActivo.acento, fontSize: 10,
                            }}>
                              📷 Agregar imagen
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) subirImagen(seccion.id, idx, file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    )}

{/* Nombre y precio */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => { editarPlatillo(seccion.id, idx, "nombre", e.currentTarget.textContent || ""); setGuardado(false); }}
                        style={{
                          background: "transparent",
                          border: "none",
                          borderBottom: editando?.seccionId === seccion.id && editando?.platilloIdx === idx && editando?.campo === "nombre"
                            ? `1px solid ${fondoActivo.acento}` : "1px solid transparent",
                          outline: "none",
                          fontSize: 12,
                          color: platillo.colorTexto || fondoActivo.texto,
                          fontFamily: fuenteActiva,
                          flex: 1,
                          cursor: "text",
                        }}
                        onFocus={() => {
                          setEditando({ tipo: "platillo", seccionId: seccion.id, platilloIdx: idx, campo: "nombre" });
                          setElementoActivo({ tipo: 'platillo', seccionId: seccion.id, platilloIdx: idx, nombre: platillo.nombre });
                        }}
                        onBlurCapture={() => { setEditando(null); setElementoActivo(null); }}
                      >
                        {platillo.nombre}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={e => { 
                            const valor = e.currentTarget.textContent || "0";
                            editarPlatillo(seccion.id, idx, "precio", valor.startsWith('$') ? valor : `$${valor}`); 
                            setGuardado(false); 
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            fontSize: 12,
                            color: fondoActivo.acento,
                            fontFamily: fuenteActiva,
                            fontWeight: 600,
                            cursor: "text",
                            minWidth: 40,
                            textAlign: "right",
                          }}
                          onFocus={() => setEditando({ tipo: "platillo", seccionId: seccion.id, platilloIdx: idx, campo: "precio" })}
                          onBlurCapture={() => setEditando(null)}
                        >
                          {platillo.precio.replace('$', '')}
                        </div>
                        <button 
                          onClick={() => eliminarPlatillo(seccion.id, idx)} 
                          style={{
                            background: "transparent", border: "none", color: "#ff4444",
                            cursor: "pointer", fontSize: 10, padding: 0, 
                            opacity: exportando ? 0 : 0.4,
                            pointerEvents: exportando ? "none" : "auto",
                          }}>✕</button>
                      </div>
                    </div>

                    {/* Descripción */}
                    {mostrarDescripciones && (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => { editarPlatillo(seccion.id, idx, "descripcion", e.currentTarget.textContent || ""); setGuardado(false); }}
                        style={{
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          fontSize: 10,
                          color: platillo.colorTexto || fondoActivo.texto,
                          fontFamily: fuenteActiva,
                          width: "100%",
                          opacity: 0.6,
                          cursor: "text",
                          marginTop: 2,
                        }}
                        onFocus={() => {
                          setEditando({ tipo: "platillo", seccionId: seccion.id, platilloIdx: idx, campo: "descripcion" });
                          setElementoActivo({ tipo: 'platillo', seccionId: seccion.id, platilloIdx: idx, nombre: platillo.nombre });
                        }}
                        onBlurCapture={() => { setEditando(null); setElementoActivo(null); }}
                      >
                        {platillo.descripcion}
                      </div>
                    )}
                  </div>
                ))}

                <button 
                  onClick={() => agregarPlatillo(seccion.id)} 
                  style={{
                    background: "transparent", border: `1px dashed ${fondoActivo.acento}55`,
                    borderRadius: 4, color: fondoActivo.acento, cursor: "pointer",
                    fontSize: 10, padding: "4px 12px", marginTop: 4, width: "100%", 
                    opacity: exportando ? 0 : 0.7,
                    pointerEvents: exportando ? "none" : "auto",
                  }}>+ Agregar platillo</button>
              </div>
            ))}

            <button 
              onClick={agregarSeccion} 
              style={{
                background: "transparent", border: `2px dashed ${fondoActivo.acento}33`,
                borderRadius: 8, color: fondoActivo.acento, cursor: "pointer",
                fontSize: 11, padding: "10px", marginTop: 8, width: "100%",
                opacity: exportando ? 0 : 0.6, 
                pointerEvents: exportando ? "none" : "auto",
                fontFamily: fuenteActiva,
              }}>+ Agregar sección</button>
          </div>
        </div>

        <div style={{
          height: "auto", minHeight: 36, background: "#16161d", borderTop: "1px solid #2a2a35",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", gap: 12,
        }}>
          {textoResaltado ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#a855f7", fontSize: 11, fontWeight: 600 }}>Texto seleccionado:</span>
              <span style={{
                color: "white", fontSize: tamañoResaltado,
                fontFamily: fuenteActiva, transition: "font-size 0.2s",
              }}>{textoResaltado}</span>
              <input type="range" min={12} max={72} value={tamañoResaltado}
                onChange={e => setTamañoResaltado(Number(e.target.value))}
                style={{ width: 80 }}
              />
              <span style={{ color: "#666", fontSize: 11 }}>{tamañoResaltado}px</span>
            </div>
          ) : (
            <span style={{ color: "#444", fontSize: 11 }}>💡 Selecciona texto en cualquier campo para ajustar su tamaño</span>
          )}
        </div>
      </div>

      {/* PANEL DERECHO */}
      <aside style={{
        width: 200, background: "#16161d", borderLeft: "1px solid #2a2a35",
        padding: 14, display: "flex", flexDirection: "column", gap: 18, overflowY: "auto",
      }}>
        <div>
          <div style={{ color: "#666", fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>FONDO DEL MENÚ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {fondos.map(f => (
              <button key={f.nombre} onClick={() => { setFondoActivo(f); setGuardado(false); }} style={{
                background: f.bg, border: fondoActivo.nombre === f.nombre ? "2px solid #a855f7" : "2px solid transparent",
                borderRadius: 8, padding: "8px 12px", cursor: "pointer",
                color: f.texto, fontSize: 11, fontWeight: 600, textAlign: "left",
              }}>{f.nombre}</button>
            ))}
          </div>
        </div>

        <div>
          <div>
              <div style={{ color: "#666", fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>TÍTULO</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: "#666", fontSize: 10 }}>Color título</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {["#ffffff","#000000","#fbbf24","#a855f7","#38bdf8","#f43f5e","#10b981","#ea580c","#8b4513","#2563eb"].map(c => (
                    <button key={c} onClick={() => setColorTitulo(c)} style={{
                      width: 16, height: 16, borderRadius: "50%", background: c,
                      border: colorTitulo === c ? "2px solid white" : "1px solid #555",
                      cursor: "pointer", padding: 0,
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: "#666", fontSize: 10 }}>Color subtítulo</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {["#ffffff","#000000","#fbbf24","#a855f7","#38bdf8","#f43f5e","#10b981","#ea580c","#8b4513","#2563eb"].map(c => (
                    <button key={c} onClick={() => setColorSubtitulo(c)} style={{
                      width: 16, height: 16, borderRadius: "50%", background: c,
                      border: colorSubtitulo === c ? "2px solid white" : "1px solid #555",
                      cursor: "pointer", padding: 0,
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: "#666", fontSize: 10 }}>Color texto</span>
                {elementoActivo?.tipo === 'platillo' && elementoActivo.seccionId && elementoActivo.platilloIdx !== undefined && (() => {
                  const platilloActual = secciones.find(s => s.id === elementoActivo.seccionId)?.platillos[elementoActivo.platilloIdx];
                  const colorActual = platilloActual?.colorTexto || fondoActivo.texto;
                  return (
                    <>
                      <div style={{ fontSize: 9, color: "#a855f7", marginTop: 4, marginBottom: 4 }}>
                        Editando: {elementoActivo.nombre}
                      </div>
                      <div style={{ fontSize: 9, color: "#666", marginBottom: 4 }}>
                        Color actual: <span style={{ color: colorActual, fontWeight: 700 }}>{colorActual}</span>
                      </div>
                    </>
                  );
                })()}
                {elementoActivo?.tipo !== 'platillo' && (
                  <div style={{ fontSize: 9, color: "#666", marginTop: 4, marginBottom: 4 }}>
                    Selecciona un platillo para cambiar su color
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {["#ffffff","#000000","#fbbf24","#a855f7","#38bdf8","#f43f5e","#10b981","#ea580c","#8b4513","#2563eb"].map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        if (elementoActivo?.tipo === 'platillo' && elementoActivo.seccionId && elementoActivo.platilloIdx !== undefined) {
                          editarPlatillo(elementoActivo.seccionId, elementoActivo.platilloIdx, "colorTexto", c);
                          setGuardado(false);
                        }
                      }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: c,
                        border: "2px solid #555",
                        cursor: elementoActivo?.tipo === 'platillo' ? "pointer" : "not-allowed",
                        padding: 0,
                        opacity: elementoActivo?.tipo === 'platillo' ? 1 : 0.5,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 10 }}>Fuente título</span>
                <select value={fuenteTitulo} onChange={e => setFuenteTitulo(e.target.value)} style={{
                  width: "100%", marginTop: 4,
                  background: "#1e1e28", border: "1px solid #2a2a35",
                  borderRadius: 6, color: "white", padding: "4px 6px", fontSize: 10, outline: "none",
                }}>
                  <option value="">— Igual que el menú —</option>
                  {fuentes.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* PRECIOS - NUEVA SECCIÓN */}
            <div>
              <div style={{ color: "#666", fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>PRECIOS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
                {secciones.map(seccion => (
                  <div key={seccion.id}>
                    <div style={{ color: "#888", fontSize: 9, fontWeight: 600, marginBottom: 4, letterSpacing: 0.5 }}>
                      {seccion.nombre.toUpperCase()}
                    </div>
                    {seccion.platillos.map((platillo, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 8px",
                          background: "#1e1e28",
                          borderRadius: 6,
                          marginBottom: 2,
                        }}
                      >
                        <span style={{
                          flex: 1,
                          color: "#aaa",
                          fontSize: 10,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {platillo.nombre}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ color: fondoActivo.acento, fontSize: 10, fontWeight: 600 }}>$</span>
                          <input
                            value={platillo.precio.replace('$', '')}
                            onChange={e => {
                              editarPlatillo(seccion.id, idx, "precio", `$${e.target.value}`);
                              setGuardado(false);
                            }}
                            style={{
                              width: 50,
                              background: "#0f0f13",
                              border: "1px solid #2a2a35",
                              borderRadius: 4,
                              color: fondoActivo.acento,
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 4px",
                              textAlign: "right",
                              outline: "none",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ color: "#666", fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>OPCIONES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => setMostrarDescripciones(!mostrarDescripciones)} style={{
              background: mostrarDescripciones ? "#7c3aed22" : "#1e1e28",
              border: `1px solid ${mostrarDescripciones ? "#7c3aed44" : "#2a2a35"}`,
              borderRadius: 6, color: mostrarDescripciones ? "#a855f7" : "#666",
              padding: "8px", cursor: "pointer", fontSize: 11, textAlign: "left",
            }}>📝 {mostrarDescripciones ? "✓" : "○"} Descripciones</button>
            <button onClick={() => setMostrarImagenes(!mostrarImagenes)} style={{
              background: mostrarImagenes ? "#7c3aed22" : "#1e1e28",
              border: `1px solid ${mostrarImagenes ? "#7c3aed44" : "#2a2a35"}`,
              borderRadius: 6, color: mostrarImagenes ? "#a855f7" : "#666",
              padding: "8px", cursor: "pointer", fontSize: 11, textAlign: "left",
            }}>🖼️ {mostrarImagenes ? "✓" : "○"} Imágenes</button>
          </div>
        <button onClick={() => setOrientacion(o => o === "vertical" ? "horizontal" : "vertical")} style={{
          background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: 6,
          color: "#aaa", padding: "4px 8px", cursor: "pointer", fontSize: 11,
        }} title="Cambiar orientación">
          {orientacion === "vertical" ? "⇔" : "⇕"}
        </button>
        </div>

        <div>
          <div style={{ color: "#666", fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>SECCIONES ({secciones.length})</div>
          {secciones.map((s) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 8px", borderRadius: 6, marginBottom: 2,
              background: "#1e1e28", color: "#aaa", fontSize: 11,
            }}>
              <span style={{ fontSize: 9 }}>☰</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.nombre}</span>
              <span style={{ color: "#555", fontSize: 10 }}>{s.platillos.length}</span>
            </div>
          ))}
          <button onClick={agregarSeccion} style={{
            background: "#7c3aed22", border: "1px solid #7c3aed44",
            borderRadius: 6, color: "#a855f7", cursor: "pointer",
            fontSize: 11, padding: "6px", marginTop: 6, width: "100%",
          }}>+ Nueva sección</button>
        </div>

        <div style={{ background: "#7c3aed22", border: "1px solid #7c3aed44", borderRadius: 8, padding: 10 }}>
          <div style={{ color: "#a855f7", fontSize: 10, fontWeight: 600, marginBottom: 6 }}>💡 Cómo usar</div>
          <div style={{ color: "#888", fontSize: 10, lineHeight: 1.7 }}>
            • Clic en texto → editar<br/>
            • 📷 → agregar imagen<br/>
            • ✕ → eliminar<br/>
            • + → agregar<br/>
            • Cambia fondo y fuente<br/>
            • 💾 Borrador o 🚀 Publicar
          </div>
        </div>
      </aside>
    </div>
  );
}