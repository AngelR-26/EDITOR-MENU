const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

/**
 * Genera un access token para un usuario
 * @param {Object} user - Objeto de usuario con id, email, plan, rol_id
 * @returns {string} Access token firmado
 */
function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    plan: user.plan,
    rolId: user.rol_id
  };
  
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRATION
  });
}

/**
 * Genera un refresh token para un usuario
 * @param {Object} user - Objeto de usuario con id y token_version
 * @returns {string} Refresh token firmado
 */
function generateRefreshToken(user) {
  const payload = {
    userId: user.id,
    tokenVersion: user.token_version || 0
  };
  
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRATION
  });
}

/**
 * Verifica y decodifica un access token
 * @param {string} token - Access token a verificar
 * @returns {Object|null} Payload del token o null si es inválido
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error al verificar access token:', error.message);
    return null;
  }
}

/**
 * Verifica y decodifica un refresh token
 * @param {string} token - Refresh token a verificar
 * @returns {Object|null} Payload del token o null si es inválido
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error al verificar refresh token:', error.message);
    return null;
  }
}

/**
 * Decodifica un token sin verificar (para obtener información básica)
 * @param {string} token - Token a decodificar
 * @returns {Object|null} Payload decodificado o null
 */
function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Error al decodificar token:', error.message);
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_EXPIRATION,
  REFRESH_EXPIRATION
};