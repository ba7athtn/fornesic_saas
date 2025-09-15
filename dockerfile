# =========================================
# STAGE 1: Builder - installe toutes les deps
# =========================================
FROM node:18-alpine AS builder

# Réglages réseau npm (résilience)
ENV NPM_CONFIG_FETCH_TIMEOUT=60000 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_FETCH_RETRIES=10 \
    NODE_ENV=production

# Dépendances système (sharp/canvas/exifr/openssl…)
RUN apk add --no-cache \
    build-base \
    python3 \
    make \
    g++ \
    pkgconfig \
    libc6-compat \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

WORKDIR /app

# .npmrc d’abord (si privé/proxy)
COPY .npmrc ./

# Packages en premier pour cache efficace
COPY package*.json ./

# Installer seulement prod deps dans le builder
RUN npm config set registry https://registry.npmjs.org && \
    npm ci --omit=dev --verbose && \
    npm cache clean --force

# Copier le code (sans uploads via .dockerignore)
COPY . .

# =========================================
# STAGE 2: Runner - image finale minimale
# =========================================
FROM node:18-alpine AS runner

# Tools runtime légers
RUN apk add --no-cache dumb-init

# Créer user non-root
RUN addgroup -g 1001 -S nodejs && adduser -S backend -u 1001

WORKDIR /app

# Copier uniquement ce qui est nécessaire depuis builder
# - node_modules (prod)
# - code applicatif
COPY --from=builder --chown=backend:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=backend:nodejs /app/package*.json /app/
COPY --from=builder --chown=backend:nodejs /app/.npmrc /app/.npmrc
COPY --from=builder --chown=backend:nodejs /app/ ./

# Préparer répertoires runtime (montés en volume côté compose/prod)
RUN mkdir -p uploads/temp uploads/processed uploads/thumbnails uploads/reports logs && \
    chown -R backend:nodejs uploads/ logs/ && \
    chmod -R 755 uploads/ logs/

# Variables recommandées
ENV NODE_ENV=production \
    PORT=5000

# Utilisateur non-root
USER backend

# Exposer le port applicatif
EXPOSE 5000

# Healthcheck simple (vous pouvez le déplacer dans compose)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD wget -qO- http://127.0.0.1:5000/api/health/live || exit 1

# Entrypoint/Command
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
