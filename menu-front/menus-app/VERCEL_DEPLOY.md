# 🚀 Guía de Deploy en Vercel

## ✅ Build Exitoso

El build se completó correctamente. Los errores fueron corregidos:
- ✅ `useSearchParams()` ahora está envuelto en `Suspense boundary`
- ✅ Eliminados archivos innecesarios
- ✅ TypeScript compiló sin errores críticos

---

## 📋 Pasos para Deploy en Vercel

### **1. Configurar Variables de Entorno en Vercel**

Antes de deployar, necesitas configurar las siguientes variables en Vercel:

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**

Agrega estas variables:

```env
# API Configuration (IMPORTANTE: Cambia por tu URL de Railway)
NEXT_PUBLIC_API_URL=https://tu-api-production.up.railway.app

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=menus-app
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=menu_preset

# JWT Secret
JWT_ACCESS_SECRET=menumaster_access_secret_key_2025_very_secure_32chars
```

### **2. Configuración del Proyecto**

**Root Directory:** `menu-front/menus-app`

⚠️ **IMPORTANTE:** Cuando crees el proyecto en Vercel:
1. Selecciona tu repositorio de GitHub
2. En **"Framework Preset"** selecciona: **Next.js**
3. En **"Root Directory"** haz clic en "Edit" y pon: `menu-front/menus-app`
4. En **"Build Command"** deja: `pnpm run build`
5. En **"Output Directory"** deja: `.next`

### **3. Deploy**

1. Haz clic en **"Deploy"**
2. Espera a que termine el build (aproximadamente 2-3 minutos)
3. Cuando termine, verás una URL como: `https://tu-app.vercel.app`

---

## 🔧 Configuración Adicional

### **CORS en Railway (Backend)**

Para que el frontend en Vercel pueda comunicarse con el backend en Railway:

1. Ve a tu proyecto en Railway
2. Agrega la variable de entorno:
   ```
   FRONTEND_URL=https://tu-app.vercel.app
   ```
3. Reinicia el servicio

### **Cloudinary Upload Preset**

Verifica que tu upload preset permita uploads desde tu dominio de Vercel:

1. Ve a [Cloudinary Dashboard](https://cloudinary.com/console)
2. Settings ⚙️ → Upload
3. Busca tu preset `menu_preset`
4. En "Allowed fetch domains", agrega: `tu-app.vercel.app`

---

## 🐛 Solución de Problemas

### Error: "useSearchParams should be wrapped in Suspense"
✅ **Ya corregido** - El archivo `/login/page.tsx` ya tiene el Suspense boundary.

### Error: "CORS error" o "Network Error"
- Verifica que `NEXT_PUBLIC_API_URL` apunte a tu backend en Railway
- Verifica que Railway tenga `FRONTEND_URL` configurado con tu URL de Vercel
- Asegúrate de que ambos usen HTTPS

### Error: "Cloudinary upload failed"
- Verifica que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` sea correcto
- Verifica que el upload preset exista y sea `Unsigned`
- Verifica que el dominio de Vercel esté permitido en Cloudinary

### Error: "404 en /login" o rutas no encontradas
- Verifica que el Root Directory en Vercel sea `menu-front/menus-app`
- Revisa que el build se completó exitosamente

---

## 📊 URLs de Producción

Una vez desplegado:

- **Frontend (Vercel):** `https://tu-app.vercel.app`
- **Backend (Railway):** `https://tu-api-production.up.railway.app`
- **Cloudinary:** `https://res.cloudinary.com/menus-app/image/upload/...`

---

## 🔄 Actualizaciones Futuras

Para actualizar el deploy:

1. Haz push a tu rama `main` en GitHub
2. Vercel detectará los cambios automáticamente
3. Espera a que termine el deploy automático (2-3 minutos)
4. ¡Listo! Los cambios estarán en producción

---

## 📝 Checklist Pre-Deploy

Antes de deployar, verifica:

- [ ] Tienes una cuenta en Railway y el backend está desplegado
- [ ] Tienes la URL del backend de Railway
- [ ] Tienes cuenta en Cloudinary con upload preset configurado
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] El Root Directory está configurado como `menu-front/menus-app`
- [ ] CORS está configurado en Railway para aceptar tu dominio de Vercel

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel: **Deployments** → Click en el deploy → **Logs**
2. Revisa la consola del navegador (F12) para errores del frontend
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de que el backend en Railway esté corriendo y accesible

---

## ✨ Características del Build

- ✅ Next.js 16.2.6 con Turbopack
- ✅ TypeScript sin errores
- ✅ 14 páginas estáticas generadas
- ✅ Middleware configurado (proxy)
- ✅ Optimizaciones de producción habilitadas

---

**Última actualización:** 2026-06-18
**Estado:** ✅ Build Exitoso