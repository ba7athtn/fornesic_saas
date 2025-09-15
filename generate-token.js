// generate-token.js - VERSION CORRIGÉE
const jwt = require('jsonwebtoken');

const payload = {
  sub: "68c04217173f45bdcebdb634",
  type: "access",
  iat: Math.floor(Date.now() / 1000),
  iss: "ba7ath-auth",
  aud: "ba7ath-api", 
  jti: require('crypto').randomBytes(16).toString('hex'),
  roles: ["admin"],
  scopes: [
    "org:member:list",
    "org:member:invite",
    "org:member:role:update",
    "org:quota:update",
    "billing:view"
  ],
  subscription: "free",
  status: "active",
  exp: Math.floor(Date.now() / 1000) + (7 * 24 * 3600) // 7 jours
};

// ✅ VOTRE VRAIE CLÉ SECRÈTE
const secret = 'eec5d7c6fbeb488315ccdee3fe31c49a4427bf42fd7755fa17fc5d67a99493d0d9d43d6939b8a4fcf1cea1bf5e11567c11867f17ae53dc12ea9a49ffc075386b';

const token = jwt.sign(payload, secret);

console.log('\n🔑 NOUVEAU TOKEN JWT (valable 7 jours):');
console.log(token);
console.log('\n✅ Copiez ce token pour vos tests curl\n');
