# Whiteboard

A real-time collaborative drawing board built with React, Socket.io, and HTML5 Canvas.

## Features

- **Real-time collaboration** - Multiple users draw simultaneously with instant sync
- **Room-based sessions** - Create or join rooms via shareable URLs
- **Drawing tools** - Pen, eraser, 12 colors, adjustable brush size
- **Undo/redo** - Full history with keyboard shortcuts (Cmd/Ctrl+Z)
- **User presence** - See who's in the room with live cursor tracking
- **Rename yourself** - Click the pencil icon next to your name
- **Dark mode** - Toggle between light and dark themes

## Tech Stack

**Frontend:** React 19, React Router 7, Zustand, Tailwind CSS, Socket.io Client

**Backend:** Express 5, Socket.io

## Quick Start

```bash
# Install dependencies
bun install
cd server && bun install && cd ..

# Start backend (terminal 1)
bun run dev:server

# Start frontend (terminal 2)
bun run dev
```

Open http://localhost:5173

## Usage

1. Click **Create Room** to start a new whiteboard
2. Share the URL with collaborators
3. Draw together in real-time

## Production Deployment

### Build

```bash
# Build frontend
VITE_SOCKET_URL=https://your-server.com bun run build

# Build server
cd server && bun run build
```

### Frontend

Deploy the `dist/` folder to any static host. Configure SPA fallback to serve `index.html` for all routes.

**Subpath deployment** (e.g., `example.com/whiteboard`):
```bash
VITE_BASE_PATH=/whiteboard/ VITE_SOCKET_URL=https://your-server.com bun run build
```

Nginx config for subpath:
```nginx
location /whiteboard {
    alias /path/to/dist;
    try_files $uri $uri/ /whiteboard/index.html;
}
```

### Backend

```bash
cd server
CLIENT_URL=https://your-domain.com node dist/index.js
```

**Environment variables:**
- `PORT` - Server port (default: 3001)
- `CLIENT_URL` - Allowed origins for CORS, comma-separated (default: http://localhost:5173)

**Nginx config for WebSocket proxy:**
```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;
}
```
