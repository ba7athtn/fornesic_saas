// backend/scripts/check-imports.js

require('dotenv').config(); // Charger les variables d'environnement en premier

const path = require('path');
const http = require('http');

const TEST_API_URL = 'http://localhost:5000/api/auth/profile';
const JWT_TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGMwNDIxNzE3M2Y0NWJkY2ViZGI2MzQiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzU3NzgwMjA3LCJpc3MiOiJiYTdhdGgtYXV0aCIsImF1ZCI6ImJhN2F0aC1hcGkiLCJqdGkiOiI2ZGNkYzNjNmY5MWRhZDhiMzMwMzNjMWJhN2UwMjlmOSIsInJvbGVzIjpbImFkbWluIl0sInNjb3BlcyI6WyJvcmc6bWVtYmVyOmxpc3QiLCJvcmc6bWVtYmVyOmludml0ZSIsIm9yZzptZW1iZXI6cm9sZTp1cGRhdGUiLCJvcmc6cXVvdGE6dXBkYXRlIiwiYmlsbGluZzp2aWV3Il0sInN1YnNjcmlwdGlvbiI6ImZyZWUiLCJzdGF0dXMiOiJhY3RpdmUiLCJleHAiOjE3NTc3ODM4MDd9.QSkQAeBsuR7sOcFYGXebQgI-DuzVP_X-OkFpfcC4cLk';

async function checkModuleExports(modulePath, expectedExports) {
  console.log(`\n👉 Vérification du module: ${modulePath}`);
  try {
    const mod = require(modulePath);
    let allOk = true;
    for (const exp of expectedExports) {
      if (!(exp in mod)) {
        console.error(`❌ L’export "${exp}" est manquant`);
        allOk = false;
      } else {
        const type = typeof mod[exp];
        console.log(`✅ "${exp}" trouvé (type: ${type})`);
        if (type !== 'function') {
          console.warn(`⚠️ "${exp}" n’est pas une fonction (type: ${type})`);
        }
      }
    }
    if (allOk) {
      console.log('✅ Tous les exports attendus présents');
    }
  } catch (err) {
    console.error(`❌ Erreur d’import du module ${modulePath}:`, err.message);
  }
}

async function checkMiddlewareFunctions(middlewares, names) {
  console.log(`\n👉 Vérification des middlewares`);
  let allOk = true;
  names.forEach((name) => {
    const mw = middlewares[name];
    if (!mw) {
      console.error(`❌ Middleware "${name}" non défini`);
      allOk = false;
    } else if (typeof mw !== 'function' && !Array.isArray(mw)) {
      console.error(`❌ Middleware "${name}" n’est ni une fonction ni un tableau (type: ${typeof mw})`);
      allOk = false;
    } else {
      console.log(`✅ Middleware "${name}" OK (type: ${Array.isArray(mw) ? 'tableau' : 'fonction'})`);
    }
  });
  if (allOk) {
    console.log('✅ Tous les middlewares sont définis (fonction ou tableau)');
  }
}

function testApiWithJwt(url, token) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on('error', err => reject(err));
  });
}

async function main() {
  // Parcours contrôleurs imageController
  await checkModuleExports(
    path.resolve(__dirname, '../src/controllers/imageController.js'),
    [
      'uploadForensicImage',
      'uploadMultipleForensicImages',
      'getForensicImageDetails',
      'listForensicImages',
      'deleteForensicImage',
      'getImageStatus'
    ]
  );

  // Parcours middleware auth.js
  const authMiddleware = require('../src/middleware/auth');
  await checkMiddlewareFunctions(authMiddleware, [
    'auth',
    'optionalAuth',
    'requireRole',
    'forensicLogging',
    'requirePrivacyMode'
  ]);

  // Parcours middleware validation.js
  const validationMiddleware = require('../src/middleware/validation');
  await checkMiddlewareFunctions(validationMiddleware, [
    'validateForensicObjectId',
    'validateForensicQuery'
  ]);

  // Vérification middlewareService
  await checkModuleExports(
    path.resolve(__dirname, '../src/services/middlewareService.js'),
    ['asyncHandler', 'errorHandler']
  );

  // Vérification config.js export
  try {
    const config = require('../config');
    console.log('\n👉 Vérification config.js');
    if (typeof config === 'object' && config !== null) {
      console.log('✅ config.js chargé correctement');
    } else {
      console.error('❌ config.js ne retourne pas un objet');
    }
  } catch (err) {
    console.error('❌ Erreur chargement config.js:', err.message);
  }

  // Test API protégée avec JWT
  console.log('\n👉 Test accès API protégée avec JWT chargé');
  try {
    const result = await testApiWithJwt(TEST_API_URL, JWT_TEST_TOKEN);
    console.log(`✅ Statut: ${result.statusCode}`);
    const preview = result.body.length > 200 ? result.body.substring(0,200) + '...' : result.body;
    console.log(`Réponse: ${preview}`);
  } catch (e) {
    console.error('❌ Erreur test API JWT:', e.message);
  }
}

main().catch((err) => {
  console.error('Erreur dans le script de vérification:', err);
});
