# 📷 Configuración de Cloudinary para Imágenes

## ¿Qué es Cloudinary?

Cloudinary es un servicio en la nube para gestionar imágenes y videos. Nos permite:
- ✅ Subir imágenes desde el editor de menús
- ✅ Almacenarlas en la nube (no en la base de datos)
- ✅ Optimizarlas automáticamente para web
- ✅ Servirlas rápidamente con CDN

---

## 📋 Pasos para Configurar

### 1. Crear cuenta en Cloudinary

1. Ve a [https://cloudinary.com](https://cloudinary.com)
2. Haz clic en **"Sign Up Free"**
3. Regístrate con tu cuenta de Google o email
4. Es **GRATIS** para siempre (plan Sandbox)

**Límites del plan gratuito:**
- 25 GB de almacenamiento
- 25 GB de ancho de banda mensual
- Suficiente para cientos de menús

---

### 2. Obtener tus credenciales

Una vez registrado:

1. Ve a tu **Dashboard** de Cloudinary
2. Copia tu **Cloud Name** (ej: `ddst0bfot`)
3. Copia tu **API Key** (ej: `222499344888631`)
4. Copia tu **API Secret** (ej: `DaoXpJLTfkbaGJjSOKJNCbsQbt4`)

---

### 3. Crear Upload Preset

El Upload Preset permite subir imágenes sin autenticación:

1. Ve a **Settings** ⚙️ → **Upload**
2. Baja hasta **"Upload presets"**
3. Haz clic en **"Add upload preset"**
4. Configura:
   - **Name:** `menu_preset` (o el que quieras)
   - **Signing Mode:** `Unsigned` ⭐ IMPORTANTE
   - **Folder:** `menu-master` (opcional)
   - **Unique filename:** `true`
5. Haz clic en **"Save"**

---

### 4. Configurar variables de entorno

Edita el archivo `.env.local` en `menu-front/menus-app/.env.local`:

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

**Ejemplo con mis datos:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddst0bfot
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=menu_preset
```

---

### 5. Reiniciar el servidor de desarrollo

```bash
# Detener el servidor (Ctrl + C)
pnpm run dev
```

---

## ✅ Verificar que funciona

1. Abre el editor (`http://localhost:3000/editor`)
2. Selecciona un platillo
3. Haz clic en **"📷 Agregar imagen"**
4. Selecciona una imagen (JPG, PNG, WebP)
5. **Si funciona:**
   - Verás la imagen en el platillo
   - En la consola verás: `✅ Imagen subida: https://res.cloudinary.com/...`
   - La imagen se guarda en Cloudinary, no en la base de datos

---

## 🗑️ Eliminar imágenes (opcional)

Actualmente las imágenes no se eliminan automáticamente. Para hacerlo:

### Opción A: Desde el Dashboard de Cloudinary
1. Ve a [Cloudinary Dashboard](https://cloudinary.com/console)
2. Ve a **Media Library**
3. Busca la imagen
4. Haz clic en los 3 puntos → **Delete**

### Opción B: Implementar en el backend (futuro)
Se puede agregar un endpoint para eliminar imágenes cuando se elimina un platillo.

---

## 📊 URLs de Cloudinary

**URL original:**
```
https://res.cloudinary.com/ddst0bfot/image/upload/v1234567890/menu-master/platillos/abc123.jpg
```

**URL optimizada (automática):**
```
https://res.cloudinary.com/ddst0bfot/image/upload/w_400,h_400,c_fill,f_auto,q_auto/menu-master/platillos/abc123.jpg
```

**Parámetros de transformación:**
- `w_400` - Ancho de 400px
- `h_400` - Alto de 400px
- `c_fill` - Crop para llenar
- `f_auto` - Formato automático (WebP si el navegador lo soporta)
- `q_auto` - Calidad automática

---

## 🐛 Solución de Problemas

### Error: "Cloudinary no está configurado"
**Causa:** Las variables de entorno no están cargadas

**Solución:**
```bash
# Verificar que el archivo .env.local existe
cat menu-front/menus-app/.env.local

# Reiniciar el servidor
pnpm run dev
```

### Error: "Upload preset not found"
**Causa:** El upload preset no existe o está mal escrito

**Solución:**
1. Verifica el nombre en Cloudinary Dashboard → Settings → Upload
2. Asegúrate de que **Signing Mode** sea `Unsigned`
3. Reinicia el servidor

### Error: "File size too large"
**Causa:** La imagen pesa más de 5MB

**Solución:**
- Comprime la imagen antes de subirla
- Usa herramientas como TinyPNG o Squoosh
- El límite se puede cambiar en `editor/page.tsx`

### La imagen no se muestra
**Causa:** URL incorrecta o imagen eliminada

**Solución:**
1. Abre la URL en otra pestaña
2. Si da error 404, la imagen no existe
3. Vuelve a subir la imagen

---

## 💡 Mejores Prácticas

1. **Nombres de archivo:** Cloudinary genera nombres únicos automáticamente
2. **Formatos:** Usa JPG para fotos, PNG para gráficos con transparencia
3. **Tamaño:** Sube imágenes de máximo 2000x2000px para mejor rendimiento
4. **Peso:** Máximo 5MB por imagen (configurable)
5. **Organización:** Usa carpetas como `menu-platillos`, `menu-logos`, etc.

---

## 📚 Recursos

- [Documentación de Cloudinary](https://cloudinary.com/documentation)
- [Transformaciones de imágenes](https://cloudinary.com/documentation/image_transformations)
- [Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [Media Library](https://cloudinary.com/documentation/media_library)

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica las variables de entorno
3. Confirma que el upload preset sea `Unsigned`
4. Prueba subir una imagen pequeña primero (< 1MB)