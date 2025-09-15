// src/services/emailService.js
"use strict";

const nodemailer = require('nodemailer');
const config = require('../config');

const isProd = process.env.NODE_ENV === 'production';

// Configuration SMTP robuste (depuis config + fallback env)
function buildSmtpConfig() {
  const smtpCfg = config.email?.smtp || {};
  const host = smtpCfg.host || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(smtpCfg.port || process.env.SMTP_PORT || 587);

  // Sécurité par port: 465 => TLS direct; 587 => STARTTLS requis
  const secure = port === 465;
  const requireTLS = !secure;

  const user = smtpCfg.user || process.env.SMTP_USER;
  const pass = smtpCfg.pass || process.env.SMTP_PASS;
  const auth = user && pass ? { user, pass } : undefined;

  const tls = {
    rejectUnauthorized: isProd ? true : (smtpCfg.tls?.rejectUnauthorized ?? process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'),
    ...(smtpCfg.tls?.minVersion ? { minVersion: smtpCfg.tls.minVersion } : {})
  };

  const base = {
    host,
    port,
    secure,
    requireTLS,
    auth,
    tls,
    connectionTimeout: Number(smtpCfg.connectionTimeout || process.env.SMTP_CONNECTION_TIMEOUT || 30000),
    greetingTimeout: Number(smtpCfg.greetingTimeout || process.env.SMTP_GREETING_TIMEOUT || 10000),
    socketTimeout: Number(smtpCfg.socketTimeout || process.env.SMTP_SOCKET_TIMEOUT || 30000),
    pool: smtpCfg.pool ?? (process.env.SMTP_POOL === 'true'),
    maxConnections: Number(smtpCfg.maxConnections || process.env.SMTP_MAX_CONNECTIONS || 5),
    maxMessages: Number(smtpCfg.maxMessages || process.env.SMTP_MAX_MESSAGES || 100)
  };

  return base;
}

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  const smtpConfig = buildSmtpConfig();

  // Mode DRY RUN si authentification absente
  if (!smtpConfig.auth?.user || !smtpConfig.auth?.pass) {
    console.warn('⚠️ SMTP non configuré (SMTP_USER / SMTP_PASS manquants) - mode DRY RUN');
    return {
      async sendMail(opts) {
        console.log('📧 [DRY RUN] Email non envoyé (config SMTP absente):', {
          to: opts.to,
          subject: opts.subject
        });
        return { messageId: 'dry-run', accepted: [], rejected: [] };
      },
      async verify() {
        return true;
      }
    };
  }

  transporter = nodemailer.createTransport(smtpConfig);

  try {
    await transporter.verify();
    console.log('✅ SMTP vérifié et prêt');
  } catch (e) {
    console.error('❌ SMTP verify échec:', e.message);
  }

  return transporter;
}

function stripHtml(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function renderTemplate(subject, heading, bodyLines, footer) {
  const body = Array.isArray(bodyLines) ? bodyLines.join('<br/>') : String(bodyLines || '');
  return {
    subject,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;">
        <h2 style="color:#0b6efd;">${heading}</h2>
        <p>${body}</p>
        <hr/>
        <p style="font-size:12px;color:#666;">${footer || 'Ba7ath Forensic - Notification automatique'}</p>
      </div>
    `
  };
}

const emailService = {
  // Envoi générique
  async sendEmail({ to, subject, html, text, headers }) {
    if (!to) throw new Error('Destinataire manquant');
    const t = await getTransporter();

    const fromCfg = config.email?.from || {};
    const from = fromCfg.address || process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@ba7ath.com';
    const fromName = fromCfg.name || 'Ba7ath';

    const mail = {
      from: fromName ? `"${fromName}" <${from}>` : from,
      to,
      subject: subject || 'Notification',
      text: text || (html ? stripHtml(html) : ''),
      html,
      headers: {
        'X-Mailer': 'Ba7ath/EmailService',
        ...(headers || {})
      }
    };

    try {
      const info = await t.sendMail(mail);
      if (info?.messageId) {
        console.log(`📨 Email envoyé -> ${Array.isArray(to) ? to.join(',') : to} | ${subject} | id=${info.messageId}`);
      }
      return { ok: true, messageId: info?.messageId || null, accepted: info?.accepted || [] };
    } catch (e) {
      console.error('❌ Erreur envoi email:', e.message);
      return { ok: false, error: e.message };
    }
  },

  // Templates spécifiques
  async sendVerificationEmail({ to, verificationCode, userName }) {
    const ttl = Number(config.auth?.otp?.ttlMinutes || process.env.OTP_TTL_MINUTES || 15);
    const { subject, html } = renderTemplate(
      'Vérification de votre email',
      'Vérification de votre email',
      [
        `Bonjour${userName ? ` ${userName}` : ''},`,
        `Votre code de vérification est: <b>${verificationCode}</b>.`,
        `Ce code expirera dans ${ttl} minutes.`
      ]
    );
    return this.sendEmail({ to, subject, html });
  },

  async sendResetPasswordEmail({ to, resetLink, userName }) {
    const { subject, html } = renderTemplate(
      'Réinitialisation de mot de passe',
      'Réinitialisation de votre mot de passe',
      [
        `Bonjour${userName ? ` ${userName}` : ''},`,
        `Cliquez sur le lien suivant pour réinitialiser votre mot de passe:`,
        `<a href="${resetLink}" target="_blank" rel="noopener noreferrer">${resetLink}</a>`,
        'Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.'
      ]
    );
    return this.sendEmail({ to, subject, html });
  },

  async sendReportReadyEmail({ to, reportId, downloadUrl }) {
    const { subject, html } = renderTemplate(
      'Votre rapport est prêt',
      'Votre rapport d’analyse est disponible',
      [
        `Le rapport #${reportId} est prêt au téléchargement.`,
        `Téléchargez-le ici: <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer">${downloadUrl}</a>`
      ]
    );
    return this.sendEmail({ to, subject, html });
  },

  async sendCustomEmail({ to, subject, lines, footer, text }) {
    const tpl = renderTemplate(subject || 'Notification', subject || 'Notification', lines || [], footer);
    return this.sendEmail({ to, subject: tpl.subject, html: tpl.html, text });
  },

  // Dédiés vérification (OTP / lien)
  async sendVerificationEmailOtp({ to, code, userName }) {
    const ttl = Number(config.auth?.otp?.ttlMinutes || process.env.OTP_TTL_MINUTES || 15);
    const { subject, html } = renderTemplate(
      'Code de vérification',
      'Code de vérification',
      [
        `Bonjour${userName ? ` ${userName}` : ''},`,
        `Votre code de vérification est: <b style="font-size:18px;letter-spacing:2px;">${code}</b>`,
        `Ce code expirera dans ${ttl} minutes.`,
        'Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.'
      ]
    );
    return this.sendEmail({ to, subject, html });
  },

  async sendVerificationEmailLink({ to, token, userName }) {
    const appBase = config.app?.url || process.env.APP_URL || 'http://localhost:5000';
    const frontBase = config.frontend?.url || process.env.FRONTEND_URL || appBase;
    const verifyUrl = `${appBase}/api/auth/verify-email/${encodeURIComponent(token)}`;

    const hours = Number(config.auth?.emailVerifyHours || 2);
    const validityText = hours <= 1 ? '1 heure' : `${hours} heures`;

    const { subject, html } = renderTemplate(
      'Vérification de votre email',
      'Vérification de votre email',
      [
        `Bonjour${userName ? ` ${userName}` : ''},`,
        `Cliquez sur le lien ci-dessous pour vérifier votre adresse email :`,
        `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">${verifyUrl}</a>`,
        `Ce lien est valide pendant ${validityText}.`,
        `Accéder à l’application: <a href="${frontBase}" target="_blank" rel="noopener noreferrer">${frontBase}</a>`
      ]
    );
    return this.sendEmail({ to, subject, html });
  }
};

module.exports = emailService;
