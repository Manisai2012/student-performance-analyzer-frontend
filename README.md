# Student Performance Analyzer — Frontend Web Application

A responsive, high-performance **React 19 Single Page Application (SPA)** powered by **Vite** and **Bootstrap 5**, providing academic analytics, diagnostic visualizations, and rule-based performance optimization recommendations for students.

---

## 🎨 Tech Stack & Libraries

| Category | Tools & Libraries |
|---|---|
| **Framework & Core** | React 19, Vite 6 |
| **Routing** | React Router DOM 7 (Client-side SPA Routing) |
| **Styling & UI** | Bootstrap 5, Custom Responsive CSS |
| **Data Visualization** | Recharts (Bar Charts, Line Trends, Grade Distribution) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios (with Bearer Token Interceptors) |
| **Linting** | Oxlint |

---

## 📁 Project Structure

```text
student-performance-analyzer-frontend/
├── public/
│   ├── favicon.svg            # Web application favicon
│   ├── icons.svg              # SVG sprite library
│   └── _redirects             # SPA fallback rewrites for Render/Netlify
├── src/
│   ├── assets/                # Static assets & brand styling
│   ├── components/            # Reusable UI components (Navbar, Sidebar, Modals)
│   ├── pages/                 # Route pages (Dashboard, MarksEntry, Booster, Login, Register)
│   ├── services/              # Axios API service clients & auth token helpers
│   ├── App.jsx                # Main route definitions & protected route wrapper
│   ├── App.css                # Global layout styling
│   ├── index.css              # Typography & theme rules
│   └── main.jsx               # React DOM entry point
├── .env.example               # Environment variables template
├── .env.production            # Production backend API endpoint
├── index.html                 # HTML entry point with metadata
├── package.json               # Dependencies & scripts
├── vercel.json                # Vercel SPA routing configuration
├── vite.config.js             # Vite build pipeline with 404.html generator
└── README.md                  # Frontend documentation
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)

### 2. Install Dependencies
```powershell
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or use default development fallback):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Start Development Server
```powershell
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Production Build

```powershell
# Create optimized production bundle
npm run build

# Preview production build locally
npm run preview
```
The build output will be generated inside the `dist/` directory, including an automatically generated `404.html` SPA fallback for static hosting providers.

---

## 🌐 Cloud Deployment Guide

### Option 1: Vercel (Recommended)
1. Import this repository into [Vercel](https://vercel.com).
2. Root Directory: `.` (leave default)
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-backend-url>/api`

### Option 2: Render Static Site
1. Connect this repository to [Render](https://render.com) as a **Static Site**.
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. In Routes, add rewrite rule:
   - Source: `/*` &rarr; Destination: `/index.html` (Status: `200`)
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-backend-url>/api`
