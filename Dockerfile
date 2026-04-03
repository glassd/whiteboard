# Stage 1: Build frontend and server
FROM oven/bun:1-alpine AS builder

# Need Node.js for vite build and tsc
RUN apk add --no-cache nodejs

WORKDIR /app

# Install frontend dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Install server dependencies
COPY server/package.json server/bun.lock ./server/
RUN cd server && bun install --frozen-lockfile

# Copy source files
COPY . .

# Build frontend
RUN bun run build

# Build server
RUN cd server && bun run build

# Stage 2: Production image
FROM node:22-alpine AS runner

WORKDIR /app

# Copy server package files and install production deps
COPY server/package.json ./server/
RUN cd server && npm install --omit=dev

# Copy built server
COPY --from=builder /app/server/dist ./server/dist

# Copy built frontend to where the server expects it
COPY --from=builder /app/dist ./client

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
