# Script de prueba para verificar la conexión Frontend-Backend

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PRUEBAS DE CONEXIÓN - MENU MASTER" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Backend
Write-Host "1. Verificando Backend (http://localhost:4000)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:4000/" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Backend funcionando: $($backendResponse.mensaje)" -ForegroundColor Green
    Write-Host "   Versión: $($backendResponse.version)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error al conectar con el backend" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Solución: Asegúrate de correr el backend primero:" -ForegroundColor Yellow
    Write-Host "   cd menu-back" -ForegroundColor Yellow
    Write-Host "   pnpm run dev" -ForegroundColor Yellow
    return
}
Write-Host ""

# 2. Verificar Frontend
Write-Host "2. Verificando Frontend (http://localhost:3000)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000/login" -Method Get -ErrorAction Stop -TimeoutSec 10
    Write-Host "   ✅ Frontend funcionando" -ForegroundColor Green
    Write-Host "   Status: $($frontendResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Frontend no responde aún (puede estar iniciando)" -ForegroundColor Yellow
    Write-Host "   Espera unos segundos y recarga la página" -ForegroundColor Yellow
}
Write-Host ""

# 3. Probar Registro
Write-Host "3. Probando registro de usuario..." -ForegroundColor Yellow
try {
    $testEmail = "test$(Get-Random -Maximum 9999)@test.com"
    $registerBody = @{
        nombre = "Usuario Test"
        email = $testEmail
        password = "123456"
        negocio = "Test"
    } | ConvertTo-Json -Compress
    
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/register" -Method Post -ContentType "application/json" -Body $registerBody -ErrorAction Stop
    Write-Host "   ✅ Registro exitoso" -ForegroundColor Green
    Write-Host "   Usuario: $($registerResponse.usuario.nombre)" -ForegroundColor Green
    Write-Host "   Email: $testEmail" -ForegroundColor Cyan
} catch {
    Write-Host "   ⚠️  Error en registro (puede que el usuario ya exista)" -ForegroundColor Yellow
}
Write-Host ""

# 4. Probar Login
Write-Host "4. Probando login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "angel@test.com"
        password = "123456"
    } | ConvertTo-Json -Compress
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    Write-Host "   ✅ Login exitoso" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.usuario.nombre)" -ForegroundColor Green
    Write-Host "   Plan: $($loginResponse.usuario.plan)" -ForegroundColor Green
    
    $accessToken = $loginResponse.accessToken
    Write-Host "   Access Token: $($accessToken.Substring(0, 50))..." -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Error en login" -ForegroundColor Red
    Write-Host "   Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    $accessToken = $null
}
Write-Host ""

# 5. Probar API protegida (si hay token)
if ($accessToken) {
    Write-Host "5. Probendo API protegida (GET /api/menus)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $accessToken"
        }
        
        $menusResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/menus" -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Menús obtenidos: $($menusResponse.total)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Error al obtener menús" -ForegroundColor Red
        Write-Host "   Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# 6. Verificar variables de entorno del frontend
Write-Host "6. Verificando configuración del frontend..." -ForegroundColor Yellow
if (Test-Path "C:\Users\angel\Proyectos\dwi\editor-menu-angel\menu-front\menus-app\.env.local") {
    $envContent = Get-Content "C:\Users\angel\Proyectos\dwi\editor-menu-angel\menu-front\menus-app\.env.local"
    $apiUrl = $envContent | Where-Object { $_ -match "NEXT_PUBLIC_API_URL" } | ForEach-Object { $_.Split('=')[1] }
    
    if ($apiUrl -eq "http://localhost:4000") {
        Write-Host "   ✅ NEXT_PUBLIC_API_URL configurada correctamente" -ForegroundColor Green
        Write-Host "   URL: $apiUrl" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  NEXT_PUBLIC_API_URL puede ser incorrecta" -ForegroundColor Yellow
        Write-Host "   Valor actual: $apiUrl" -ForegroundColor Yellow
        Write-Host "   Debería ser: http://localhost:4000" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ No se encontró .env.local" -ForegroundColor Red
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:4000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Para probar la aplicación:" -ForegroundColor Cyan
Write-Host "1. Abre tu navegador en http://localhost:3000/login" -ForegroundColor White
Write-Host "2. Regístrate o inicia sesión" -ForegroundColor White
Write-Host "3. Explora el dashboard" -ForegroundColor White
Write-Host ""