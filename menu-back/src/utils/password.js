const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Genera hash de una contraseña
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Contraseña hasheada
 */
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error al hashear contraseña:', error.message);
    throw error;
  }
}

/**
 * Compara una contraseña con un hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado en la base de datos
 * @returns {Promise<boolean>} - true si coinciden, false si no
 */
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    console.error('Error al comparar contraseña:', error.message);
    return false;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  SALT_ROUNDS
};