-- =====================================
-- Schema: Create Tables for OrganicFarmStore
-- Run this with psql or via the provided init script
-- =====================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    user_phone VARCHAR(10) NOT NULL REFERENCES users(phone) ON DELETE CASCADE,
    total_amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_orders_user_phone ON orders(user_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
