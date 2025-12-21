const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse JSON request bodies

// Database file paths
const usersFile = path.join(__dirname, '../database/users.json');
const ordersFile = path.join(__dirname, '../database/orders.json');
const productsFile = path.join(__dirname, '../database/products.json');

// Helper function to read JSON files
function readJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

// Helper function to write JSON files
function writeJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// ========================================
// AUTHENTICATION ROUTES
// ========================================

// 1. SIGN UP - Create new user account
app.post('/api/signup', (req, res) => {
    const { name, phone, password } = req.body;

    // Validation
    if (!name || !phone || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    // Validate phone number (10 digits)
    if (!/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid phone number. Must be 10 digits starting with 6-9' 
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 6 characters' 
        });
    }

    const users = readJSON(usersFile);

    // Check if user already exists
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
        return res.status(400).json({ 
            success: false, 
            message: 'User with this phone number already exists' 
        });
    }

    // Create new user
    const newUser = { name, phone, password }; // In production, hash the password!
    users.push(newUser);

    // Save to database
    if (writeJSON(usersFile, users)) {
        res.status(201).json({ 
            success: true, 
            message: 'Account created successfully!',
            user: { name, phone }
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create account. Please try again.' 
        });
    }
});

// 2. SIGN IN - User login
app.post('/api/login', (req, res) => {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone and password are required' 
        });
    }

    const users = readJSON(usersFile);

    // Find user
    const user = users.find(u => u.phone === phone && u.password === password);

    if (user) {
        res.json({ 
            success: true, 
            message: 'Login successful!',
            user: { name: user.name, phone: user.phone }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid phone number or password' 
        });
    }
});

// ========================================
// PRODUCT ROUTES
// ========================================

// 3. GET ALL PRODUCTS
app.get('/api/products', (req, res) => {
    const products = readJSON(productsFile);
    res.json({ 
        success: true, 
        products 
    });
});

// 4. GET SINGLE PRODUCT
app.get('/api/products/:id', (req, res) => {
    const products = readJSON(productsFile);
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (product) {
        res.json({ 
            success: true, 
            product 
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Product not found' 
        });
    }
});

// ========================================
// ORDER ROUTES
// ========================================

// 5. PLACE NEW ORDER
app.post('/api/orders', (req, res) => {
    const { phone, items, amount } = req.body;

    // Validation
    if (!phone || !items || !amount) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone, items, and amount are required' 
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Cart is empty' 
        });
    }

    const allOrders = readJSON(ordersFile);

    // Create new order
    const newOrder = {
        orderId: 'ORD' + Date.now(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        items: items,
        amount: amount,
        status: 'Processing'
    };

    // Find user's order history or create new
    let userOrders = allOrders.find(o => o.phone === phone);

    if (userOrders) {
        userOrders.orders.push(newOrder);
    } else {
        allOrders.push({
            phone: phone,
            orders: [newOrder]
        });
    }

    // Save to database
    if (writeJSON(ordersFile, allOrders)) {
        res.status(201).json({ 
            success: true, 
            message: 'Order placed successfully!',
            orderId: newOrder.orderId
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to place order. Please try again.' 
        });
    }
});

// 6. GET USER'S ORDER HISTORY
app.get('/api/orders/:phone', (req, res) => {
    const { phone } = req.params;

    const allOrders = readJSON(ordersFile);
    const userOrders = allOrders.find(o => o.phone === phone);

    if (userOrders && userOrders.orders.length > 0) {
        res.json({ 
            success: true, 
            orders: userOrders.orders 
        });
    } else {
        res.json({ 
            success: true, 
            orders: [],
            message: 'No orders found' 
        });
    }
});

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'API endpoint not found' 
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🌿 ORGANIC FARM DIRECT - SERVER        ║
║                                            ║
║   ✅ Server running on port ${PORT}         ║
║   🌐 http://localhost:${PORT}              ║
║                                            ║
║   📡 API Endpoints:                        ║
║   • POST /api/signup                       ║
║   • POST /api/login                        ║
║   • GET  /api/products                     ║
║   • POST /api/orders                       ║
║   • GET  /api/orders/:phone                ║
║                                            ║
╚════════════════════════════════════════════╝
    `);
});