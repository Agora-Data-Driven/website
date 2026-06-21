# syntax=docker/dockerfile:1
# Built remotely by Google Cloud Build — no local Docker/Node required.

# ---- Build stage ----
FROM node:22-slim AS build
WORKDIR /app
COPY package.json ./
# No lockfile yet: resolve + install, which also writes package-lock.json.
RUN npm install
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Astro Node standalone adapter reads HOST/PORT. Cloud Run injects PORT (8080).
ENV HOST=0.0.0.0
ENV PORT=8080
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]
