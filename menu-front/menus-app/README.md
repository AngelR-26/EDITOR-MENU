# Menu Master - Frontend

Frontend de la aplicación Menu Master construido con Next.js 16, TypeScript y Tailwind CSS.

## 🚀 Requisitos Previos

1. **Node.js 18+** instalado
2. **pnpm** instalado (`npm install -g pnpm`)
3. **Backend corriendo** en `http://localhost:4000`

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install
```

## ⚙️ Configuración

### 1. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del frontend:

```env
# API del Backend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Cloudinary (opcional - para imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# JWT Secret (debe coincidir con el backend)
JWT_ACCESS_SECRET=menumaster_access_secret_key_2025_very_secure_32chars
```

## 🔥 Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm run dev
```

El frontend correrá en `http://localhost:3000`

## 🚀 Producción

```bash
# Construir para producción
pnpm run build

# Iniciar servidor de producción
pnpm start
```

## 📁 Estructura del Proyecto

```
menu-front/menus-app/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Rutas públicas
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Login
│   │   │   └── registro/
│   │   │       └── page.tsx           # Registro
│   │   │
│   │   ├── (dashboard)/               # Rutas protegidas
│   │   │   ├── layout.tsx             # Layout con sidebar
│   │   │   ├── page.tsx               # Dashboard principal
│   │   │   ├── mis-menus/
│   │   │   ├── editor/
│   │   │   ├── plantillas/
│   │   │   ├── analiticas/
│   │   │   ├── mi-negocio/
│   │   │   ├── planes/
│   │   │   └── configuracion/
│   │   │
│   │   ├── landing/
│   │   │   └── page.tsx               # Landing page pública
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css
│   │
│   ├── services/
│   │   ├── http.service.ts            # HTTP con interceptor de tokens
│   │   ├── auth.service.ts            # Servicio de autenticación
│   │   └── menus.service.ts           # Servicio de menús
│   │
│   ├── hooks/
│   │   └── useAuth.ts                 # Hook de autenticación
│   │
│   ├── middleware.ts                  # Edge Function para auth
│   └── components/
│       └── ui/
│           └── Sidebar.tsx            # Sidebar reutilizable
│
├── .env.local                         # Variables de entorno
├── .env.example                       # Template
├── vercel.json                        # Config para Vercel
└── package.json
```

## 🔐 Autenticación

El frontend usa JWT con access tokens y refresh tokens:

1. **Access Token**: Dura 15 minutos, se guarda en cookies
2. **Refresh Token**: Dura 7 días, se guarda en cookie httpOnly

### Flujo de Autenticación

```
Login → Backend genera access + refresh token
      → Access token en cookie (15 min)
      → Refresh token en cookie httpOnly (7 días)

Peticiones API → Access token en header Authorization

Token expirado → Frontend llama a /api/auth/refresh
               → Backend genera nuevo access token
               → Frontend reintenta petición

Logout → Backend invalida tokens (incrementa token_version)
       → Frontend elimina cookies
       → Redirige a /login
```

## 🛡️ Seguridad

- ✅ **Middleware en Edge**: Verifica JWT antes de renderizar
- ✅ **Cookies httpOnly**: Para refresh tokens
- ✅ **HTTPS obligatorio**: En producción
- ✅ **CORS configurado**: Solo acepta desde el frontend
- ✅ **Rate limiting**: En el backend

## 📡 Servicios Disponibles

### `authService`

```typescript
import { authService } from '@/services/auth.service';

// Login
await authService.login(email, password);

// Registro
await authService.registro(nombre, email, password, negocio);

// Obtener usuario actual
const { usuario } = await authService.getMe();

// Logout
await authService.logout();

// Cambiar contraseña
await authService.changePassword(passwordActual, passwordNuevo);
```

### `menusService`

```typescript
import { menusService } from '@/services/menus.service';

// Obtener todos los menús
const { menus } = await menusService.getAll();

// Obtener menú por ID
const { menu } = await menusService.getById(id);

// Crear menú
const { menuId } = await menusService.create({ nombre, estado, data_json });

// Actualizar menú
await menusService.update(id, { nombre, estado, data_json });

// Eliminar menú
await menusService.delete(id);

// Publicar menú
const { publicUrl, qrCodeUrl } = await menusService.publish(id);
```

### `useAuth` Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

function MiComponente() {
  const { usuario, loading, isAuthenticated, login, logout } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <div>No autorizado</div>;

  return <div>Hola {usuario?.nombre}</div>;
}
```

## 🎨 Estilos

El proyecto usa **inline styles** con una paleta de colores consistente:

```javascript
// Colores principales
const colors = {
  background: '#0f0f13',
  surface: '#16161d',
  surfaceLight: '#1e1e28',
  border: '#2a2a35',
  primary: '#7c3aed',
  secondary: '#a855f7',
  text: '#ffffff',
  textSecondary: '#888888',
  textMuted: '#666666',
};
```

## 🚨 Solución de Problemas

### Error de autenticación

1. Verifica que el backend esté corriendo
2. Verifica que `NEXT_PUBLIC_API_URL` sea correcta
3. Limpia las cookies del navegador

### Error de CORS

1. Verifica que `FRONTEND_URL` en el backend sea `http://localhost:3000`
2. Verifica que el backend tenga CORS habilitado

### Middleware no redirige a login

1. Verifica que `JWT_ACCESS_SECRET` coincida con el backend
2. Limpia las cookies y vuelve a iniciar sesión

## 📝 Notas

- El middleware verifica JWT en el edge (sin llamar al backend)
- Las páginas del dashboard usan el layout `(dashboard)/layout.tsx`
- Las páginas públicas (login, registro, landing) NO tienen sidebar
- El refresh de token es automático cuando expira el access token