// SHARED UTILITY FUNCTIONS - Works with both Local and Vercel

// Auto-detect API URL based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'  // Local development
    : '/api';  // Production (Vercel)

// ===================================
// 1. TOAST NOTIFICATIONS
// ===================================

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #D4AF37, #F4D03F)' 
        : type === 'error' 
        ? 'linear-gradient(135deg, #ff4444, #cc0000)'
        : 'linear-gradient(135deg, #4444ff, #0000cc)';
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: ${type === 'success' ? '#0D0D0D' : '#fff'};
        padding: 18px 30px;
        border-radius: 50px;
        font-weight: 600;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 2.6s;
        font-size: 0.95rem;
        letter-spacing: 0.5px;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Add notification animations
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// 2. CART MANAGEMENT
// ===================================

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (window.updateCartCount) {
        window.updateCartCount();
    }
}

function addToCart(product, quantity = 1) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    saveCart(cart);
    return cart;
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

function updateCartQuantity(productId, newQuantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = newQuantity;
        saveCart(cart);
    }
    
    return cart;
}

function clearCart() {
    localStorage.removeItem('cart');
    if (window.updateCartCount) {
        window.updateCartCount();
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ===================================
// 3. USER AUTHENTICATION
// ===================================

function isUserLoggedIn() {
    return localStorage.getItem('userPhone') !== null;
}

function getCurrentUser() {
    const phone = localStorage.getItem('userPhone');
    const name = localStorage.getItem('userName');
    return phone ? { phone, name } : null;
}

function requireLogin() {
    if (!isUserLoggedIn()) {
        showNotification('Please sign in to continue', 'error');
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 1500);
        return false;
    }
    return true;
}

// ===================================
// 4. API CALLS
// ===================================

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Specific API functions
async function loginUser(phone, password) {
    return apiCall('/login', 'POST', { phone, password });
}

async function signupUser(name, phone, password) {
    return apiCall('/signup', 'POST', { name, phone, password });
}

async function getAllProducts() {
    return apiCall('/products');
}

async function placeOrder(phone, items, amount) {
    return apiCall('/orders', 'POST', { phone, items, amount });
}

async function getUserOrders(phone) {
    return apiCall(`/orders/${phone}`);
}

// ===================================
// 5. FORMATTING HELPERS
// ===================================

function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===================================
// 6. VALIDATION
// ===================================

function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================================
// 7. LOADING SPINNER
// ===================================

function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
        ">
            <div style="
                border: 4px solid rgba(212, 175, 55, 0.3);
                border-top: 4px solid #D4AF37;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: spin 1s linear infinite;
            "></div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.remove();
}

// Export all functions to window object
window.utils = {
    showNotification,
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    isUserLoggedIn,
    getCurrentUser,
    requireLogin,
    apiCall,
    loginUser,
    signupUser,
    getAllProducts,
    placeOrder,
    getUserOrders,
    formatCurrency,
    formatDate,
    validatePhone,
    validatePassword,
    validateEmail,
    showLoader,
    hideLoader
};

// Log current environment
console.log('🌿 Organic Farm Direct');
console.log('API URL:', API_BASE_URL);
console.log('Environment:', window.location.hostname === 'localhost' ? 'Development' : 'Production');