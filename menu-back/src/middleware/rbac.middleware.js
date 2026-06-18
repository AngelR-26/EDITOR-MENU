const { queryOne } = require('../config/database');

/**
 * Middleware para verificar permisos basados en roles (RBAC)
 * Verifica que el rol del usuario tenga permiso para el recurso y acción
 * 
 * Uso: rbacMiddleware('menu', 'read')
 */
function rbacMiddleware(recurso, accion) {
  return async (req, res, next) => {
    try {
      const { rolId } = req.user;
      
      if (!rolId) {
        return res.status(403).json({ 
          ok: false, 
          mensaje: 'Rol de usuario no definido' 
        });
      }
      
      // Verificar permisos del rol
      const sql = `
        SELECT p.id, p.recurso, p.accion 
        FROM permisos p
        JOIN rol_permisos rp ON p.id = rp.permiso_id
        WHERE rp.rol_id = ? AND p.recurso = ? AND p.accion = ?
      `;
      
      const permiso = await queryOne(sql, [rolId, recurso, accion]);
      
      if (!permiso) {
        // Log de auditoría para permiso denegado
        await logAuditoria(req, recurso, accion, false, 'Rol sin permisos');
        
        return res.status(403).json({ 
          ok: false, 
          mensaje: 'No tienes permisos para realizar esta acción' 
        });
      }
      
      // Permiso concedido - continuar
      next();
      
    } catch (error) {
      console.error('Error en RBAC middleware:', error.message);
      return res.status(500).json({ 
        ok: false, 
        mensaje: 'Error interno del servidor' 
      });
    }
  };
}

/**
 * Función auxiliar para log de auditoría
 */
async function logAuditoria(req, recurso, accion, permitido, razon) {
  try {
    const { userId } = req.user || {};
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const sql = `
      INSERT INTO auditoria 
      (user_id, accion, recurso, ip_address, user_agent, permitido, razon_denegacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await queryOne(sql, [
      userId || null,
      accion,
      recurso,
      ip,
      userAgent,
      permitido ? 1 : 0,
      razon || null
    ]);
  } catch (error) {
    console.error('Error al guardar auditoría:', error.message);
  }
}

module.exports = {
  rbacMiddleware,
  logAuditoria
};