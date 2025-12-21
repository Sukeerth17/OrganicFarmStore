# 🌿 Organic Farm Direct

A premium, full-stack e-commerce platform for farm-to-table organic produce with luxury design and seamless user experience.

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)
![Express](https://img.shields.io/badge/express-4.18.2-blue)

## 🚀 Live Demo

- **Frontend**: [Your Vercel URL here]
- **Backend**: [Your Backend URL here]

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

## 📦 Installation & Local Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/OrganicFarmStore.git
cd OrganicFarmStore
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Start Backend Server
```bash
npm start
# Server runs on http://localhost:3000
```

### Step 4: Open Frontend
Open `frontend/HTML/index.html` in your browser, or use Live Server extension in VS Code.
