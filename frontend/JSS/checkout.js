// CHECKOUT PAGE JAVASCRIPT - UPDATED WITH ADDRESS SUPPORT

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
    
    // Auto-fill user's name and phone
    prefillUserInfo();
    
    displayOrderSummary();
    setupPaymentOptions();
});

// Prefill user info in address form
function prefillUserInfo() {
    const user = window.utils.getCurrentUser();
    if (user) {
        document.getElementById('delivery-name').value = user.name || '';
        document.getElementById('delivery-phone').value = user.phone || '';
    }
}

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

// Validate address form
function validateAddressForm() {
    const name = document.getElementById('delivery-name').value.trim();
    const phone = document.getElementById('delivery-phone').value.trim();
    const line1 = document.getElementById('address-line1').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();

    if (!name) {
        window.utils.showNotification('Please enter your name', 'error');
        document.getElementById('delivery-name').focus();
        return false;
    }

    if (!window.utils.validatePhone(phone)) {
        window.utils.showNotification('Please enter a valid 10-digit phone number', 'error');
        document.getElementById('delivery-phone').focus();
        return false;
    }

    if (!line1) {
        window.utils.showNotification('Please enter your address', 'error');
        document.getElementById('address-line1').focus();
        return false;
    }

    if (!city) {
        window.utils.showNotification('Please enter your city', 'error');
        document.getElementById('city').focus();
        return false;
    }

    if (!state) {
        window.utils.showNotification('Please enter your state', 'error');
        document.getElementById('state').focus();
        return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
        window.utils.showNotification('Please enter a valid 6-digit pincode', 'error');
        document.getElementById('pincode').focus();
        return false;
    }

    return true;
}

// Get address data from form
function getAddressData() {
    return {
        name: document.getElementById('delivery-name').value.trim(),
        addressPhone: document.getElementById('delivery-phone').value.trim(),
        line1: document.getElementById('address-line1').value.trim(),
        line2: document.getElementById('address-line2').value.trim() || '',
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        pincode: document.getElementById('pincode').value.trim()
    };
}

// Place order
async function placeOrder() {
    // Validate address form first
    if (!validateAddressForm()) {
        return;
    }

    const cart = window.utils.getCart();
    const user = window.utils.getCurrentUser();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const address = getAddressData();
    
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
    const addressSummary = `${address.line1}, ${address.city}, ${address.state} - ${address.pincode}`;
    const confirmMessage = paymentMethod === 'cod' 
        ? `Place order for ${window.utils.formatCurrency(total)}?\n\nDelivery to:\n${address.name}\n${addressSummary}\n\nPayment: Cash on Delivery`
        : `Have you completed the UPI payment of ${window.utils.formatCurrency(total)}?\n\nDelivery to:\n${address.name}\n${addressSummary}`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    window.utils.showLoader();
    
    try {
        // Place order via API with address
        const response = await window.utils.placeOrderWithAddress(
            user.phone, 
            cart, 
            total, 
            address
        );
        
        // Clear cart
        window.utils.clearCart();
        
        window.utils.hideLoader();
        window.utils.showNotification(
            `Order placed successfully! Order ID: ${response.orderId}`, 
            'success'
        );
        
        // Redirect to orders page
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 2000);
        
    } catch (error) {
        window.utils.hideLoader();
        window.utils.showNotification('Failed to place order: ' + error.message, 'error');
    }
}