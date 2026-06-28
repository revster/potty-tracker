# Potty Tracker

A PWA for tracking potty events for two kids. Runs locally on your home PC; access from iPhones via Tailscale.

## Install & Run

```bash
# Install all dependencies (root + client)
npm install
npm --prefix client install

# Development (Vite dev server + Express API, hot reload)
npm run dev

# Production build
npm run build

# Production server (serves built client + API on port 3000)
npm start
```

The dev server runs on **http://localhost:5173** (proxied to Express on 3000).
Production runs entirely on **http://localhost:3000**.

## Auto-start on Windows (Task Scheduler)

1. Build the app first: `npm run build`
2. Open **Task Scheduler** → Create Basic Task
3. Set trigger: **When the computer starts**
4. Action: **Start a program**
   - Program: `node` (or full path: `C:\Program Files\nodejs\node.exe`)
   - Arguments: `node_modules\.bin\ts-node --project server/tsconfig.json server/index.ts`
   - Start in: `C:\path\to\potty-tracker`
5. Tick **Run whether user is logged on or not** and **Run with highest privileges**

Alternatively, use a batch file (`start.bat`) and point Task Scheduler at it:

```bat
@echo off
cd /d C:\path\to\potty-tracker
npm start
```

## Access via Tailscale from iPhone

1. Install **Tailscale** on the Windows mini PC and on your iPhone.
2. Sign in to the same Tailscale account on both devices.
3. Find your PC's Tailscale IP in the Tailscale app (e.g. `100.x.x.x`).
4. On iPhone Safari, open: `http://100.x.x.x:3000`

## Add to iPhone Home Screen

1. Open Safari on iPhone and navigate to `http://100.x.x.x:3000`
2. Tap the **Share** button (box with arrow pointing up)
3. Scroll down and tap **Add to Home Screen**
4. Name it **Potty** → tap **Add**

The app opens full-screen (no browser chrome) when launched from the home screen.

## Generating PNG Icons

The manifest references `icon-192.png` and `icon-512.png`. Generate them from the SVG:

```bash
# Using Inkscape (if installed)
inkscape client/public/icon.svg --export-png=client/public/icon-192.png -w 192 -h 192
inkscape client/public/icon.svg --export-png=client/public/icon-512.png -w 512 -h 512
```

Or use any online SVG-to-PNG converter and place the files in `client/public/`.
The `apple-touch-icon.png` (180×180) used for the iOS home screen icon should also go there.

## API Reference

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/log` | `{kid: 1\|2, type: "poop"\|"pee"}` | Log an event |
| GET | `/api/log` | — | Last 200 entries, newest first |
| DELETE | `/api/log/:id` | — | Delete an entry |
| GET | `/api/today-counts` | — | Today's counts per kid per type |

Data is stored in `potty.db` (SQLite) in the project root.
