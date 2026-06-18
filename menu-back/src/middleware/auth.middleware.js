const { verifyAccessToken, verifyRefreshToken } = require('../services/jwt.service');
const { queryOne } = require('../config/database');

/**
 * Middleware para verificar access token
 * Extrae el token del header Authorization y lo valida
 */
async function authMiddleware(req, res, next) {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'No autorizado - Token no proporcionado' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Token inválido o expirado' 
      });
    }
    
    // Verificar que el usuario existe y está activo
    const user = await queryOne(
      'SELECT id, activo, token_version FROM usuarios WHERE id = ?',
      [decoded.userId]
    );
    
    if (!user) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Usuario no encontrado' 
      });
    }
    
    if (!user.activo) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Usuario inactivo' 
      });
    }
    
    // Verificar token_version (para logout forzado)
    if (user.token_version !== decoded.tokenVersion) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Sesión expirada - Inicie sesión nuevamente' 
      });
    }
    
    // Agregar datos del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      plan: decoded.plan,
      rolId: decoded.rolId
    };
    
    next();
    
  } catch (error) {
    console.error('Error en auth middleware:', error.message);
    return res.status(500).json({ 
      ok: false, 
      mensaje: 'Error interno del servidor' 
    });
  }
}

/**
 * Middleware para verificar refresh token (desde cookie)
 */
async function refreshTokenMiddleware(req, res, next) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Refresh token no proporcionado' 
      });
    }
    
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Refresh token inválido o expirado' 
      });
    }
    
    // Verificar que el usuario existe
    const user = await queryOne(
      'SELECT id, activo, token_version FROM usuarios WHERE id = ?',
      [decoded.userId]
    );
    
    if (!user) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Usuario no encontrado' 
      });
    }
    
    if (!user.activo) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Usuario inactivo' 
      });
    }
    
    // Verificar token_version
    if (user.token_version !== decoded.tokenVersion) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Sesión expirada - Inicie sesión nuevamente' 
      });
    }
    
    // Agregar datos al request
    req.user = {
      userId: decoded.userId,
      tokenVersion: decoded.tokenVersion
    };
    
    next();
    
  } catch (error) {
    console.error('Error en refresh token middleware:', error.message);
    return res.status(500).json({ 
      ok: false, 
      mensaje: 'Error interno del servidor' 
    });
  }
}

module.exports = {
  authMiddleware,
  refreshTokenMiddleware
};