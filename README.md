# Naiyo24 Website Admin Dashboard

This is the administrative dashboard panel for the Naiyo24 website, built using React, Vite, and React Router.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM (v6)
- **Icons:** Lucide React

## Project Structure

```
├── public/              # Static public assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── config/          # Configuration files (API endpoints, constants)
│   ├── layouts/         # Layout components (e.g., AdminLayout)
│   ├── pages/           # Page/view components
│   ├── routes/          # Route definitions & configurations
│   ├── App.jsx          # Main App component
│   ├── index.css        # Global styles
│   └── main.jsx         # App entry point
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:
```bash
npm run dev
```
The server will run on `http://localhost:5174/` by default and is configured to be accessible on your local network (via `--host`).

### Production Build

Build the production-ready bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:
```bash
npm run lint
```
