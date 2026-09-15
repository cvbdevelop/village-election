@echo off
echo ========================================
echo   ចាប់ផ្តើម Village Election System
echo ========================================

echo.
echo [1/3] ចាប់ផ្តើម MySQL...
net start MySQL80

echo.
echo [2/3] ចាប់ផ្តើម Backend Server...
start cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo [3/3] ចាប់ផ្តើម Frontend Server...
start cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   រួចរាល់! បើក Browser ទៅ:
echo   http://localhost:5173
echo ========================================
timeout /t 5 /nobreak >nul