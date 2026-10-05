# Glint

> **A professional, lightweight API testing client built with React and Express, featuring automated failure diagnostics powered by Google Gemini AI.**

Glint provides a clean, minimal developer workbench for constructing, sending, and inspecting HTTP requests. Modeled after industry-standard tools like Postman, it combines a unified address bar and response inspector with intelligent AI diagnostics that automatically analyze failed requests to identify root causes and suggest actionable fixes.

---

## Key Features

- **Unified Address Bar**: Seamless joined input containing the HTTP Method dropdown (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`), monospace URL field, and primary Send action.
- **Automated AI Diagnostics**: When an endpoint returns a `4xx` or `5xx` error, Google Gemini AI automatically diagnoses the failure, explaining the root cause (e.g. invalid query parameter, missing authentication header, malformed payload) and providing corrected request examples.
- **Dual-Mode Execution (CORS Bypass)**:
  - **Direct Mode**: Fast client-side execution directly from the browser using Axios.
  - **Server Proxy Mode**: Routes requests through the Express backend proxy (`POST /api/request/execute`) to completely bypass browser CORS restrictions.
- **Key-Value Headers Table**: Postman-style tabular headers editor with auto-complete datalists and quick presets (`Content-Type: JSON`, `Bearer Token`).
- **Raw JSON Body Editor**: In-place code editor with real-time JSON syntax validation, error messages, and one-click JSON beautification.
- **Response Inspector**: Multi-tab workbench displaying response status codes, round-trip latency (ms), interactive Monokai JSON tree viewer, raw text, and returned response headers.
- **Persistent Request History**: Automatically saves dispatched requests to `localStorage` (up to 50 items). Includes instant search filtering and one-click configuration restore.
- **Postman-Grade Dark Theme**: Flat, high-contrast dark theme designed for developer focus, with zero decorative gradients, neon glows, or visual clutter.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Axios, React-JSON-View, React-Markdown |
| **Backend** | Node.js, Express 4.x, Axios, CORS, Dotenv |
| **AI Integration** | Google Generative AI (`@google/generative-ai`) via `gemini-3.1-flash-lite` |
| **Database** | Optional Mongoose/MongoDB integration; local-first storage by default |

---

## System Architecture

For complete high-level and low-level architectural specifications, data contracts, and component lifecycles, refer to [architecture.md](architecture.md).

```text
Browser Client (React 18 : Port 3000)
    │
    ├── Direct HTTP Call ───────────────► Target API Server
    │                                          │
    ├── Server Proxy Call ──┐                  │ (Response)
    │                       ▼                  ▼
    │               Express Server (Port 5000)
    │                       │
    └── AI Diagnostic ──────┴──────────► Google Gemini API (gemini-3.1-flash-lite)
```

---

## Getting Started

### Prerequisites
- **Node.js** (v16+ recommended)
- **npm** (v7+)
- **Google Gemini API Key** (obtain free from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/anuptiwari17/glint.git
cd glint
```

### 2. Backend Configuration & Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.1-flash-lite
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   *The server will start on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   npm install
   ```
   *(Note: `.npmrc` is pre-configured with `legacy-peer-deps=true` for React 18 compatibility).*

2. Start the React development server:
   ```bash
   npm start
   ```
   *The application will open automatically at `http://localhost:3000`.*

---

## API Reference (Backend)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check and status confirmation |
| `POST` | `/api/request/execute` | Server-side HTTP proxy to execute requests and bypass browser CORS |
| `POST` | `/api/ai/suggest` | Analyzes a failed request/response payload with Gemini AI |
| `GET` | `/api/request` | Retrieves saved requests (when MongoDB is configured) |
| `POST` | `/api/request` | Persists a request configuration to database |

---

## Project Structure

```text
Glint/
├── client/                 # React frontend application
│   ├── public/             # Static HTML template and assets
│   ├── src/
│   │   ├── components/     # UI components (Address bar, Editors, Viewers, History)
│   │   ├── context/        # ThemeContext provider
│   │   ├── utils/          # API dispatcher (apiCaller.js) and helpers
│   │   ├── App.jsx         # Central workbench state manager
│   │   └── index.css       # Tailwind and Postman dark styles
│   └── package.json
│
├── server/                 # Express backend application
│   ├── controllers/        # Request proxy & Gemini AI controllers
│   ├── middleware/         # Centralized error handler
│   ├── models/             # Optional Mongoose schemas (Request, User)
│   ├── routes/             # Route declarations
│   ├── index.js            # Server entrypoint
│   └── package.json
│
├── architecture.md         # Full technical architecture specification
├── Glint.md                # Issue resolution log and audit report
└── README.md               # Project documentation
