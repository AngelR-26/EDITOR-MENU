const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const menusRoutes = require('./routes/menus.routes');
const { apiLimiter } = require('./middleware/rateLimit.middleware');

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================
// MIDDLEWARES
// ============================================

// CORS configurado para el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON
app.use(express.json());

// Parsear cookies
app.use(cookieParser());

// Rate limiting general para toda la API
app.use('/api', apiLimiter);

// ============================================
// RUTAS
// ============================================

// Ruta de health check
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: '✅ Menu Master API funcionando',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta de health check para Railway
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de menús (protegidas)
app.use('/api/menus', menusRoutes);

// Rutas de imágenes (pendiente de implementar)
// app.use('/api/images', imagesRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Error 404
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Error handler general
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

async function startServer() {
  // Verificar conexión a la base de datos
  await testConnection();
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log('');
    console.log('============================================');
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log('============================================');
    console.log('');
    console.log('Endpoints disponibles:');
    console.log('  GET  /                    - Health check');
    console.log('  GET  /api/health          - Health check (Railway)');
    console.log('  POST /api/auth/register   - Registro');
    console.log('  POST /api/auth/login      - Login');
    console.log('  POST /api/auth/refresh    - Refresh token');
    console.log('  POST /api/auth/logout     - Logout');
    console.log('  GET  /api/auth/me         - Usuario actual');
    console.log('  GET  /api/menus           - Listar menús');
    console.log('  POST /api/menus           - Crear menú');
    console.log('  PUT  /api/menus/:id       - Actualizar menú');
    console.log('  DELETE /api/menus/:id     - Eliminar menú');
    console.log('');
  });
}

// Iniciar servidor
startServer().catch(err => {
  console.error('Error al iniciar el servidor:', err.message);
  process.exit(1);
});