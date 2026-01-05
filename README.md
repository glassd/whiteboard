# Whiteboard

A real-time collaborative drawing board built with React, Socket.io, and HTML5 Canvas.

## Features

- **Real-time collaboration** - Multiple users draw simultaneously with instant sync
- **Room-based sessions** - Create or join rooms via shareable URLs
- **Drawing tools** - Pen, eraser, 12 colors, adjustable brush size
- **Undo/redo** - Full history with keyboard shortcuts (Cmd/Ctrl+Z)
- **User presence** - See who's in the room with live cursor tracking
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

```bash
# Build frontend
bun run build

# Build server
cd server && bun run build && cd ..
```

**Frontend:** Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages).

Set environment variables during build:
```bash
VITE_SOCKET_URL=https://your-server.com bun run build
```

To deploy to a subpath (e.g., `www.example.com/whiteboard`):
```bash
VITE_BASE_PATH=/whiteboard/ VITE_SOCKET_URL=https://your-server.com bun run build
```
Then copy the contents of `dist/` to your `/whiteboard` directory.

**Backend:** Run the compiled server:
```bash
cd server && node dist/index.js
```

Environment variables:
- `PORT` - Server port (default: 3001)
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:5173)
