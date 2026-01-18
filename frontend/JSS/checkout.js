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

// -----------------------------
// Feedback modal (rating + message)
// -----------------------------
function showFeedbackModal(orderId, userPhone) {
    // Remove existing modal if present
    const existing = document.getElementById('feedback-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.6); z-index: 99999; padding: 20px;
    `;

    modal.innerHTML = `
        <div style="background: #0d0d0d; padding: 22px; border-radius: 12px; width: 100%; max-width: 680px; color: #fff; box-shadow: 0 20px 60px rgba(0,0,0,0.7);">
            <h3 style="margin-top:0;">Rate your experience</h3>
            <p style="color: #ddd;">How was your order <strong>${orderId}</strong>? Please rate and leave a short message (optional).</p>
            <div id="feedback-stars" style="font-size: 2.2rem; margin: 10px 0; color: #ffd166; cursor: pointer;">
                <span data-value="1">☆</span>
                <span data-value="2">☆</span>
                <span data-value="3">☆</span>
                <span data-value="4">☆</span>
                <span data-value="5">☆</span>
            </div>
            <textarea id="feedback-message" rows="4" placeholder="Write a short message (optional)" style="width:100%; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color:#fff; margin-bottom:12px;"></textarea>
            <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button id="feedback-skip" class="btn-outline" style="background:transparent; color:#fff;">Skip</button>
                <button id="feedback-submit" class="btn-gold">Submit Feedback</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Star selection logic
    const stars = modal.querySelectorAll('#feedback-stars span');
    let selectedRating = 5; // default
    function renderStars(r) {
        stars.forEach(s => {
            const v = parseInt(s.getAttribute('data-value'), 10);
            s.textContent = v <= r ? '★' : '☆';
        });
    }
    renderStars(selectedRating);

    stars.forEach(s => {
        s.addEventListener('click', () => {
            selectedRating = parseInt(s.getAttribute('data-value'), 10);
            renderStars(selectedRating);
        });
        s.addEventListener('mouseover', () => {
            const v = parseInt(s.getAttribute('data-value'), 10);
            renderStars(v);
        });
        s.addEventListener('mouseout', () => renderStars(selectedRating));
    });

    // Buttons
    modal.querySelector('#feedback-skip').addEventListener('click', () => {
        modal.remove();
        // Redirect to orders page
        window.location.href = 'orders.html';
    });

    modal.querySelector('#feedback-submit').addEventListener('click', async () => {
        const msg = document.getElementById('feedback-message').value.trim();
        // Submit via API
        try {
            window.utils.showLoader();
            const res = await window.utils.apiCall('/feedback', 'POST', {
                orderId: orderId,
                rating: selectedRating,
                message: msg,
                phone: userPhone
            });
            window.utils.hideLoader();
            window.utils.showNotification(res.message || 'Thanks for your feedback!', 'success');
            modal.remove();
            // Redirect to orders page
            setTimeout(() => { window.location.href = 'orders.html'; }, 800);
        } catch (err) {
            window.utils.hideLoader();
            console.error('Feedback submit error:', err);
            window.utils.showNotification(err.message || 'Failed to submit feedback', 'error');
        }
    });
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
        
        // Show feedback modal before redirecting to orders
        showFeedbackModal(response.orderId, user.phone);
        
    } catch (error) {
        window.utils.hideLoader();
        window.utils.showNotification('Failed to place order: ' + error.message, 'error');
    }
}