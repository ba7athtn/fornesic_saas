"use strict";

// src/config/database.js
module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000
    }
  }
};

// src/config/constants.js
module.exports = {
  ROLES: {
    USER: 'user',
    ANALYST: 'forensic_analyst',
    ADMIN: 'admin'
  },
  SUBSCRIPTIONS: {
    FREE: 'free',
    PRO: 'pro',
    ENTERPRISE: 'enterprise'
  },
  LIMITS: {
    FREE: {
      uploads: 10,
      storage: '100mb'
    },
    PRO: {
      uploads: 100,
      storage: '10gb'
    },
    ENTERPRISE: {
      uploads: -1,
      storage: -1
    }
  }
};