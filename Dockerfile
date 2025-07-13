# ────────────────────────────────────────────
# 1) BUILD stage
# ────────────────────────────────────────────
FROM node:20-alpine AS builder

# Where your code will live inside the container
WORKDIR /app

# Copy package manifests & lockfile first (for caching)
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm ci

# Copy everything else
COPY . .

# Recreate .env so your serviceAccount JSON is available at build time
# (CI will have already echoed .env into the workspace)
# If you’re building locally, make sure you have a .env with FIREBASE_SERVICE_ACCOUNT_JSON
# in the project root.
COPY .env .env

# Actually build your Nest app
RUN npm run build

# ────────────────────────────────────────────
# 2) RUNTIME stage
# ────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only package.json + lockfile, install PROD deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy over the compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# Copy any other runtime files you need (e.g. .env if you want env-file support here)
COPY .env .env

# Use the PORT that Render/Sevalla/Docker will set, default to 3000
ENV PORT=${PORT:-3000}

# Expose (optional—Render and Sevalla detect this automatically)
EXPOSE $PORT

# Start your app
CMD ["node", "dist/main.js"]
