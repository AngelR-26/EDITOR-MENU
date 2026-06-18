# 🚀 Guía de Deploy en Railway

## ✅ Backend Configurado para Railway

El backend está configurado y listo para desplegar en Railway.

---

## 📋 Pasos para Deploy

### **Paso 1: Instalar Railway CLI (Opcional)**

```bash
# Windows PowerShell
npm install -g @railway/cli

# Iniciar sesión
railway login
```

### **Paso 2: Crear Proyecto en Railway**

1. Ve a [railway.app](https://railway.app)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Busca tu repositorio: `editor-menu-angel`
5. Selecciona la carpeta: `menu-back`

### **Paso 3: Agregar MySQL Database**

1. En tu proyecto de Railway, click en **"New"**
2. Selecciona **"Database"** → **"MySQL"**
3. Railway creará automáticamente las variables de entorno:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### **Paso 4: Configurar Variables de Entorno**

En Railway, ve a tu servicio → **Variables** → **Add Variable**

Agrega las siguientes variables:

```env
# Server
PORT=
NODE_ENV=production

# JWT (IMPORTANTE: Usa los mismos valores que en Vercel)
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=900
JWT_REFRESH_EXPIRY=604800

# CORS (IMPORTANTE: Pon tu URL de Vercel)
FRONTEND_URL=https://

# Cloudinary (Opcional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=
RATE_LIMIT_MAX_REQUESTS=
```

### **Paso 5: Configurar Root Directory**

1. Ve a **Settings** de tu servicio en Railway
2. En **"Root Directory"**, pon: `menu-back`
3. Railway detectará automáticamente el `package.json`

### **Paso 6: Deploy**

1. Railway automáticamente hará build y deploy
2. Espera a que termine (aproximadamente 2-3 minutos)
3. Cuando termine, verás una URL como: `https://menu-back-production.up.railway.app`

### **Paso 7: Ejecutar Migraciones**

Una vez desplegado, necesitas ejecutar el script SQL para crear las tablas:

**Opción A: Desde Railway UI**
1. Ve a tu MySQL database en Railway
2. Click en **"Open MySQL"**
3. Copia y pega el contenido de `database/schema.sql`

**Opción B: Desde tu computadora**
```bash
# Conéctate a tu MySQL de Railway
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE>

# Ejecuta el schema
source menu-back/database/schema.sql
```

**Opción C: Crear endpoint de inicialización**
Puedes crear un endpoint temporal que ejecute el schema automáticamente.

---

## 🔧 Configuración de CORS

### **En Railway (Backend):**

El archivo `menu-back/src/index.js` ya está configurado para aceptar CORS:

```javascript
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**IMPORTANTE:** Asegúrate de que `FRONTEND_URL` en Railway sea exactamente tu URL de Vercel.

### **En Vercel (Frontend):**

Asegúrate de tener configurado:
```env
NEXT_PUBLIC_API_URL=https://tu-backend-production.up.railway.app
```

---

## 📊 URLs de Producción

Una vez desplegado:

- **Backend (Railway):** `https://menu-back-production.up.railway.app`
- **Frontend (Vercel):** `https://projects.vercel.app`
- **Database (Railway MySQL):** Interno (no accesible públicamente)

---

## 🧪 Verificar Deploy

### **1. Health Check**
```bash
curl https://tu-backend-production.up.railway.app/
```

Deberías ver:
```json
{
  "ok": true,
  "mensaje": "✅ Menu Master API funcionando",
  "version": "2.0.0",
  "timestamp": "..."
}
```

### **2. Health Check API**
```bash
curl https://tu-backend-production.up.railway.app/api/health
```

### **3. Probar Login**
```bash
curl -X POST https://tu-backend-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"":"","":""}'
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que MySQL esté agregado al proyecto
- Verifica que las variables `MYSQL*` estén configuradas
- Revisa los logs en Railway: **Deployments** → Click en el deploy → **Logs**

### Error: "CORS error" desde el frontend
- Verifica que `FRONTEND_URL` en Railway sea exactamente tu URL de Vercel
- Asegúrate de que no tenga trailing slash (`/` al final)
- Verifica que el frontend esté usando `NEXT_PUBLIC_API_URL` correcto

### Error: "JWT secret not configured"
- Verifica que `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` estén configurados
- Deben coincidir con los del frontend (si usas JWT)

### Error: "Port already in use"
- Railway asigna el puerto automáticamente
- Usa `process.env.PORT` en lugar de un puerto fijo
- El archivo `index.js` ya está configurado correctamente

---

## 🔄 Actualizaciones Futuras

Para actualizar el backend:

1. Haz push a tu rama `main` en GitHub
2. Railway detectará los cambios automáticamente
3. Espera a que termine el deploy (2-3 minutos)
4. ¡Listo! Los cambios estarán en producción

---

## 📝 Checklist Pre-Deploy

Antes de deployar, verifica:

- [ ] Tienes cuenta en Railway (puedes usar tu cuenta de GitHub)
- [ ] Has agregado MySQL database a tu proyecto
- [ ] Has configurado todas las variables de entorno
- [ ] Has configurado el Root Directory como `menu-back`
- [ ] Has ejecutado el schema.sql en la base de datos
- [ ] Has configurado `FRONTEND_URL` con tu URL de Vercel
- [ ] Has verificado que el health check funcione

---

## 💡 Tips de Producción

### **Logs en Tiempo Real**
```bash
railway logs --follow
```

### **Ver Variables de Entorno**
```bash
railway variables
```

### **Reiniciar Servicio**
```bash
railway restart
```

### **Ver Información del Proyecto**
```bash
railway status
```

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs en Railway:** 
   - Ve a tu proyecto → **Deployments** → Click en el último → **Logs**
   
2. **Verifica variables de entorno:**
   - Ve a tu servicio → **Variables**
   
3. **Prueba endpoints manualmente:**
   - Usa curl o Postman para probar los endpoints directamente
   
4. **Verifica la base de datos:**
   - Ve a tu MySQL en Railway → **Open MySQL**
   - Ejecuta: `SHOW TABLES;` para verificar que las tablas existan

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Railway MySQL Docs](https://docs.railway.app/databases/mysql)
- [Railway CLI](https://docs.railway.app/cli)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Última actualización:** 2026-06-18  
**Estado:** ✅ Listo para Deploy  
**Backend:** `menu-back`  
**Base de Datos:** MySQL (Railway)