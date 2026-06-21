# syntax=docker/dockerfile:1
# ---- Build stage ----
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Astro Node standalone adapter reads HOST/PORT. Cloud Run injects PORT (8080).
ENV HOST=0.0.0.0
ENV PORT=8080
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]
