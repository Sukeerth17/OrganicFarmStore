# 🌿 Organic Farm Direct

A premium, full-stack e-commerce platform for farm-to-table organic produce with luxury design and seamless user experience.

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)
![Express](https://img.shields.io/badge/express-4.18.2-blue)

## ✨ Features

### User Features
- ✅ **Premium Luxury Design** - Brown & Gold royal theme
- ✅ **User Authentication** - Secure sign up/sign in system
- ✅ **Product Catalog** - Beautiful 3-column grid with smooth animations
- ✅ **Shopping Cart** - Real-time cart management with quantity controls
- ✅ **Multiple Payment Options** - Cash on Delivery & UPI payments
- ✅ **Order Tracking** - View complete order history
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Toast Notifications** - Beautiful user feedback system

### Technical Features
- 🔐 Phone-based authentication
- 💾 JSON-based file storage (easy to migrate to MongoDB)
- 🎨 CSS3 animations and transitions
- 📱 Mobile-first responsive design
- 🚀 Fast page loads with optimized images
- 🛡️ Input validation and error handling

## 📁 Project Structure

```
OrganicFarmStore/
├── database/              # JSON database files
│   ├── users.json        # User accounts
│   ├── products.json     # Product catalog
│   └── orders.json       # Order history
│
├── backend/              # Node.js + Express server
│   ├── server.js         # Main server file
│   ├── package.json      # Dependencies
│   └── package-lock.json
│
└── frontend/             # Client-side application
    ├── HTML/             # All HTML pages
    │   ├── index.html
    │   ├── products.html
    │   ├── cart.html
    │   ├── checkout.html
    │   ├── orders.html
    │   ├── signin.html
    │   ├── signup.html
    │   ├── about.html
    │   ├── contact.html
    │   └── components/
    │       ├── header.html
    │       └── footer.html
    │
    ├── CSS/              # Stylesheets
    │   ├── style.css     # Global styles
    │   ├── home.css
    │   ├── products.css
    │   ├── cart.css
    │   ├── checkout.css
    │   ├── orders.css
    │   ├── signin.css
    │   ├── about.css
    │   ├── contact.css
    │   └── components/
    │       ├── header.css
    │       └── footer.css
    │
    └── JSS/              # JavaScript files
        ├── utils.js      # Utility functions & API calls
        ├── home.js
        ├── products.js
        ├── cart.js
        ├── checkout.js
        ├── orders.js
        ├── signin.js
        ├── signup.js
        ├── about.js
        ├── contact.js
        └── components/
            └── header.js
```

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No framework dependencies
- **Google Fonts** - Playfair Display & Poppins

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **JSON File System** - Database storage

## 📦 Installation & Local Setup (Run locally — do NOT deploy)

### Why this section exists
This repository contains a full-stack demo. If you want to inspect or test it locally, follow the instructions below. Do NOT deploy this repository to a public host unless you intentionally want it live. See the next section for steps to prevent accidental deployments.

### Prerequisites
- Node.js (v18 or higher is recommended)
- npm (comes with Node.js)
- Git

### Step 1 — Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/OrganicFarmStore.git
cd OrganicFarmStore
```

### Step 2 — Install and start the backend
1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Start the backend server:
```bash
npm start
# This runs `node server.js` and by default listens on http://localhost:3000
```

Leave this terminal open — the API must be running for the frontend to interact with it.

### Step 3 — View the frontend (pick one)
Option A — Open the HTML file directly (quickest):

```bash
# On macOS: this opens the default browser with the page
open frontend/HTML/index.html
```

Notes: opening the file directly works for many static pages. If the frontend makes API calls to the backend (http://localhost:3000), make sure the backend is running. If you see CORS or network errors, use Option B or C.

Option B — Serve the frontend with a lightweight static server (recommended):

```bash
# From project root
npx serve frontend/HTML -l 5500
# or
cd frontend/HTML && python3 -m http.server 5500
# Open http://localhost:5500
```

Option C — Use the VS Code "Live Server" extension: right-click `frontend/HTML/index.html` and choose "Open with Live Server".

### Quick verification
- Backend running: visit http://localhost:3000 (or check console where you started it)
- Frontend served: visit http://localhost:5500 (if using a static server) or opened file URL

### Troubleshooting
- If the frontend cannot reach the backend, check the browser console for CORS or network errors. The backend depends on the CORS middleware — ensure it's running on port 3000.
- If ports are in use, pick different ones and update the URLs accordingly.

---

## ❗ Important — Do NOT deploy this repository (how to prevent accidental deployment)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

