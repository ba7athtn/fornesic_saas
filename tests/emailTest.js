// tests/emailtest.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const path = require('path');

const emailService = require(path.join(__dirname, '..', 'src', 'services', 'emailService'));

(async () => {
  try {
    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    const missing = required.filter(k => !process.env[k] || String(process.env[k]).trim() === '');
    if (missing.length) {
      console.error('❌ Variables SMTP manquantes:', missing);
      process.exit(1);
    }

    const to = process.env.SMTP_TEST_TO || process.env.SMTP_USER;
    const subject = 'Ba7ath Forensic - Test SMTP OK';
    const lines = [
      'Ceci est un email de test envoyé via Nodemailer + Gmail SMTP.',
      `Date: ${new Date().toISOString()}`,
      `Envoyé depuis: ${process.env.SMTP_FROM}`
    ];

    console.log('📧 Envoi email de test à:', to);
    const result = await emailService.sendCustomEmail({ to, subject, lines });

    if (result.ok) {
      console.log('✅ Email envoyé avec succès:', result);
      process.exit(0);
    } else {
      console.error('❌ Échec envoi email:', result);
      process.exit(2);
    }
  } catch (err) {
    console.error('💥 Erreur inattendue:', err);
    process.exit(3);
  }
})();
