const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken } = require('./jwt.service');
const { queryOne } = require('../config/database');

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} - Usuario creado sin password
 */
async function registerUser(userData) {
  const { nombre, email, password, negocio } = userData;
  
  // Hashear contraseña
  const passwordHash = await hashPassword(password);
  
  // Insertar usuario (rol_id=2 por defecto = editor)
  const sql = `
    INSERT INTO usuarios (nombre, email, password_hash, negocio, plan, rol_id, activo) 
    VALUES (?, ?, ?, ?, 'basico', 2, TRUE)
  `;
  
  const result = await queryOne(sql, [nombre, email, passwordHash, negocio || '']);
  
  return {
    id: result.insertId,
    nombre,
    email,
    negocio: negocio || ''
  };
}

/**
 * Autentica un usuario y genera tokens
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<Object>} - Usuario, access token y refresh token
 */
async function loginUser(email, password) {
  // Buscar usuario por email
  const sql = `
    SELECT id, nombre, email, password_hash, negocio, plan, rol_id, token_version, activo 
    FROM usuarios 
    WHERE email = ?
  `;
  
  const user = await queryOne(sql, [email]);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Verificar si está activo
  if (!user.activo) {
    throw new Error('Usuario inactivo');
  }
  
  // Verificar contraseña
  const passwordMatch = await comparePassword(password, user.password_hash);
  
  if (!passwordMatch) {
    throw new Error('Contraseña incorrecta');
  }
  
  // Generar tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Retornar datos sin password_hash
  const { password_hash, ...userWithoutPassword } = user;
  
  return {
    usuario: userWithoutPassword,
    accessToken,
    refreshToken
  };
}

/**
 * Obtiene un usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Promise<Object|null>} - Usuario o null
 */
async function getUserById(id) {
  const sql = `
    SELECT id, nombre, email, negocio, plan, rol_id, activo, created_at, updated_at 
    FROM usuarios 
    WHERE id = ?
  `;
  
  const user = await queryOne(sql, [id]);
  return user || null;
}

/**
 * Actualiza el token_version de un usuario (para logout forzado)
 * @param {number} userId - ID del usuario
 * @returns {Promise<boolean>} - true si se actualizó
 */
async function incrementTokenVersion(userId) {
  const sql = `
    UPDATE usuarios 
    SET token_version = token_version + 1 
    WHERE id = ?
  `;
  
  const result = await queryOne(sql, [userId]);
  return result.affectedRows > 0;
}

/**
 * Actualiza la contraseña de un usuario
 * @param {number} userId - ID del usuario
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<boolean>} - true si se actualizó
 */
async function updatePassword(userId, newPassword) {
  const passwordHash = await hashPassword(newPassword);
  
  const sql = `
    UPDATE usuarios 
    SET password_hash = ?, token_version = token_version + 1 
    WHERE id = ?
  `;
  
  const result = await queryOne(sql, [passwordHash, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  incrementTokenVersion,
  updatePassword
};