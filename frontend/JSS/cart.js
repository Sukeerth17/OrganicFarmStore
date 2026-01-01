// CART PAGE JAVASCRIPT - UPDATED WITH NEW DISCOUNT SYSTEM

function displayCartItems() {
    const cart = window.utils.getCart();
    const cartList = document.getElementById('cart-items-list');
    const emptyMessage = document.getElementById('empty-cart-message');

    if (cart.length === 0) {
        cartList.style.display = 'none';
        emptyMessage.style.display = 'block';
        updateCartSummary();
        return;
    }

    cartList.style.display = 'block';
    emptyMessage.style.display = 'none';

    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">₹${item.price} / ${item.unit || 'kg'}</p>
            </div>
            
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                
                <div class="item-total">₹${item.price * item.quantity}</div>
                
                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }
    
    if (newQuantity > 99) {
        window.utils.showNotification('Maximum quantity is 99', 'error');
        return;
    }

    window.utils.updateCartQuantity(productId, newQuantity);
    displayCartItems();
}

function removeItem(productId) {
    const cart = window.utils.getCart();
    const item = cart.find(i => i.id === productId);
    
    if (confirm(`Remove ${item.name} from cart?`)) {
        window.utils.removeFromCart(productId);
        displayCartItems();
        window.utils.showNotification('Item removed', 'success');
    }
}

function updateCartSummary() {
    const cart = window.utils.getCart();
    const totals = window.utils.calculateOrderTotals(cart);
    
    document.getElementById('subtotal').textContent = window.utils.formatCurrency(totals.subtotal);
    document.getElementById('delivery').textContent = window.utils.formatCurrency(totals.delivery);
    
    // Show discount with percentage
    const discountEl = document.getElementById('discount');
    if (totals.discount.amount > 0) {
        discountEl.textContent = `-${window.utils.formatCurrency(totals.discount.amount)} (${totals.discount.percentage}% off)`;
        discountEl.style.color = '#4ade80';
        
        // Show which discount was applied
        if (totals.discount.percentage > 0) {
            const discountNote = document.createElement('div');
            discountNote.className = 'discount-note';
            discountNote.style.cssText = `
                color: #4ade80;
                font-size: 0.85rem;
                margin-top: 5px;
                font-weight: 600;
            `;
            discountNote.textContent = `🎉 ${totals.discount.type} Applied!`;
            
            // Remove existing discount note
            const existingNote = document.querySelector('.discount-note');
            if (existingNote) existingNote.remove();
            
            // Add new note
            discountEl.parentElement.appendChild(discountNote);
        }
    } else {
        discountEl.textContent = `-${window.utils.formatCurrency(0)}`;
        discountEl.style.color = '#F5F5F5';
        
        // Show how much more to unlock discount
        const remaining = 1000 - totals.subtotal;
        if (remaining > 0 && totals.subtotal > 0) {
            const tipNote = document.createElement('div');
            tipNote.className = 'discount-note';
            tipNote.style.cssText = `
                color: #D4AF37;
                font-size: 0.85rem;
                margin-top: 5px;
                font-weight: 600;
            `;
            tipNote.textContent = `💡 Add ${window.utils.formatCurrency(remaining)} more to get 10% off!`;
            
            const existingNote = document.querySelector('.discount-note');
            if (existingNote) existingNote.remove();
            
            discountEl.parentElement.appendChild(tipNote);
        }
    }
    
    document.getElementById('grand-total').textContent = window.utils.formatCurrency(totals.total);
}

function goToCheckout() {
    const cart = window.utils.getCart();
    
    if (cart.length === 0) {
        window.utils.showNotification('Your cart is empty', 'error');
        return;
    }
    
    if (!window.utils.isUserLoggedIn()) {
        window.utils.showNotification('Please sign in to checkout', 'error');
        setTimeout(() => window.location.href = 'signin.html', 1500);
        return;
    }
    
    window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', displayCartItems);