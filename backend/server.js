// ===================================
// ORGANIC FARM DIRECT - PostgreSQL Backend
// Updated with Address Support
// ===================================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// DATABASE CONNECTION
// ===================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    } else {
        console.log('✅ Database connected successfully!');
        console.log('Database time:', res.rows[0].now);
    }
});

// ===================================
// MIDDLEWARE
// ===================================

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ===================================
// AUTHENTICATION ROUTES
// ===================================

// 1. SIGN UP
app.post('/api/signup', async (req, res) => {
    const { name, phone, password } = req.body;

    // Validation
    if (!name || !phone || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid phone number'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }

    try {
        // Check if user exists
        const checkUser = await pool.query(
            'SELECT phone FROM users WHERE phone = $1',
            [phone]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this phone number already exists'
            });
        }

        // Insert new user
        await pool.query(
            'INSERT INTO users (name, phone, password) VALUES ($1, $2, $3)',
            [name, phone, password]
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            user: { name, phone }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create account'
        });
    }
});

// 2. SIGN IN
app.post('/api/login', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({
            success: false,
            message: 'Phone and password are required'
        });
    }

    try {
        const result = await pool.query(
            'SELECT name, phone FROM users WHERE phone = $1 AND password = $2',
            [phone, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone number or password'
            });
        }

        res.json({
            success: true,
            message: 'Login successful!',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

// ===================================
// PRODUCT ROUTES
// ===================================

// 3. GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY id ASC'
        );

        res.json({
            success: true,
            products: result.rows
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// 4. GET SINGLE PRODUCT
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product: result.rows[0]
        });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
});

// ===================================
// ORDER ROUTES (UPDATED WITH ADDRESS)
// ===================================

// 5. PLACE NEW ORDER (UPDATED)
app.post('/api/orders', async (req, res) => {
    const { phone, items, amount, address } = req.body;

    // Validation
    if (!phone || !items || !amount || !address) {
        return res.status(400).json({
            success: false,
            message: 'Phone, items, amount, and address are required'
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Cart is empty'
        });
    }

    // Validate address fields
    const { name, addressPhone, line1, line2, city, state, pincode } = address;
    if (!name || !addressPhone || !line1 || !city || !state || !pincode) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all required address fields'
        });
    }

    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({
            success: false,
            message: 'Pincode must be 6 digits'
        });
    }

    // Validate phone (10 digits)
    if (!/^[6-9]\d{9}$/.test(addressPhone)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid phone number'
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Generate order ID
        const orderId = 'ORD' + Date.now();

        // Insert order with address
        await client.query(
            `INSERT INTO orders (
                order_id, user_phone, total_amount, status,
                delivery_name, delivery_phone, address_line1, address_line2,
                city, state, pincode
            ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                orderId, phone, amount, 'Processing',
                name, addressPhone, line1, line2 || '',
                city, state, pincode
            ]
        );

        // Insert order items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items 
                 (order_id, product_id, product_name, price, quantity) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [orderId, item.id, item.name, item.price, item.quantity]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId: orderId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Place order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order'
        });
    } finally {
        client.release();
    }
});

// ===================================
// CONTACT ROUTES
// -----------------------------------
// Store contact form submissions and list them for admin
// ===================================

// POST /api/contact - save a contact message
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({ success: false, message: 'Name and message are required' });
    }

    // basic validation for email and phone if provided
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    if (phone && !/^[0-9+\-()\s]{6,20}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    try {
        await pool.query(
            'INSERT INTO contacts (name, email, phone, message) VALUES ($1, $2, $3, $4)',
            [name, email || null, phone || null, message]
        );

        res.status(201).json({ success: true, message: 'Message received. We will get back to you soon.' });
    } catch (error) {
        console.error('Contact save error:', error);
        res.status(500).json({ success: false, message: 'Failed to save message' });
    }
});

// GET /api/contacts - retrieve all contact messages (for admin)
app.get('/api/contacts', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, phone, message, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
             FROM contacts
             ORDER BY created_at DESC`
        );

        res.json({ success: true, contacts: result.rows });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
    }
});

// 6. GET USER'S ORDER HISTORY (UPDATED WITH ADDRESS)
app.get('/api/orders/:phone', async (req, res) => {
    const { phone } = req.params;

    try {
        // Get all orders for user with address
        const ordersResult = await pool.query(
            `SELECT order_id, total_amount, status, 
                    delivery_name, delivery_phone, 
                    address_line1, address_line2, 
                    city, state, pincode,
                    TO_CHAR(created_at, 'YYYY-MM-DD') as date
             FROM orders 
             WHERE user_phone = $1 
             ORDER BY created_at DESC`,
            [phone]
        );

        if (ordersResult.rows.length === 0) {
            return res.json({
                success: true,
                orders: []
            });
        }

        // Get items for each order
        const ordersWithItems = await Promise.all(
            ordersResult.rows.map(async (order) => {
                const itemsResult = await pool.query(
                    `SELECT product_id as id, product_name as name, 
                            price, quantity
                     FROM order_items 
                     WHERE order_id = $1`,
                    [order.order_id]
                );

                return {
                    orderId: order.order_id,
                    date: order.date,
                    items: itemsResult.rows,
                    amount: order.total_amount,
                    status: order.status,
                    address: {
                        name: order.delivery_name,
                        phone: order.delivery_phone,
                        line1: order.address_line1,
                        line2: order.address_line2,
                        city: order.city,
                        state: order.state,
                        pincode: order.pincode
                    }
                };
            })
        );

        res.json({
            success: true,
            orders: ordersWithItems
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// ===================================
// ADMIN ROUTES (Optional)
// ===================================

// Update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status'
        });
    }

    try {
        await pool.query(
            'UPDATE orders SET status = $1 WHERE order_id = $2',
            [status, orderId]
        );

        res.json({
            success: true,
            message: 'Order status updated'
        });

    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
});

// ===================================
// HEALTH CHECK
// ===================================

app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            success: true,
            message: 'Server is running!',
            database: 'Connected',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server running, database error',
            error: error.message
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Organic Farm Direct API',
        endpoints: {
            signup: 'POST /api/signup',
            login: 'POST /api/login',
            products: 'GET /api/products',
            orders: 'POST /api/orders (with address)',
            orderHistory: 'GET /api/orders/:phone',
            contact: 'POST /api/contact',
            contactsList: 'GET /api/contacts',
            health: 'GET /api/health'
        }
    });
});

// ===================================
// ERROR HANDLING
// ===================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ===================================
// START SERVER
// ===================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🌿 ORGANIC FARM DIRECT - SERVER        ║
║                                            ║
║   ✅ Server: http://localhost:${PORT}       ║
║   🗄️  Database: PostgreSQL                ║
║   🌐 Environment: ${process.env.NODE_ENV || 'development'}          ║
║   📍 Address Support: ENABLED             ║
║                                            ║
╚════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    pool.end();
    process.exit(0);
});

module.exports = app;