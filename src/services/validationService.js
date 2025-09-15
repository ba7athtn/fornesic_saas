// /services/validationService.js - REMPLACE validation.js (500+ lignes → 100 lignes)
"use strict";

const Joi = require('joi');

class ValidationService {
  constructor() {
    // ✅ SCHEMAS CENTRALISÉS (plus de duplication express-validator)
    this.schemas = {
      registration: Joi.object({
        email: Joi.string().email().max(255).required(),
        password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
        firstName: Joi.string().pattern(/^[a-zA-ZÀ-ÿ\s-']+$/).min(2).max(50).required(),
        lastName: Joi.string().pattern(/^[a-zA-ZÀ-ÿ\s-']+$/).min(2).max(50).required(),
        organization: Joi.string().max(100).optional(),
        acceptTerms: Joi.boolean().valid(true).required()
      }),
      
      login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        rememberMe: Joi.boolean().optional()
      }),
      
      refreshToken: Joi.object({
        refreshToken: Joi.string().required() // JWT validation via middleware
      }),
      
      passwordReset: Joi.object({
        password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required()
      }),
      
      passwordChange: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
        confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required()
      }).custom((value) => {
        if (value.currentPassword === value.newPassword) {
          throw new Error('Le nouveau mot de passe doit être différent');
        }
        return value;
      })
    };
  }

  // ✅ VALIDATION UNIFIÉE (remplace 8 fonctions répétitives)
  validate(schemaName, source = 'body') {
    return (req, res, next) => {
      const data = source === 'params' ? req.params : req.body;
      const schema = this.schemas[schemaName];

      if (!schema) {
        return res.status(500).json({
          error: 'Schéma de validation introuvable',
          type: 'VALIDATION_SCHEMA_MISSING',
          schema: schemaName,
          timestamp: new Date().toISOString()
        });
      }

      const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
      });
      
      if (error) {
        return res.status(400).json({
          error: 'Données invalides',
          type: 'VALIDATION_ERROR',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          })),
          timestamp: new Date().toISOString()
        });
      }
      
      // ✅ Données validées et nettoyées
      if (source === 'body') req.body = value;
      if (source === 'params') req.params = value;
      
      next();
    };
  }

  // ✅ VALIDATION FORENSIQUE SPÉCIALISÉE (externalisée)
  validateForensicUpload() {
    return require('./forensicValidationService').validateUpload();
  }
}

module.exports = new ValidationService();
