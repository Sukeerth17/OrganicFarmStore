// CHECKOUT PAGE JAVASCRIPT - UPDATED WITH ADDRESS SUPPORT AND NEW DISCOUNTS

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

// Update checkout totals with new discount system
function updateCheckoutTotals() {
    const cart = window.utils.getCart();
    const totals = window.utils.calculateOrderTotals(cart);
    
    document.getElementById('checkout-subtotal').textContent = window.utils.formatCurrency(totals.subtotal);
    document.getElementById('checkout-delivery').textContent = window.utils.formatCurrency(totals.delivery);
    
    // Show discount with details
    const discountEl = document.getElementById('checkout-discount');
    if (totals.discount.amount > 0) {
        discountEl.textContent = `-${window.utils.formatCurrency(totals.discount.amount)} (${totals.discount.percentage}% ${totals.discount.type})`;
        discountEl.style.color = '#4ade80';
        
        // Show celebration message
        const celebrationMsg = document.createElement('div');
        celebrationMsg.style.cssText = `
            background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(34, 197, 94, 0.1));
            border: 1px solid #4ade80;
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            color: #4ade80;
            font-weight: 600;
            text-align: center;
        `;
        
        let celebrationText = '🎉 ';
        if (totals.discount.percentage === 20) {
            celebrationText += 'Amazing! You got our BEST Premium Festive Discount!';
        } else if (totals.discount.percentage === 15) {
            celebrationText += 'Great! Festive Discount Applied!';
        } else if (totals.discount.percentage === 10) {
            celebrationText += 'You got a discount!';
        }
        celebrationMsg.textContent = celebrationText;
        
        // Remove existing celebration
        const existing = document.querySelector('.celebration-msg');
        if (existing) existing.remove();
        
        celebrationMsg.className = 'celebration-msg';
        document.querySelector('.summary-totals').insertBefore(
            celebrationMsg, 
            document.querySelector('.summary-totals').firstChild
        );
    } else {
        discountEl.textContent = `-${window.utils.formatCurrency(0)}`;
        discountEl.style.color = 'rgba(245, 245, 245, 0.5)';
        
        // Remove celebration if exists
        const existing = document.querySelector('.celebration-msg');
        if (existing) existing.remove();
    }
    
    document.getElementById('checkout-total').textContent = window.utils.formatCurrency(totals.total);
    document.getElementById('qr-amount').textContent = totals.total;
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

// Place order with new discount system
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
    
    // Calculate totals using new discount system
    const totals = window.utils.calculateOrderTotals(cart);
    
    // Show confirmation
    const addressSummary = `${address.line1}, ${address.city}, ${address.state} - ${address.pincode}`;
    let confirmMessage = `Place order for ${window.utils.formatCurrency(totals.total)}?\n\n`;
    
    if (totals.discount.amount > 0) {
        confirmMessage += `🎉 ${totals.discount.type} Applied!\n`;
        confirmMessage += `You saved ${window.utils.formatCurrency(totals.discount.amount)} (${totals.discount.percentage}% off)\n\n`;
    }
    
    confirmMessage += `Delivery to:\n${address.name}\n${addressSummary}\n\n`;
    confirmMessage += paymentMethod === 'cod' 
        ? 'Payment: Cash on Delivery'
        : 'Payment: UPI (Please ensure payment is completed)';
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    window.utils.showLoader();
    
    try {
        // Place order via API with address
        const response = await window.utils.placeOrderWithAddress(
            user.phone, 
            cart, 
            totals.total, 
            address
        );
        
        // Clear cart
        window.utils.clearCart();
        
        window.utils.hideLoader();
        
        let successMessage = `Order placed successfully! Order ID: ${response.orderId}`;
        if (totals.discount.amount > 0) {
            successMessage += `\n🎉 You saved ${window.utils.formatCurrency(totals.discount.amount)}!`;
        }
        
        window.utils.showNotification(successMessage, 'success');
        
        // Redirect to orders page
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 2000);
        
    } catch (error) {
        window.utils.hideLoader();
        window.utils.showNotification('Failed to place order: ' + error.message, 'error');
    }
}