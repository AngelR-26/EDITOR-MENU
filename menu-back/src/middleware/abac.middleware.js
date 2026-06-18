const { queryOne } = require('../config/database');
const { logAuditoria } = require('./rbac.middleware');

/**
 * Middleware para control de acceso basado en atributos (ABAC)
 * Evalúa políticas de acceso almacenadas en la base de datos
 * 
 * Uso: abacMiddleware({ tipo: 'owner', recurso: 'menu' })
 */
function abacMiddleware(config) {
  return async (req, res, next) => {
    try {
      const { userId, plan, rolId } = req.user;
      const { tipo, recurso } = config;
      
      // Determinar el ID del recurso a verificar
      let resourceId;
      if (tipo === 'owner') {
        // Para operaciones de owner, obtener el ID del recurso
        resourceId = req.params.id || req.body.id;
        
        if (!resourceId) {
          // Si no hay ID, es una creación (no requiere ownership)
          return next();
        }
      }
      
      // Cargar políticas activas para este recurso y acción
      const accion = req.method === 'GET' ? 'read' :
                     req.method === 'POST' ? 'create' :
                     req.method === 'PUT' || req.method === 'PATCH' ? 'update' :
                     req.method === 'DELETE' ? 'delete' : 'read';
      
      const sql = `
        SELECT id, nombre, condiciones, prioridad 
        FROM politicas_acceso 
        WHERE recurso = ? AND accion = ? AND activa = TRUE 
        ORDER BY prioridad DESC
      `;
      
      const politicas = await queryOne(sql, [recurso, accion]) || [];
      const politicasArray = Array.isArray(politicas) ? politicas : [politicas];
      
      // Evaluar cada política
      for (const politica of politicasArray) {
        const condiciones = JSON.parse(politica.condiciones);
        
        // Verificar ownership
        if (condiciones.owner) {
          const ownerSql = `SELECT user_id FROM menus WHERE id = ?`;
          const recursoData = await queryOne(ownerSql, [resourceId]);
          
          if (!recursoData) {
            await logAuditoria(req, recurso, accion, false, 'Recurso no encontrado');
            return res.status(404).json({ 
              ok: false, 
              mensaje: 'Recurso no encontrado' 
            });
          }
          
          if (recursoData.user_id !== userId) {
            await logAuditoria(req, recurso, accion, false, 'No es el propietario del recurso');
            return res.status(403).json({ 
              ok: false, 
              mensaje: 'No tienes permisos sobre este recurso' 
            });
          }
        }
        
        // Verificar plan mínimo
        if (condiciones.plan_minimo) {
          const planOrder = { basico: 1, pro: 2, premium: 3 };
          const planMinimo = planOrder[condiciones.plan_minimo];
          const planUsuario = planOrder[plan];
          
          if (planUsuario < planMinimo) {
            await logAuditoria(req, recurso, accion, false, 'Plan insuficiente');
            return res.status(403).json({ 
              ok: false, 
              mensaje: 'Tu plan actual no permite esta acción' 
            });
          }
        }
        
        // Verificar límite de menús
        if (condiciones.max_menus) {
          const countSql = `SELECT COUNT(*) as total FROM menus WHERE user_id = ?`;
          const countResult = await queryOne(countSql, [userId]);
          
          if (countResult.total >= condiciones.max_menus) {
            await logAuditoria(req, recurso, accion, false, 'Límite de menús alcanzado');
            return res.status(403).json({ 
              ok: false, 
              mensaje: `Has alcanzado el límite de ${condiciones.max_menus} menús` 
            });
          }
        }
        
        // Verificar roles permitidos
        if (condiciones.roles_permitidos) {
          const rolSql = `SELECT nombre FROM roles WHERE id = ?`;
          const rolData = await queryOne(rolSql, [rolId]);
          
          if (!condiciones.roles_permitidos.includes(rolData.nombre)) {
            await logAuditoria(req, recurso, accion, false, 'Rol no permitido');
            return res.status(403).json({ 
              ok: false, 
              mensaje: 'Tu rol no tiene permiso para esta acción' 
            });
          }
        }
      }
      
      // Todas las políticas evaluadas correctamente
      next();
      
    } catch (error) {
      console.error('Error en ABAC middleware:', error.message);
      return res.status(500).json({ 
        ok: false, 
        mensaje: 'Error interno del servidor' 
      });
    }
  };
}

module.exports = {
  abacMiddleware
};