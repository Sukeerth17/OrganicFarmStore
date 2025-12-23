// ORDERS PAGE JAVASCRIPT - UPDATED TO SHOW ADDRESS

// Load user orders
document.addEventListener('DOMContentLoaded', async () => {
    // Require login
    if (!window.utils.requireLogin()) {
        return;
    }
    
    const user = window.utils.getCurrentUser();
    const ordersList = document.getElementById('orders-list');
    const noOrdersDiv = document.getElementById('no-orders');
    
    try {
        const response = await window.utils.getUserOrders(user.phone);
        const orders = response.orders || [];
        
        if (orders.length === 0) {
            ordersList.style.display = 'none';
            noOrdersDiv.style.display = 'block';
            return;
        }
        
        // Sort orders by date (newest first)
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        displayOrders(orders);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = `
            <p style="text-align:center; color:#ff4444;">
                Failed to load orders. Please try again later.
            </p>
        `;
    }
});

// Display orders with address
function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">${order.orderId}</div>
                    <div class="order-date">${window.utils.formatDate(order.date)}</div>
                </div>
                <span class="order-status status-${order.status.toLowerCase()}">
                    ${order.status}
                </span>
            </div>
            
            ${order.address ? `
                <div class="delivery-address">
                    <h4>📍 Delivery Address</h4>
                    <p><strong>${order.address.name}</strong></p>
                    <p>📞 ${order.address.phone}</p>
                    <p>${order.address.line1}</p>
                    ${order.address.line2 ? `<p>${order.address.line2}</p>` : ''}
                    <p>${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
                </div>
            ` : ''}
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-qty">Qty: ${item.quantity}</div>
                        </div>
                        <div class="item-price">₹${item.price * item.quantity}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-footer">
                <div class="order-total">
                    Total: ${window.utils.formatCurrency(order.amount)}
                </div>
                <button class="btn-outline" onclick="reorder('${order.orderId}')">
                    Order Again
                </button>
            </div>
        </div>
    `).join('');
}

// Reorder function
function reorder(orderId) {
    window.utils.showNotification('Adding items to cart...', 'success');
    // Implementation: Add order items to cart
    // For now, just redirect to products
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 1000);
}