@echo off
chcp 65001 >nul
title Actualizador Automatico - Z_DESIGN Portfolio

echo ========================================================
echo        Z_DESIGN96 - ACTUALIZADOR AUTOMATICO WEB
echo ========================================================
echo.
echo [1/4] Sincronizando descripciones desde archivos .txt...
cd /d "%~dp0"
call node scripts/syncProjects.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al leer los archivos .txt de las carpetas.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/4] Empaquetando y optimizando la web para produccion...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo en la compilacion de la web.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Preparando cambios para GitHub...
git add .
set FECHA=%date:~6,4%-%date:~3,2%-%date:~0,2% %time:~0,2%:%time:~3,2%
git commit -m "Auto-update proyectos: %FECHA%"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Cambios guardados localmente.
) else (
    echo [INFO] No habia cambios pendientes para guardar.
)

echo.
echo [4/4] Subiendo a la nube (GitHub Pages)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudo conectar con GitHub. Revisa tu conexion a internet.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo       ACTUALIZACION COMPLETADA CON EXITO
echo  En 1-2 minutos tus cambios se veran en la web en vivo.
echo ========================================================
echo.
timeout /t 10