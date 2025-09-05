@echo off
setlocal EnableDelayedExpansion

echo.
echo ==========================================
echo   Forensic Image Analysis - Startup
echo ==========================================
echo.

REM Vérifier si les dossiers existent
if not exist "backend\" (
    echo ❌ ERREUR: Le dossier 'backend' n'existe pas !
    echo Assurez-vous d'être dans la racine du projet.
    pause
    exit /b 1
)

if not exist "frontend\" (
    echo ❌ ERREUR: Le dossier 'frontend' n'existe pas !
    echo Assurez-vous d'être dans la racine du projet.
    pause
    exit /b 1
)

REM Vérifier si node_modules existe dans backend
if not exist "backend\node_modules\" (
    echo ⚠️  WARNING: node_modules manquant dans backend
    echo Exécution de npm install...
    cd backend
    npm install
    cd ..
)

REM Vérifier si node_modules existe dans frontend
if not exist "frontend\node_modules\" (
    echo ⚠️  WARNING: node_modules manquant dans frontend
    echo Exécution de npm install...
    cd frontend
    npm install
    cd ..
)

echo 🔧 Démarrage du backend (Node.js + MongoDB)...
cd backend
start "🔍 Backend - Forensic Analysis API" cmd /k "color 0A && echo Backend Server Started && npm run dev"

echo ⏳ Attente du backend (8 secondes)...
timeout /t 8 /nobreak > nul

echo 🎨 Démarrage du frontend (React)...
cd ..\frontend
start "🖥️  Frontend - Forensic Analysis UI" cmd /k "color 0B && echo Frontend Server Started && npm start"

echo.
echo ✅ Les deux serveurs sont en cours de démarrage !
echo.
echo 📊 Accès aux services :
echo   • Frontend:    http://localhost:3000
echo   • Backend API: http://localhost:5000
echo   • API Health:  http://localhost:5000/api/health
echo   • Uploads:     http://localhost:5000/uploads
echo.
echo 💡 Conseil: Attendez que les deux terminaux affichent "compiled successfully"
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause > nul
