# AgileVendor

VendorBridge is a procurement-focused ERP app for managing vendors, RFQs, approvals, purchase orders, invoices, activity logs, and reports.

## Project Structure

- `frontend/` contains the Vue 3 application
- `backend/` contains the Express and MongoDB API
- `agent.md` contains the frontend design direction and UI rules

## Frontend Stack

The frontend uses:

- Vue 3
- TypeScript
- Vite
- Vue Router
- TailwindCSS
- Axios

## Dependencies

### Main dependencies

- `vue`
- `vue-router`
- `axios`

### Dev dependencies

- `vite`
- `typescript`
- `vue-tsc`
- `@vitejs/plugin-vue`
- `tailwindcss`
- `@tailwindcss/postcss`
- `postcss`
- `autoprefixer`
- `@vue/tsconfig`
- `@types/node`

## Install

From the repo root:

```bash
npm install --prefix frontend
npm install --prefix backend
```

Or from inside each app folder:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

## Run The Project

Start both apps together from the repo root:

```bash
npm install
npm run dev
```

This runs the backend on `http://localhost:5000` and the frontend on `http://localhost:5173`. The frontend proxies `/api` requests to the backend during development.

You can also run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

Or from their app folders:

```bash
cd frontend
npm run dev
```

```bash
cd backend
npm run dev
```

## Build

From the repo root:

```bash
npm run build
```

From inside the frontend folder:

```bash
cd frontend
npm run build
```

## Preview Production Build

From the repo root:

```bash
npm run preview
```

From inside the frontend folder:

```bash
cd frontend
npm run preview
```

## Environment Setup

Copy the example env files before your first run:

```bash
cp backend/.env.example backend/.env
```

Update `MONGO_URI` and `JWT_SECRET` in `backend/.env`. The frontend does not need a `.env` file for local development because Vite proxies `/api` to the backend.

## API Connection

| Feature | Status |
|---------|--------|
| Auth (login, signup, logout, session) | Connected to backend |
| Vendors (list, detail, create) | Connected to backend |
| RFQs, approvals, invoices, reports, activity | Mock data (no backend routes yet) |

## Notes

- The main app source is inside `frontend/src`
- Auth uses HTTP-only cookies plus a JWT bearer token stored in the browser
- RFQs, approvals, invoices, reports, and activity feeds are still using mock frontend data until backend routes are added.
