// PRODUCTS PAGE JAVASCRIPT

let products = [];

// Fetch and display products
async function loadProducts() {
    const container = document.getElementById('product-container');
    
    try {
        const response = await window.utils.getAllProducts();
        products = response.products;
        
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#F5F5F5;">No products available</p>';
            return;
        }
        
        displayProducts();
        
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = `
            <p style="text-align:center; color:#ff4444;">
                Failed to load products. Please make sure the backend server is running.
            </p>
        `;
    }
}

// Display products on page
function displayProducts() {
    const container = document.getElementById('product-container');
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p class="price">
                <span class="currency">₹</span>${product.price}
                <span style="font-size: 0.9rem; color: #aaa;"> / ${product.unit}</span>
            </p>
            <div class="qty-wrapper">
                <input type="number" value="1" min="1" max="99" 
                       id="qty-${product.id}" class="qty-input" 
                       aria-label="Quantity">
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
    
    animateProducts();
}

// Animate products on load
function animateProducts() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Add product to cart
function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    const product = products.find(p => p.id === productId);
    const card = document.querySelector(`[data-product-id="${productId}"]`);

    // Validate quantity
    if (quantity < 1 || quantity > 99) {
        window.utils.showNotification('Please enter a valid quantity (1-99)', 'error');
        return;
    }

    // Add visual feedback
    card.style.opacity = '0.6';
    card.style.pointerEvents = 'none';

    // Add to cart
    window.utils.addToCart(product, quantity);

    // Show success and reset
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        window.utils.showNotification(`${product.name} (×${quantity}) added to cart!`, 'success');
        qtyInput.value = 1;
    }, 300);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadProducts);