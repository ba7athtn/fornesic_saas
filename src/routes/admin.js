"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Services
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const validationService = require('../services/validationService');

// Middlewares
const { auth, requireRole, requirePrivacyMode, forensicLogging } = require('../middleware/auth');
const { validateForensicObjectId } = require('../middleware/validation');

// Config centralisée
const config = require('../config');

// ================================
// CONFIGURATION CENTRALISÉE (branchée)
// ================================
const CONFIG = {
  rateLimits: {
    adminGeneral: {
      limit: config.rateLimit?.admin?.general?.limit ?? 100,
      window: config.rateLimit?.admin?.general?.windowSeconds ?? 3600
    },
    userOperations: {
      limit: config.rateLimit?.admin?.userOps?.limit ?? 50,
      window: config.rateLimit?.admin?.userOps?.windowSeconds ?? 3600
    },
    roleUpdates: {
      limit: config.rateLimit?.admin?.roleUpdates?.limit ?? 20,
      window: config.rateLimit?.admin?.roleUpdates?.windowSeconds ?? 3600
    }
  },
  pagination: {
    defaultLimit: config.pagination?.admin?.defaultLimit ?? 50,
    maxLimit: config.pagination?.admin?.maxLimit ?? 100
  },
  validation: {
    allowedRoles: config.auth?.allowedRoles ?? ['user', 'forensic_analyst', 'expert', 'admin', 'forensic_admin', 'developer'],
    maxRolesPerUser: config.auth?.maxRolesPerUser ?? 3
  },
  cache: {
    userListTTL: config.cache?.admin?.userListTTL ?? 300,
    userDetailsTTL: config.cache?.admin?.userDetailsTTL ?? 600
  },
  security: {
    restrictSearchRegex: config.security?.restrictSearchRegex ?? true
  }
};

// ================================
// RATE LIMITING ADMIN
// ================================
const adminGeneralLimiter = rateLimitService.createCustomLimit({
  windowMs: CONFIG.rateLimits.adminGeneral.window * 1000,
  max: CONFIG.rateLimits.adminGeneral.limit,
  message: {
    success: false,
    error: 'Trop de requêtes admin dans l\'heure',
    type: 'ADMIN_RATE_LIMIT_EXCEEDED'
  }
});

const userOperationsLimiter = rateLimitService.createCustomLimit({
  windowMs: CONFIG.rateLimits.userOperations.window * 1000,
  max: CONFIG.rateLimits.userOperations.limit,
  message: {
    success: false,
    error: 'Trop d\'opérations utilisateurs dans l\'heure',
    type: 'USER_OPERATIONS_RATE_LIMIT_EXCEEDED'
  }
});

const roleUpdatesLimiter = rateLimitService.createCustomLimit({
  windowMs: CONFIG.rateLimits.roleUpdates.window * 1000,
  max: CONFIG.rateLimits.roleUpdates.limit,
  message: {
    success: false,
    error: 'Trop de changements de rôles dans l\'heure',
    type: 'ROLE_UPDATES_RATE_LIMIT_EXCEEDED'
  }
});

// ================================
class AdminRoutesMiddleware {
  // Sécurité admin
  static adminSecurityMiddleware = middlewareService.asyncHandler(async (req, res, next) => {
    req.requestId = req.requestId || crypto.randomBytes(8).toString('hex');
    req.adminContext = {
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']?.substring(0, 100),
      ipAddress: req.ip,
      requestId: req.requestId,
      adminUser: req.user?.email
    };
    console.log(`👑 [${req.requestId}] Admin request: ${req.method} ${req.path} by ${req.user?.email}`);
    next();
  });

  // Validation rôles
  static validateRoles = (req, res, next) => {
    const { roles } = req.body || {};

    if (!roles) {
      return res.status(400).json({
        success: false,
        error: 'Champ roles requis',
        type: 'ROLES_REQUIRED',
        requestId: req.requestId
      });
    }
    if (!Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        error: 'Les rôles doivent être un tableau',
        type: 'ROLES_MUST_BE_ARRAY',
        requestId: req.requestId
      });
    }
    if (roles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Au moins un rôle requis',
        type: 'ROLES_EMPTY',
        requestId: req.requestId
      });
    }
    if (roles.length > CONFIG.validation.maxRolesPerUser) {
      return res.status(400).json({
        success: false,
        error: `Maximum ${CONFIG.validation.maxRolesPerUser} rôles par utilisateur`,
        type: 'TOO_MANY_ROLES',
        maxRoles: CONFIG.validation.maxRolesPerUser,
        requestId: req.requestId
      });
    }

    const invalidRoles = roles.filter(role => !CONFIG.validation.allowedRoles.includes(role));
    if (invalidRoles.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Rôles non autorisés: ${invalidRoles.join(', ')}`,
        type: 'INVALID_ROLES',
        invalidRoles,
        allowedRoles: CONFIG.validation.allowedRoles,
        requestId: req.requestId
      });
    }

    const uniqueRoles = [...new Set(roles)];
    if (uniqueRoles.length !== roles.length) {
      return res.status(400).json({
        success: false,
        error: 'Rôles dupliqués détectés',
        type: 'DUPLICATE_ROLES',
        requestId: req.requestId
      });
    }

    req.validatedRoles = uniqueRoles;
    next();
  };

  // Pipelines
  static get adminGeneralPipeline() {
    return [
      this.adminSecurityMiddleware,
      adminGeneralLimiter,
      auth,
      requireRole(['admin', 'forensic_admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging
    ];
  }

  static get userManagementPipeline() {
    return [
      this.adminSecurityMiddleware,
      userOperationsLimiter,
      auth,
      requireRole(['admin', 'forensic_admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging
    ];
  }

  static get roleUpdatePipeline() {
    return [
      this.adminSecurityMiddleware,
      roleUpdatesLimiter,
      auth,
      requireRole(['admin']),
      requirePrivacyMode(['JUDICIAL']),
      forensicLogging,
      this.validateRoles
    ];
  }
}

// ================================
// CACHE MANAGER
// ================================
class AdminCacheManager {
  static async getCachedUserList(cacheKey) {
    try {
      const cached = await cacheService.getWithType('admin_user_lists', cacheKey);
      return { data: cached, cached: !!cached };
    } catch (error) {
      console.warn(`⚠️ Erreur cache user list:`, error.message);
      return { data: null, cached: false };
    }
  }

  static async setCachedUserList(cacheKey, users) {
    try {
      await cacheService.setWithType('admin_user_lists', cacheKey, {
        users,
        cachedAt: new Date().toISOString()
      }, CONFIG.cache.userListTTL);
    } catch (error) {
      console.warn(`⚠️ Erreur sauvegarde cache user list:`, error.message);
    }
  }

  static async invalidateUserCache(userId) {
    const patterns = [
      'admin_user_lists_*',
      `user_profile_${userId}*`,
      `user_permissions_${userId}*`,
      `user_sessions_${userId}*`
    ];

    const promises = patterns.map(pattern =>
      cacheService.deletePattern(pattern).catch(err =>
        console.warn(`⚠️ Erreur invalidation cache ${pattern}:`, err.message)
      )
    );

    await Promise.allSettled(promises);
    console.log(`🧹 Cache utilisateur invalidé: ${userId}`);
  }
}

// ================================
// UTILITAIRES
// ================================
class AdminUtilities {
  static getSystemInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.round(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };
  }

  static sanitizeUserForAdmin(user) {
    if (!user) return null;
    if (typeof user.toSafeObject === 'function') {
      return user.toSafeObject();
    }
    const sanitized = { ...user };
    delete sanitized.password;
    delete sanitized.refreshTokens;
    delete sanitized.resetTokens;
    delete sanitized.verification;
    return sanitized;
  }

  static async logAdminAction(action, req, details = {}) {
    try {
      const AdminAuditLog = require('../models/AdminAuditLog');
      await AdminAuditLog.create({
        action,
        performedBy: req.user?.sub,
        performedByEmail: req.user?.email,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']?.substring(0, 200),
        requestId: req.requestId,
        details,
        timestamp: new Date()
      });
    } catch (error) {
      console.warn(`⚠️ Erreur audit log:`, error.message);
    }
  }
}

// ================================
// HANDLERS
// ================================
class AdminHandlers {
  // Liste utilisateurs
  static async handleListUsers(req, res) {
    const { page = 1, limit = CONFIG.pagination.defaultLimit, search, role } = req.query;
    console.log(`👥 [${req.requestId}] Liste utilisateurs demandée par ${req.user?.email}`);

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(CONFIG.pagination.maxLimit, Math.max(1, parseInt(limit) || CONFIG.pagination.defaultLimit));
    const skip = (pageNum - 1) * limitNum;

    const cacheKey = `users_${pageNum}_${limitNum}_${search || 'all'}_${role || 'all'}`;

    const cachedResult = await AdminCacheManager.getCachedUserList(cacheKey);
    if (cachedResult.cached && cachedResult.data) {
      console.log(`🎯 [${req.requestId}] Cache hit liste utilisateurs`);
      return res.json({
        success: true,
        data: cachedResult.data.users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: cachedResult.data.users.length
        },
        cached: true,
        cacheTime: cachedResult.data.cachedAt,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    try {
      const User = require('../models/User');

      const query = {};
      if (search) {
        const safe = CONFIG.security.restrictSearchRegex ? String(search).slice(0, 64) : String(search);
        query.$or = [
          { 'profile.firstName': { $regex: safe, $options: 'i' } },
          { 'profile.lastName': { $regex: safe, $options: 'i' } },
          { email: { $regex: safe, $options: 'i' } }
        ];
      }
      if (role && CONFIG.validation.allowedRoles.includes(role)) {
        query.roles = role;
      }

      // Exécution query avec pagination
      const [users, total] = await Promise.all([
        User.find(query)
          .select('email roles profile security.emailVerified createdAt security.lastLogin')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        User.countDocuments(query)
      ]);

      // Sanitisation des utilisateurs
      const sanitizedUsers = users.map(user => AdminUtilities.sanitizeUserForAdmin(user));

      // Mise en cache
      await AdminCacheManager.setCachedUserList(cacheKey, sanitizedUsers);

      // Audit log
      await AdminUtilities.logAdminAction('LIST_USERS', req, {
        page: pageNum,
        limit: limitNum,
        search: search || null,
        role: role || null,
        resultCount: sanitizedUsers.length
      });

      console.log(`✅ [${req.requestId}] ${sanitizedUsers.length} utilisateurs listés`);

      return res.json({
        success: true,
        data: sanitizedUsers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          hasMore: pageNum * limitNum < total
        },
        filters: {
          search: search || null,
          role: role || null
        },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur liste utilisateurs:`, error);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération liste utilisateurs',
        details: error.message,
        requestId: req.requestId
      });
    }
  }

  // Update user roles
  static async handleUpdateUserRole(req, res) {
    const { id } = req.params;
    const roles = req.validatedRoles;
    console.log(`👤 [${req.requestId}] Mise à jour rôles utilisateur ${id} par ${req.user?.email}`);

    try {
      const User = require('../models/User');
      
      const existingUser = await User.findById(id).select('email roles profile');
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
          type: 'USER_NOT_FOUND',
          userId: id,
          requestId: req.requestId
        });
      }

      if (existingUser._id.toString() === req.user?.sub) {
        return res.status(403).json({
          success: false,
          error: 'Impossible de modifier ses propres rôles',
          type: 'CANNOT_MODIFY_OWN_ROLES',
          requestId: req.requestId
        });
      }

      const oldRoles = existingUser.roles || [];

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { 
          roles,
          'security.lastRoleUpdate': new Date(),
          'security.lastRoleUpdateBy': req.user?.sub
        },
        { new: true, runValidators: true }
      ).select('email roles profile security.emailVerified createdAt');

      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          error: 'Échec mise à jour utilisateur',
          type: 'UPDATE_FAILED',
          requestId: req.requestId
        });
      }

      await AdminCacheManager.invalidateUserCache(id);

      await AdminUtilities.logAdminAction('UPDATE_USER_ROLES', req, {
        targetUserId: id,
        targetUserEmail: existingUser.email,
        oldRoles,
        newRoles: roles,
        rolesAdded: roles.filter(r => !oldRoles.includes(r)),
        rolesRemoved: oldRoles.filter(r => !roles.includes(r))
      });

      console.log(`✅ [${req.requestId}] Rôles mis à jour: ${existingUser.email} (${oldRoles.join(',')} → ${roles.join(',')})`);

      return res.json({
        success: true,
        message: 'Rôles utilisateur mis à jour avec succès',
        user: AdminUtilities.sanitizeUserForAdmin(updatedUser),
        changes: {
          oldRoles,
          newRoles: roles,
          rolesAdded: roles.filter(r => !oldRoles.includes(r)),
          rolesRemoved: oldRoles.filter(r => !roles.includes(r))
        },
        updatedBy: req.user?.email,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur mise à jour rôles:`, error);

      let statusCode = 500;
      let errorType = 'UPDATE_ERROR';

      if (error.name === 'ValidationError') {
        statusCode = 400;
        errorType = 'VALIDATION_ERROR';
      } else if (error.name === 'CastError') {
        statusCode = 400;
        errorType = 'INVALID_USER_ID';
      }

      return res.status(statusCode).json({
        success: false,
        error: 'Erreur lors de la mise à jour des rôles',
        type: errorType,
        details: error.message,
        userId: id,
        requestId: req.requestId
      });
    }
  }

  // Info admin
  static async handleAdminInfo(req, res) {
    console.log(`ℹ️ [${req.requestId}] Info admin demandée par ${req.user?.email}`);

    try {
      const adminInfo = {
        service: 'Ba7ath Administration API',
        version: '3.0.0-admin',
        description: 'Service d\'administration utilisateurs avec audit complet',
        endpoints: {
          'GET /users': {
            description: 'Liste paginée des utilisateurs avec filtres',
            authentication: 'required',
            roles: ['admin', 'forensic_admin'],
            privacyMode: ['JUDICIAL', 'COMMERCIAL'],
            rateLimit: `${CONFIG.rateLimits.adminGeneral.limit} requêtes/heure`,
            pagination: {
              defaultLimit: CONFIG.pagination.defaultLimit,
              maxLimit: CONFIG.pagination.maxLimit
            },
            filters: ['search', 'role'],
            cache: `${CONFIG.cache.userListTTL}s`
          },
          'PATCH /users/:id/role': {
            description: 'Modification des rôles utilisateur avec audit',
            authentication: 'required',
            roles: ['admin'],
            privacyMode: ['JUDICIAL'],
            rateLimit: `${CONFIG.rateLimits.userOperations.limit} opérations/heure`,
            validation: {
              allowedRoles: CONFIG.validation.allowedRoles,
              maxRolesPerUser: CONFIG.validation.maxRolesPerUser
            }
          }
        },
        configuration: {
          rateLimits: CONFIG.rateLimits,
          pagination: CONFIG.pagination,
          validation: CONFIG.validation,
          cache: CONFIG.cache
        },
        security: {
          auditLogging: 'enabled',
          roleValidation: 'enabled',
          cacheInvalidation: 'enabled',
          privacyModeEnforced: true,
          selfModificationPrevented: true
        },
        system: AdminUtilities.getSystemInfo(),
        requestId: req.requestId,
        requestedBy: req.user?.email,
        timestamp: new Date().toISOString()
      };

      return res.json(adminInfo);
    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur info admin:`, error);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération informations admin',
        details: error.message,
        requestId: req.requestId
      });
    }
  }
}

// ================================
// ROUTES
// ================================
router.get(
  '/users',
  ...AdminRoutesMiddleware.userManagementPipeline,
  middlewareService.asyncHandler(AdminHandlers.handleListUsers)
);

router.patch(
  '/users/:id/role',
  validateForensicObjectId('id'),
  ...AdminRoutesMiddleware.roleUpdatePipeline,
  middlewareService.asyncHandler(AdminHandlers.handleUpdateUserRole)
);

router.get(
  '/info',
  ...AdminRoutesMiddleware.adminGeneralPipeline,
  middlewareService.asyncHandler(AdminHandlers.handleAdminInfo)
);

// ================================
// ERROR HANDLER
// ================================
class AdminErrorHandler {
  static enrichErrorContext(error, req) {
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
      type: error.type || 'ADMIN_ERROR',
      context: {
        route: 'admin',
        method: req.method,
        path: req.path,
        userId: req.user?.sub || 'anonymous',
        email: req.user?.email || 'unknown',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']?.substring(0, 100),
        adminOperation: true
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  }

  static getStatusCodeForError(error) {
    if (error.type?.includes('VALIDATION_') || error.type?.includes('INVALID_') || error.type?.includes('REQUIRED')) return 400;
    if (error.type?.includes('UNAUTHORIZED')) return 401;
    if (error.type?.includes('FORBIDDEN') || error.type?.includes('CANNOT_')) return 403;
    if (error.type?.includes('NOT_FOUND')) return 404;
    if (error.type?.includes('CONFLICT')) return 409;
    if (error.type?.includes('RATE_LIMIT')) return 429;
    if (error.type?.includes('SERVICE_')) return 503;
    return 500;
  }
}

router.use(async (error, req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
  console.error(`❌ [${requestId}] Erreur route admin:`, error);

  try {
    await AdminUtilities.logAdminAction('ADMIN_ERROR', req, {
      error: error.message,
      type: error.type,
      stack: error.stack?.substring(0, 500)
    });
  } catch (auditError) {
    console.warn(`⚠️ Erreur audit log:`, auditError.message);
  }

  const enrichedError = AdminErrorHandler.enrichErrorContext(error, req);
  const statusCode = AdminErrorHandler.getStatusCodeForError(error);

  if (!res.headersSent) {
    res.status(statusCode).json(enrichedError);
  }
});

// ================================
// EXPORT
// ================================
module.exports = router;

// Logs init
console.log('✅ Admin routes chargées avec config intégrée');
