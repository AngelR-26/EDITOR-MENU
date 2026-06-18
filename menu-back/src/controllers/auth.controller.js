const authService = require('../services/auth.service');
const { generateAccessToken, generateRefreshToken } = require('../services/jwt.service');

/**
 * Controlador para registro de usuarios
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { nombre, email, password, negocio } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Nombre, email y contraseña son obligatorios' 
      });
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Email inválido' 
      });
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Registrar usuario
    const newUser = await authService.registerUser({ 
      nombre, 
      email, 
      password, 
      negocio 
    });
    
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente',
      usuario: newUser
    });
    
  } catch (error) {
    console.error('Error en registro:', error.message);
    
    // Manejar error de email duplicado
    if (error.code === 'ER_DUP_ENTRY' || error.message.includes('DUP_ENTRY')) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Este correo ya está registrado' 
      });
    }
    
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al registrar usuario' 
    });
  }
}

/**
 * Controlador para login de usuarios
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Email y contraseña son obligatorios' 
      });
    }
    
    // Autenticar usuario
    const result = await authService.loginUser(email, password);
    
    // Configurar cookie para refresh token
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: false, // false para desarrollo local (http)
      sameSite: 'lax', // lax para desarrollo local
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/'
    });
    
    res.json({
      ok: true,
      mensaje: 'Login exitoso',
      usuario: result.usuario,
      accessToken: result.accessToken
    });
    
  } catch (error) {
    console.error('Error en login:', error.message);
    
    if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Email o contraseña incorrectos' 
      });
    }
    
    if (error.message === 'Usuario inactivo') {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Usuario inactivo - Contacta al administrador' 
      });
    }
    
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al iniciar sesión' 
    });
  }
}

/**
 * Controlador para refresh de token
 * POST /api/auth/refresh
 */
async function refreshToken(req, res) {
  try {
    const { userId } = req.user;
    
    // Obtener datos completos del usuario
    const user = await authService.getUserById(userId);
    
    if (!user) {
      return res.status(401).json({ 
        ok: false, 
        mensaje: 'Usuario no encontrado' 
      });
    }
    
    // Generar nuevo access token
    const newAccessToken = generateAccessToken(user);
    
    res.json({
      ok: true,
      accessToken: newAccessToken
    });
    
  } catch (error) {
    console.error('Error en refresh token:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al refresh token' 
    });
  }
}

/**
 * Controlador para logout
 * POST /api/auth/logout
 */
async function logout(req, res) {
  try {
    const { userId } = req.user;
    
    // Incrementar token_version para invalidar todos los tokens
    await authService.incrementTokenVersion(userId);
    
    // Eliminar cookie de refresh token
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    
    res.json({
      ok: true,
      mensaje: 'Logout exitoso'
    });
    
  } catch (error) {
    console.error('Error en logout:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al cerrar sesión' 
    });
  }
}

/**
 * Controlador para obtener usuario actual
 * GET /api/auth/me
 */
async function getMe(req, res) {
  try {
    const { userId } = req.user;
    
    const user = await authService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        ok: false, 
        mensaje: 'Usuario no encontrado' 
      });
    }
    
    res.json({
      ok: true,
      usuario: user
    });
    
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al obtener usuario' 
    });
  }
}

/**
 * Controlador para cambiar contraseña
 * PUT /api/auth/password
 */
async function changePassword(req, res) {
  try {
    const { userId } = req.user;
    const { passwordActual, passwordNuevo } = req.body;
    
    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Contraseña actual y nueva son obligatorias' 
      });
    }
    
    if (passwordNuevo.length < 6) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Actualizar contraseña
    const success = await authService.updatePassword(userId, passwordNuevo);
    
    if (!success) {
      return res.status(500).json({ 
        ok: false, 
        mensaje: 'Error al cambiar contraseña' 
      });
    }
    
    res.json({
      ok: true,
      mensaje: 'Contraseña cambiada correctamente'
    });
    
  } catch (error) {
    console.error('Error al cambiar contraseña:', error.message);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al cambiar contraseña' 
    });
  }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword
};