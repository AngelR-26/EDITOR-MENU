# Guía de Uso del Editor de Menús

## 📝 Cómo Funciona el Guardado

### Crear un Menú Nuevo

1. **Ve al Editor** desde el sidebar
2. **Personaliza tu menú**:
   - Cambia textos (nombre, subtítulo, platillos)
   - Modifica colores
   - Agrega imágenes
   - Cambia fuentes y fondos
3. **Haz clic en "💾 Borrador"** para guardar los cambios
4. El menú se crea en la base de datos con estado `borrador`

### Editar un Menú Existente

1. **Ve a "Mis Menús"** en el sidebar
2. **Haz clic en "✏️ Editar"** en el menú que quieras modificar
3. **Realiza los cambios** que desees
4. **Haz clic en "💾 Borrador"** para guardar los cambios
5. Los cambios se **actualizan** en la base de datos

### Publicar un Menú

1. **En el editor**, después de hacer cambios
2. **Haz clic en "🚀 Publicar"**
3. El menú cambia a estado `publicado`
4. Serás redirigido a "Mis Menús"

## 🔄 Flujo de Guardado

```
CREAR → Usuario en el editor
        ↓
        Modifica textos, colores, imágenes
        ↓
        Clic en "Borrador"
        ↓
        POST /api/menus (crea menú nuevo)
        ↓
        Backend devuelve menuId
        ↓
        Frontend guarda menuId
        ↓
        ✅ Menú guardado como borrador

EDITAR → Usuario en "Mis Menús"
        ↓
        Clic en "Editar"
        ↓
        Editor carga menú con GET /api/menus/:id
        ↓
        Usuario modifica contenido
        ↓
        Clic en "Borrador"
        ↓
        PUT /api/menus/:id (actualiza menú)
        ↓
        ✅ Cambios guardados
```

## 💾 Datos que se Guardan

El menú se guarda en la columna `data_json` con esta estructura:

```json
{
  "secciones": [
    {
      "id": 1,
      "nombre": "ENTRADAS",
      "platillos": [
        {
          "nombre": "Bruschetta",
          "precio": "$85",
          "descripcion": "Pan tostado con tomate",
          "imagen": "data:image/...",
          "colorTexto": "#000000"
        }
      ]
    }
  ],
  "fuenteActiva": "Playfair Display",
  "fondoActivo": { "nombre": "Clásico", "bg": "...", "texto": "...", "acento": "..." },
  "tamaño": 48,
  "subtitulo": "RESTAURANTE",
  "colorTitulo": "#ffffff",
  "colorSubtitulo": "#a855f7",
  "fuenteTitulo": "Playfair Display"
}
```

## 🎨 Elementos que se Pueden Editar

### Textos
- ✅ Nombre del menú
- ✅ Subtítulo
- ✅ Nombre de secciones
- ✅ Nombre de platillos
- ✅ Precios
- ✅ Descripciones

### Estilos
- ✅ Fuente del menú completo
- ✅ Fuente del título (opcional)
- ✅ Color del título
- ✅ Color del subtítulo
- ✅ Color de texto de cada platillo
- ✅ Fondo del menú

### Imágenes
- ✅ Agregar imágenes a cada platillo
- ✅ Mover imágenes (drag & drop)
- ✅ Eliminar imágenes
- ✅ Mostrar/ocultar imágenes

### Estructura
- ✅ Agregar secciones
- ✅ Eliminar secciones
- ✅ Agregar platillos
- ✅ Eliminar platillos
- ✅ Orientación (vertical/horizontal)

## 🚨 Problemas Comunes

### "Los cambios no se guardan"

**Causa**: No se está haciendo clic en "Borrador" después de editar.

**Solución**: Después de hacer cambios, siempre haz clic en "💾 Borrador" o "🚀 Publicar".

### "El menú se crea pero no se actualiza"

**Causa**: El frontend no está guardando el `menuId` después de crear el menú.

**Solución**: El código actualizado ya guarda el `menuId` automáticamente después del primer guardado.

### "Error de autenticación al guardar"

**Causa**: El token de autenticación expiró.

**Solución**: 
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Intenta guardar nuevamente

### "No puedo editar un menú existente"

**Causa**: El menú no se está cargando correctamente en el editor.

**Solución**: 
1. Ve a "Mis Menús"
2. Asegúrate de que el menú tenga estado "borrador" o "publicado"
3. Haz clic en "✏️ Editar"
4. El editor debería cargar con los datos del menú

## 🔧 Comandos Útiles

### Ver menús en la base de datos

```sql
-- Ver todos los menús
SELECT id, nombre, estado, user_id, created_at 
FROM menus 
ORDER BY created_at DESC;

-- Ver el contenido de un menú específico
SELECT id, nombre, estado, data_json 
FROM menus 
WHERE id = 1;

-- Ver menús de un usuario específico
SELECT id, nombre, estado, created_at 
FROM menus 
WHERE user_id = 1;
```

### Limpiar menús de prueba

```sql
-- Eliminar todos los menús de un usuario
DELETE FROM menus WHERE user_id = 1;
```

## 📊 Estados del Menú

- **Borrador**: El menú está en construcción, no es visible públicamente
- **Publicado**: El menú está listo y es visible públicamente

## 🎯 Próximas Funcionalidades

- [ ] Vista previa de menú publicado
- [ ] Generación de QR automático
- [ ] Compartir menú con URL pública
- [ ] Duplicar menú existente
- [ ] Exportar a PDF con un clic
- [ ] Plantillas predefinidas
- [ ] Historial de versiones