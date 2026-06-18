const express = require('express');
const router = express.Router();
const menusController = require('../controllers/menus.controller');

// Rutas de menús sin autenticación (para desarrollo)
// GET /api/menus - Obtener todos los menús
router.get('/', menusController.getMenus);

// GET /api/menus/:id - Obtener menú específico
router.get('/:id', menusController.getMenuById);

// POST /api/menus - Crear nuevo menú
router.post('/', menusController.createMenu);

// PUT /api/menus/:id - Actualizar menú
router.put('/:id', menusController.updateMenu);

// DELETE /api/menus/:id - Eliminar menú
router.delete('/:id', menusController.deleteMenu);

// POST /api/menus/:id/publish - Publicar menú
router.post('/:id/publish', menusController.publishMenu);

module.exports = router;