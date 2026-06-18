# 🚀 Configuración de Frontend en Vercel

## ✅ Tu Proyecto en Vercel

**URL del Proyecto:** https://vercel.com/

**URL de Producción:** https://

---

## 📋 Pasos para Configurar Variables de Entorno

### **Paso 1: Ir a Settings**

1. Ve a tu proyecto en Vercel
2. Click en la pestaña **"Settings"** (arriba)
3. En el menú lateral, click en **"Environment Variables"**

### **Paso 2: Agregar Variables**

Click en **"Add New Variable"** y agrega cada una:

#### **Variable 1: NEXT_PUBLIC_API_URL**
```
Name:  NEXT_PUBLIC_API_URL
Value: http://localhost:4000
Environment: Production ✓
```

⚠️ **IMPORTANTE:** Cuando despliegues tu backend en Railway, cambia este valor por:
```
Value: https://tu-backend-production.up.railway.app
```

#### **Variable 2: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**
```
Name:  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Value: menus-...
Environment: Production ✓
```

#### **Variable 3: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET**
```
Name:  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
Value: menu_p...
Environment: Production ✓
```

#### **Variable 4: JWT_ACCESS_SECRET**
```
Name:  JWT_ACCESS_SECRET
Value: 
Environment: Production ✓
```

### **Paso 3: Guardar y Redeploy**

1. Click en **"Save"** después de agregar cada variable
2. Cuando termines, ve a **"Deployments"** (arriba)
3. Click en **"Redeploy"** en el último deploy
4. Espera a que termine (2-3 minutos)

---

## 🔗 URLs Actuales

### **Frontend (Vercel) ✅**
- **URL:** https://
- **Estado:** Desplegado correctamente
- **Build:** Exitoso (14 páginas estáticas)

### **Backend (Railway) ⏳**
- **URL:** Pendiente de configurar
- **Estado:** Pendiente de deploy

---

## 🧪 Verificar Configuración

### **1. Verificar Variables en Vercel**

Después de agregar las variables, verifica que estén correctas:

1. Ve a **Settings** → **Environment Variables**
2. Deberías ver 4 variables:
   - ✅ NEXT_PUBLIC_API_URL
   - ✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - ✅ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
   - ✅ JWT_ACCESS_SECRET

### **2. Probar el Frontend**

Abre tu navegador y ve a:
```
https://
```

Deberías ver:
- ✅ Landing page
- ✅ Login
- ✅ Registro (si está implementado)

### **3. Verificar Logs**

Si hay errores:
1. Ve a **Deployments**
2. Click en el último deploy
3. Click en **"Logs"** (derecha)
4. Revisa si hay errores

---

## 🔄 Cuando Tengas el Backend en Railway

### **Paso 1: Obtener URL de Railway**

Cuando despliegues tu backend en Railway, obtendrás una URL como:
```
https://menu-back-production.up.railway.app
```

### **Paso 2: Actualizar Variable en Vercel**

1. Ve a Vercel → Tu Proyecto → Settings → Environment Variables
2. Edit **NEXT_PUBLIC_API_URL**
3. Cambia el valor a tu URL de Railway
4. Click en **Save**
5. Haz **Redeploy**

### **Paso 3: Configurar CORS en Railway**

En Railway, agrega esta variable:
```
FRONTEND_URL=https://
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to API"
- Verifica que `NEXT_PUBLIC_API_URL` esté configurada correctamente
- Si estás en local, asegúrate de que el backend esté corriendo en `http://localhost:4000`
- Si estás en producción, verifica que el backend esté desplegado en Railway

### Error: "Cloudinary upload failed"
- Verifica que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` sea `menus...`
- Verifica que el upload preset `menu_preset` exista en Cloudinary
- Verifica que sea `Unsigned`

### Error: "JWT secret not configured"
- Verifica que `JWT_ACCESS_SECRET` esté configurada en Vercel
- Debe coincidir con el backend

### Error: "CORS error"
- Verifica que el backend tenga `FRONTEND_URL` configurado con tu URL de Vercel
- Asegúrate de que no tenga trailing slash `/`

---

## 📊 Resumen de Configuración

### **Variables Requeridas en Vercel:**

| Variable | Valor | Ambiente |
|----------|-------|----------|
| NEXT_PUBLIC_API_URL | http://localhost:4000 (o tu Railway) | Production |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | menus-... | Production |
| NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET | menu_...| Production |
| JWT_ACCESS_SECRET | secret_key_2025_... | Production |

### **Próximos Pasos:**

1. ✅ Agregar variables de entorno en Vercel
2. ⏳ Desplegar backend en Railway
3. ⏳ Actualizar `NEXT_PUBLIC_API_URL` con la URL de Railway
4. ⏳ Configurar CORS en Railway
5. ✅ ¡Listo!

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs en Vercel:** Deployments → Click en el deploy → Logs
2. **Verifica variables:** Settings → Environment Variables
3. **Prueba en local:** `pnpm run dev` para ver si funciona localmente

---

**Última actualización:** 2026-06-18  
**Estado:** ✅ Frontend Configurado  
**URL:** https://