const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para login (previene brute force)
 * 10 intentos por 15 minutos por IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos
  message: { 
    ok: false, 
    mensaje: 'Demasiados intentos de login, intenta en 15 minutos' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

/**
 * Rate limiter general para API
 * 100 requests por minuto por IP
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // 100 requests
  message: { 
    ok: false, 
    mensaje: 'Demasiadas peticiones, intenta más tarde' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

/**
 * Rate limiter estricto para registro
 * 5 registros por hora por IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 registros
  message: { 
    ok: false, 
    mensaje: 'Demasiados registros, intenta en una hora' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});

module.exports = {
  loginLimiter,
  apiLimiter,
  registerLimiter
};