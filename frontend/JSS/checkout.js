// CHECKOUT PAGE JAVASCRIPT

// Check login and load order summary
document.addEventListener('DOMContentLoaded', () => {
    // Require login
    if (!window.utils.requireLogin()) {
        return;
    }
    
    // Check if cart is empty
    const cart = window.utils.getCart();
    if (cart.length === 0) {
        window.utils.showNotification('Your cart is empty', 'error');
        setTimeout(() => window.location.href = 'products.html', 1500);
        return;
    }
    
    displayOrderSummary();
    setupPaymentOptions();
});

// Display order summary
function displayOrderSummary() {
    const cart = window.utils.getCart();
    const orderItemsDiv = document.getElementById('order-items');
    
    orderItemsDiv.innerHTML = cart.map(item => `
        <div class="order-item">
            <div>
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-qty">Qty: ${item.quantity} × ₹${item.price}</div>
            </div>
            <div class="order-item-price">₹${item.price * item.quantity}</div>
        </div>
    `).join('');
    
    updateCheckoutTotals();
}

// Update checkout totals
function updateCheckoutTotals() {
    const cart = window.utils.getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = subtotal > 0 ? 50 : 0;
    const discount = subtotal > 1000 ? 100 : 0;
    const total = subtotal + delivery - discount;
    
    document.getElementById('checkout-subtotal').textContent = window.utils.formatCurrency(subtotal);
    document.getElementById('checkout-delivery').textContent = window.utils.formatCurrency(delivery);
    document.getElementById('checkout-discount').textContent = `-${window.utils.formatCurrency(discount)}`;
    document.getElementById('checkout-total').textContent = window.utils.formatCurrency(total);
    document.getElementById('qr-amount').textContent = total;
}

// Setup payment option listeners
function setupPaymentOptions() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const upiSection = document.getElementById('upi-qr-section');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'upi') {
                upiSection.style.display = 'block';
            } else {
                upiSection.style.display = 'none';
            }
        });
    });
}

// Place order
async function placeOrder() {
    const cart = window.utils.getCart();
    const user = window.utils.getCurrentUser();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (cart.length === 0) {
        window.utils.showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Calculate total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = 50;
    const discount = subtotal > 1000 ? 100 : 0;
    const total = subtotal + delivery - discount;
    
    // Show confirmation
    const confirmMessage = paymentMethod === 'cod' 
        ? `Place order for ${window.utils.formatCurrency(total)}?\nPayment: Cash on Delivery`
        : `Have you completed the UPI payment of ${window.utils.formatCurrency(total)}?`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    window.utils.showLoader();
    
    try {
        // Place order via API
        const response = await window.utils.placeOrder(user.phone, cart, total);
        
        // Clear cart
        window.utils.clearCart();
        
        window.utils.hideLoader();
        window.utils.showNotification(`Order placed successfully! Order ID: ${response.orderId}`, 'success');
        
        // Redirect to orders page
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 2000);
        
    } catch (error) {
        window.utils.hideLoader();
        window.utils.showNotification('Failed to place order: ' + error.message, 'error');
    }
}