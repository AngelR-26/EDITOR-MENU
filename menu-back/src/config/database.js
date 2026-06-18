const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'menumaster',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Verificar conexión al iniciar
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a MySQL correctamente');
    console.log(`🗄️  DB_HOST: ${process.env.DB_HOST}`);
    console.log(`🗄️  DB_NAME: ${process.env.DB_NAME}`);
    console.log(`🗄️  DB_PORT: ${process.env.DB_PORT}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    console.log('⚠️  El servidor iniciará pero las consultas fallarán');
    return false;
  }
}

// Función para ejecutar consultas parametrizadas
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error en consulta SQL:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// Función para obtener una sola fila
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return Array.isArray(results) ? results[0] : results;
}

module.exports = {
  pool,
  testConnection,
  query,
  queryOne
};