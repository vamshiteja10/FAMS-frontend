# FarmAssist Frontend – Farmer Resource & Crop Management System

Single Page Application built using React.js, Plain CSS, and Axios.

## Technology Stack
- React 18
- Vite
- Plain CSS (Modular UI components, no Bootstrap, no Tailwind)
- Axios for REST API communication

## Run Locally
```bash
npm install
npm run dev
```
Or on Windows:
```cmd
npm.cmd run dev
```
The application will run on `http://localhost:5173`.

## Environment Variables
- `VITE_API_BASE_URL`: Base URL for the Spring Boot REST API
  - Local default: `/api` (proxied to `http://localhost:8080`)
  - Production (Render): `https://<your-backend-app>.onrender.com/api`

## Production Build
```bash
npm run build
```
Build output is generated inside `dist/`.
