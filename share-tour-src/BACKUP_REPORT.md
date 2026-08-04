# Project Backup & Recovery Report

This report serves as a complete recovery and infrastructure guide for the **Smart Journey Booking System**. This safeguards the system if it needs to be migrated to another server or run locally in its entirety, without relying on the original AI platform.

---

## 1. System Metadata

| Parameter | Specification |
| :--- | :--- |
| **Project Name** | Smart Journey Booking System |
| **Frontend Framework** | React 19 (TypeScript) with Vite 6 & Tailwind CSS 4 |
| **Backend Framework** | Express 4 (Node.js) custom ESM server |
| **Database Type** | Local Document-backed JSON Flat-File Transaction Database |
| **Location of All Data** | `/src/db.json` (Inside the repository code folders) |
| **Required Node.js Version** | Node.js v18.x / v20.x / v22.x (LTS) |
| **Required Package Manager** | `npm` (v10 or newer) |

---

## 2. Configuration & Environment Variables

Create a file named `.env` at the root of the project to declare configuration values.

```env
# Optional: Host URL of the server (Default: http://localhost:3000)
APP_URL="http://localhost:3000"

# Optional: Configured keys for future server-side Google Gemini AI tools
GEMINI_API_KEY=""
```

---

## 3. Installation, Build & Deployment Instructions

### A. Local Setup & Installation
Run these commands in your operating system's terminal inside the root folder:

```bash
# 1. Install all dependencies defined in package.json
npm install
```

### B. Compilation & Production Build
To prepare the system for production deployment, bundle the backend and build the React SPA:

```bash
# 1. Build client files into /dist, compile backend into /dist/server.cjs
npm run build
```

### C. Live Server Execution
Launch the compiled full-stack server into production mode:

```bash
# 1. High-speed CJS server run using standard Node.js
npm start
```
By default, the server listens on **Port 3000** (`http://localhost:3000`).

---

## 4. Portability / Recovery Guide & Backup Strategy

### Data Integrity & Backups
Because the database is stored entirely within the code workspace directory rather than an external cloud database cluster, backing up is extremely simple:
- **Primary Data Source**: `/src/db.json`
- **Important Assets**: `/public/images/wechat.png` (Custom WeChat link code)

Simply copying or placing the `src/db.json` file on a backup drive, OneDrive, Google Drive, or committing it to a private Git Repository preserves **100% of the custom trips, admin settings, batch status controls, quotas, and user booking data**.

### Moving to a New Computer / Recovery Steps
If you move this project to a brand-new computer, follow this exact recovery checklist:
1. Copy the entire project folder to the new computer.
2. Ensure Node.js is installed on the new machine.
3. Verify that `src/db.json` and `public/images/wechat.png` are present in their target locations.
4. Execute `npm install` to download all standard packages.
5. Launch development using `npm run dev` or compile production using `npm run build` followed by `npm start`.
6. That's it! All trip data and historic book details are fully loaded and operational immediately on the new computer.
