# AgileVendor

VendorBridge is a procurement-focused ERP frontend for managing vendors, RFQs, approvals, purchase orders, invoices, activity logs, and reports.

## Project Structure

- `frontend/` contains the Vue 3 application
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
```

Or from inside the frontend folder:

```bash
cd frontend
npm install
```

## Run The Project

From the repo root:

```bash
npm run dev
```

From inside the frontend folder:

```bash
cd frontend
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

## Notes

- The main app source is inside `frontend/src`
- Mock data is currently used instead of backend integration
- The root `package.json` forwards commands to the `frontend` app
