// CART PAGE JAVASCRIPT

function displayCartItems() {
    const cart = window.utils.getCart();
    const cartList = document.getElementById('cart-items-list');
    const emptyMessage = document.getElementById('empty-cart-message');

    if (cart.length === 0) {
        cartList.style.display = 'none';
        emptyMessage.style.display = 'block';
        updateCartSummary(0, 0, 0);
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
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = subtotal > 0 ? 50 : 0;
    const discount = subtotal > 1000 ? 100 : 0;
    const total = subtotal + delivery - discount;

    document.getElementById('subtotal').textContent = window.utils.formatCurrency(subtotal);
    document.getElementById('delivery').textContent = window.utils.formatCurrency(delivery);
    document.getElementById('discount').textContent = `-${window.utils.formatCurrency(discount)}`;
    document.getElementById('grand-total').textContent = window.utils.formatCurrency(total);
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