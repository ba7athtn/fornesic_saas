// src/models/VerificationCode.js
"use strict";

const mongoose = require('mongoose');

const VerificationCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    purpose: {
      type: String,
      enum: ['email_verification', 'phone_verification'],
      required: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    consumedAt: {
      type: Date,
      default: null
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// Index TTL optionnel si souhaité (supprime auto après expiration + marge)
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema);
