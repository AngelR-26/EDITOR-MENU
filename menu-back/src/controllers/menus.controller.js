const { query, queryOne } = require('../config/database');

/**
 * Controlador para obtener todos los menús
 * GET /api/menus
 */
async function getMenus(req, res) {
  try {
    const { user_id } = req.query;
    const { estado } = req.query;
    
    let sql = `
      SELECT id, nombre, estado, data_json, qr_code_url, public_url, 
             created_at, updated_at 
      FROM menus 
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filtrar por user_id si se proporciona
    if (user_id) {
      sql += ` AND user_id = ?`;
      params.push(user_id);
    }
    
    // Filtrar por estado si se proporciona
    if (estado) {
      sql += ` AND estado = ?`;
      params.push(estado);
    }
    
    sql += ` ORDER BY updated_at DESC`;
    
    const menus = await query(sql, params);
    
    res.json({
      ok: true,
      total: menus.length,
      menus
    });
    
  } catch (error) {
    console.error('Error al obtener menús:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al obtener menús' 
    });
  }
}

/**
 * Controlador para obtener un menú específico
 * GET /api/menus/:id
 */
async function getMenuById(req, res) {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT id, nombre, estado, data_json, qr_code_url, public_url, 
             created_at, updated_at 
      FROM menus 
      WHERE id = ?
    `;
    
    const menu = await queryOne(sql, [id]);
    
    if (!menu) {
      return res.status(404).json({ 
        ok: false, 
        mensaje: 'Menú no encontrado' 
      });
    }
    
    res.json({
      ok: true,
      menu
    });
    
  } catch (error) {
    console.error('Error al obtener menú:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al obtener menú' 
    });
  }
}

/**
 * Controlador para crear un nuevo menú
 * POST /api/menus
 */
async function createMenu(req, res) {
  try {
    const { nombre, estado, data_json, user_id, plantilla_id } = req.body;
    
    // Validaciones
    if (!nombre) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'El nombre es obligatorio' 
      });
    }
    
    if (!user_id) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'El user_id es obligatorio' 
      });
    }
    
    const sql = `
      INSERT INTO menus (nombre, estado, data_json, user_id, plantilla_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await queryOne(sql, [
      nombre,
      estado || 'borrador',
      data_json ? data_json : null,
      user_id,
      plantilla_id || null
    ]);
    
    res.status(201).json({
      ok: true,
      mensaje: 'Menú creado correctamente',
      menuId: result.insertId
    });
    
  } catch (error) {
    console.error('Error al crear menú:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al crear menú' 
    });
  }
}

/**
 * Controlador para actualizar un menú
 * PUT /api/menus/:id
 */
async function updateMenu(req, res) {
  try {
    const { id } = req.params;
    const { nombre, estado, data_json } = req.body;
    
    // Verificar que el menú existe
    const menuExistente = await queryOne(
      'SELECT id FROM menus WHERE id = ?',
      [id]
    );
    
    if (!menuExistente) {
      return res.status(404).json({ 
        ok: false, 
        mensaje: 'Menú no encontrado' 
      });
    }
    
    const sql = `
      UPDATE menus 
      SET nombre = ?, estado = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    const result = await queryOne(sql, [
      nombre,
      estado,
      data_json ? data_json : null,
      id
    ]);
    
    res.json({
      ok: true,
      mensaje: 'Menú actualizado correctamente'
    });
    
  } catch (error) {
    console.error('Error al actualizar menú:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al actualizar menú' 
    });
  }
}

/**
 * Controlador para eliminar un menú
 * DELETE /api/menus/:id
 */
async function deleteMenu(req, res) {
  try {
    const { id } = req.params;
    
    // Verificar que el menú existe
    const menuExistente = await queryOne(
      'SELECT id FROM menus WHERE id = ?',
      [id]
    );
    
    if (!menuExistente) {
      return res.status(404).json({ 
        ok: false, 
        mensaje: 'Menú no encontrado' 
      });
    }
    
    const sql = `DELETE FROM menus WHERE id = ?`;
    await queryOne(sql, [id]);
    
    res.json({
      ok: true,
      mensaje: 'Menú eliminado correctamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar menú:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al eliminar menú' 
    });
  }
}

/**
 * Controlador para publicar un menú
 * POST /api/menus/:id/publish
 */
async function publishMenu(req, res) {
  try {
    const { id } = req.params;
    
    // Verificar que el menú existe
    const menuExistente = await queryOne(
      'SELECT id FROM menus WHERE id = ?',
      [id]
    );
    
    if (!menuExistente) {
      return res.status(404).json({ 
        ok: false, 
        mensaje: 'Menú no encontrado' 
      });
    }
    
    // Generar URL pública (en producción, aquí se generaría el QR)
    const publicUrl = `/menu/${id}`;
    const qrCodeUrl = `/qr/${id}.png`;
    
    const sql = `
      UPDATE menus 
      SET estado = 'publicado', 
          public_url = ?, 
          qr_code_url = ?,
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    await queryOne(sql, [publicUrl, qrCodeUrl, id]);
    
    res.json({
      ok: true,
      mensaje: 'Menú publicado correctamente',
      publicUrl,
      qrCodeUrl
    });
    
  } catch (error) {
    console.error('Error al publicar menú:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al publicar menú' 
    });
  }
}

module.exports = {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  publishMenu
};