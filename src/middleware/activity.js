// src/middleware/activity.js - VERSION OPTIMISÉE
"use strict";

const mongoose = require('mongoose');

// Options d'optimisation BD
const UPDATE_OPTIONS = {
  upsert: false,
  setDefaultsOnInsert: false
};

// Sanitize rapide des champs d'agent/utilisateur
function sanitizeUA(ua) {
  if (!ua || typeof ua !== 'string') return null;
  return ua.substring(0, 200); // limiter la taille
}

// Middleware d'activité non bloquant
module.exports = function activityTracker(options = {}) {
  const {
    enabled = true,           // possibilité de désactiver via options
    modelName = 'User',       // nom du modèle Mongoose
    fieldPrefix = 'security', // préfixe des champs
    asyncFireAndForget = true // ne pas await pour ne pas bloquer la requête
  } = options;

  return (req, res, next) => {
    // Ne rien faire si désactivé
    if (!enabled) return next();

    // Capturer infos minimales
    const userId = req.user?.sub || req.user?._id;
    if (!userId) return next();

    // Vérifier état mongoose
    if (mongoose.connection.readyState !== 1) {
      // DB pas encore prête → ignorer silencieusement
      return next();
    }

    // Récupérer modèle de façon sûre
    let UserModel = null;
    try {
      UserModel = mongoose.model(modelName);
    } catch (e) {
      // Modèle non enregistré → ignorer
      return next();
    }

    const now = new Date();
    const update = {
      $set: {
        [`${fieldPrefix}.lastActivity`]: now,
        [`${fieldPrefix}.lastActivityIP`]: req.ip,
        [`${fieldPrefix}.lastActivityUA`]: sanitizeUA(req.get('User-Agent'))
      }
    };

    // Fonction d’update
    const doUpdate = async () => {
      try {
        await UserModel.updateOne({ _id: userId }, update, UPDATE_OPTIONS).exec();
      } catch (e) {
        // Log minimal non intrusif
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Activity tracker error:', e.message);
        }
      }
    };

    // Exécution non bloquante par défaut
    if (asyncFireAndForget) {
      // Ne pas bloquer la requête courante
      doUpdate();
      return next();
    }

    // Optionnel: si on veut attendre l’update (rarement nécessaire)
    doUpdate().finally(() => next());
  };
};
