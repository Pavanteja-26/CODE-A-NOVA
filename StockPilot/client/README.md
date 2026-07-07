# StockPilot – Client

React SPA built with Vite and Tailwind CSS.

## Setup

```bash
npm install
cp .env.example .env
```

Set your backend URL in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
npm run dev
```
Runs the app in development mode on `http://localhost:5173`.

## Architecture
- `src/api/axios.js`: Configures Axios with a request interceptor for JWT injection and global 401 handling.
- `src/context/AuthContext.jsx`: Context provider for managing JWT state and localStorage persistence.
- `src/pages/*`: Public pages (Home, About, Services, Products, Contact, Login)
- `src/pages/dashboard/*`: Protected dashboard pages (Overview, Products, Suppliers, Sales, Purchases, Low Stock).

## Tailwind CSS Configuration
This project uses Tailwind v4 via `@tailwindcss/vite`.
Custom base colors and component utility classes (like `.btn-primary`, `.card`, `.input-field`) are defined directly in `src/index.css` using the `@layer` directive.

## Deployment (Netlify)
1. Push `/client` to a GitHub repo
2. Connect to Netlify, set root directory to `/client`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. The `netlify.toml` file automatically handles React Router SPA redirects.
