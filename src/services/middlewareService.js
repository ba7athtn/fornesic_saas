// src/services/middlewareService.js — version corrigée (sans try/catch redondants)
// Corrige l’appel anticipé à next() qui causait des 404 sur les routes async.

"use strict";

const crypto = require('crypto');

class MiddlewareService {
  // Async handler sûr: ne JAMAIS appeler next() en succès.
  // Retourne la Promise pour qu’Express attende la fin du handler.
  static asyncHandler(fn) {
    return function wrappedAsyncHandler(req, res, next) {
      const startTime = Date.now();

      const onSuccess = () => {
        if (!res.headersSent) {
          res.setHeader('X-Processing-Time', `${Date.now() - startTime}ms`);
        }
        // Ne pas appeler next() ici: laisser la route/middleware décider.
      };

      return Promise.resolve(fn(req, res, next))
        .then(onSuccess)
        .catch((error) => {
          const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
          error.requestId = requestId;
          error.endpoint = `${req.method} ${req.path}`;
          error.processingTime = `${Date.now() - startTime}ms`;
          error.userId = req.user?.sub;
          if (!error.type) error.type = 'MIDDLEWARE_HANDLER_ERROR';
          next(error);
        });
    };
  }

  // Wrapper de route: simple alias de asyncHandler
  static route(fn) {
    return MiddlewareService.asyncHandler(fn);
  }

  // Gestion centralisée des erreurs (à monter après vos routes)
  static errorHandler() {
    return (error, req, res, next) => {
      // Journalisation structurée
      console.error('❌ Erreur interceptée:', {
        type: error.type || 'UNKNOWN_ERROR',
        message: error.message,
        endpoint: error.endpoint || `${req.method} ${req.path}`,
        userId: error.userId || req.user?.sub,
        requestId: error.requestId || req.requestId,
        processingTime: error.processingTime
      });

      const statusCode = error.status || error.statusCode || 500;

      const response = {
        error: error.message || 'Erreur interne du serveur',
        type: error.type || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        requestId: error.requestId || req.requestId
      };

      if (error.details) response.details = error.details;
      if (error.processingTime) response.processingTime = error.processingTime;

      if (!res.headersSent) {
        res.status(statusCode).json(response);
      } else {
        // Si déjà envoyé, ne pas réécrire la réponse
        next();
      }
    };
  }

  // Not Found handler (optionnel)
  static notFound() {
    return (req, res, next) => {
      const error = new Error('Route non trouvée');
      error.status = 404;
      error.type = 'NOT_FOUND';
      error.endpoint = `${req.method} ${req.path}`;
      error.requestId = req.requestId || crypto.randomBytes(8).toString('hex');
      next(error);
    };
  }

  // Validation wrapper (ex: zod/joi/celebrate) sans try/catch
  // Pour un middleware de validation, on appelle next() explicitement
  static validate(validator) {
    return MiddlewareService.asyncHandler(async (req, res, next) => {
      const value = await (validator.parseAsync
        ? validator.parseAsync({ body: req.body, query: req.query, params: req.params })
        : validator({ body: req.body, query: req.query, params: req.params }));

      if (value && typeof value === 'object') {
        req.validated = value;
      }
      return next();
    });
  }
}

module.exports = MiddlewareService;
