@echo off
title OMNIPLAY Startup Platform
echo ========================================================
echo   🎮 MENJALANKAN WEB PERENCANAAN STARTUP: OMNIPLAY
echo ========================================================
echo Membuka server lokal di http://localhost:8080 ...
start http://localhost:8080
python -m http.server 8080
pause
