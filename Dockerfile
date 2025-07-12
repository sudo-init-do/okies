# ──────────────── STAGE 1: Build ────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only the manifests, install all deps (dev+prod)
COPY package.json package-lock.json ./
# bump npm retry settings
RUN npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm ci

# Copy source & compile
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# ──────────────── STAGE 2: Runtime ────────────────
FROM node:20-alpine

WORKDIR /app

# Copy only prod deps
COPY package.json package-lock.json ./
# same retry settings, install prod only
RUN npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm install --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
