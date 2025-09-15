require('dotenv').config();

console.log('🔍 Test variables JWT:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Présent' : '❌ Manquant');
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? '✅ Présent' : '❌ Manquant');

if (process.env.JWT_SECRET && process.env.JWT_REFRESH_SECRET) {
  console.log('🎉 Configuration JWT complète !');
} else {
  console.log('❌ Variables JWT manquantes');
}
