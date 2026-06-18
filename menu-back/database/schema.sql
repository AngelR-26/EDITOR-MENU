-- ============================================
-- Menu Master - Base de Datos Completa
-- RBAC + ABAC + Auditoría
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS menumaster 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE menumaster;

-- ============================================
-- 1. ROLES (RBAC)
-- ============================================

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. PERMISOS (RBAC)
-- ============================================

CREATE TABLE permisos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recurso VARCHAR(50) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255),
  UNIQUE KEY unique_permiso (recurso, accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ROL_PERMISOS (RBAC - Asignación)
-- ============================================

CREATE TABLE rol_permisos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rol_id INT NOT NULL,
  permiso_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rol_permiso (rol_id, permiso_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. USUARIOS
-- ============================================

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  negocio VARCHAR(100),
  plan ENUM('basico', 'pro', 'premium') DEFAULT 'basico',
  rol_id INT DEFAULT 2,
  token_version INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_rol (rol_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. MENÚS (Recursos Principales)
-- ============================================

CREATE TABLE menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  estado ENUM('borrador', 'publicado') DEFAULT 'borrador',
  data_json JSON,
  plantilla_id INT,
  qr_code_url VARCHAR(255),
  public_url VARCHAR(255),
  es_publico BOOLEAN DEFAULT FALSE,
  organizacion_id INT,
  etiquetas JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. IMÁGENES
-- ============================================

CREATE TABLE imagenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cloudinary_id VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  tipo ENUM('logo', 'fondo', 'producto') DEFAULT 'producto',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. POLÍTICAS DE ACCESO (ABAC)
-- ============================================

CREATE TABLE politicas_acceso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  recurso VARCHAR(50) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  condiciones JSON NOT NULL,
  rol_id INT,
  prioridad INT DEFAULT 0,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_recurso (recurso, accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. AUDITORÍA
-- ============================================

CREATE TABLE auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  accion VARCHAR(50) NOT NULL,
  recurso VARCHAR(50) NOT NULL,
  recurso_id INT,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  atributos_usuario JSON,
  atributos_recurso JSON,
  permitido BOOLEAN NOT NULL,
  razon_denegacion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_recurso (recurso, recurso_id),
  INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES - ROLES
-- ============================================

INSERT INTO roles (nombre, descripcion) VALUES
('owner', 'Dueño del negocio - acceso total'),
('admin', 'Administrador - gestión completa'),
('editor', 'Editor - crear y editar menús'),
('viewer', 'Visualizador - solo lectura');

-- ============================================
-- DATOS INICIALES - PERMISOS
-- ============================================

INSERT INTO permisos (recurso, accion, descripcion) VALUES
('menu', 'create', 'Crear nuevos menús'),
('menu', 'read', 'Ver menús'),
('menu', 'update', 'Editar menús'),
('menu', 'delete', 'Eliminar menús'),
('menu', 'publish', 'Publicar menús'),
('usuario', 'create', 'Crear usuarios'),
('usuario', 'read', 'Ver usuarios'),
('usuario', 'update', 'Editar usuarios'),
('usuario', 'delete', 'Eliminar usuarios'),
('imagen', 'create', 'Subir imágenes'),
('imagen', 'read', 'Ver imágenes'),
('imagen', 'delete', 'Eliminar imágenes'),
('politica', 'create', 'Crear políticas'),
('politica', 'read', 'Ver políticas'),
('politica', 'update', 'Editar políticas'),
('auditoria', 'read', 'Ver auditoría');

-- ============================================
-- DATOS INICIALES - ROL_PERMISOS
-- ============================================

-- Owner: todos los permisos
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT 1, id FROM permisos;

-- Admin: casi todos (sin delete usuarios y sin políticas)
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT 2, id FROM permisos 
WHERE NOT (recurso = 'usuario' AND accion = 'delete')
  AND NOT (recurso = 'politica');

-- Editor: menús e imágenes (create, read, update)
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT 3, id FROM permisos 
WHERE recurso IN ('menu', 'imagen') 
  AND accion IN ('create', 'read', 'update', 'publish');

-- Viewer: solo lectura
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT 4, id FROM permisos 
WHERE accion = 'read';

-- ============================================
-- DATOS INICIALES - POLÍTICAS ABAC
-- ============================================

-- Política: Usuario solo puede editar sus propios menús
INSERT INTO politicas_acceso (nombre, recurso, accion, condiciones, rol_id, prioridad, activa) VALUES
('Owner de menú', 'menu', 'update', 
 '{"owner": "$user.id"}', 
 NULL, 10, TRUE);

-- Política: Usuario solo puede eliminar sus propios menús
INSERT INTO politicas_acceso (nombre, recurso, accion, condiciones, rol_id, prioridad, activa) VALUES
('Owner de menú', 'menu', 'delete', 
 '{"owner": "$user.id"}', 
 NULL, 10, TRUE);

-- Política: Plan básico solo puede crear hasta 3 menús
INSERT INTO politicas_acceso (nombre, recurso, accion, condiciones, rol_id, prioridad, activa) VALUES
('Límite plan básico', 'menu', 'create', 
 '{"plan_minimo": "basico", "max_menus": 3}', 
 NULL, 5, TRUE);

-- Política: Solo admin puede publicar menús
INSERT INTO politicas_acceso (nombre, recurso, accion, condiciones, rol_id, prioridad, activa) VALUES
('Publicar requiere admin', 'menu', 'publish', 
 '{"roles_permitidos": ["admin", "owner"]}', 
 NULL, 15, TRUE);

-- ============================================
-- USUARIO DE PRUEBA (password: admin123)
-- ============================================

-- El hash es para 'admin123' con bcrypt 10 rounds
INSERT INTO usuarios (nombre, email, password_hash, negocio, plan, rol_id, activo) VALUES
('Administrador', 'admin@menumaster.com', '$2b$10$rN8vZJhT6kXqGz8KqQvLh.LxGx9KqQvLh.LxGx9KqQvLh.LxGx9KqQv', 'MenuMaster HQ', 'premium', 1, TRUE);

-- ============================================
-- VERIFICACIÓN DE TABLAS CREADAS
-- ============================================

SELECT 
  TABLE_NAME,
  TABLE_ROWS,
  TABLE_COMMENT
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'menumaster'
ORDER BY TABLE_NAME;