// HEADER & FOOTER COMPONENT INJECTION + CART COUNT (FIXED PATHS)

// Inject Header and Footer into all pages
async function injectComponents() {
    // Inject Header
    const headerElement = document.getElementById('header-placeholder');
    if (headerElement) {
        // FIXED: Correct path from HTML files
        const response = await fetch('components/header.html');
        headerElement.innerHTML = await response.text();
        
        // Set active nav link
        setActiveNavLink();
        
        // Update auth link based on login status
        updateAuthLink();
        
        // Update cart count after header is loaded
        updateCartCountInHeader();
        
        // Add scroll effect to header
        addHeaderScrollEffect();
    }

    // Inject Footer
    const footerElement = document.getElementById('footer-placeholder');
    if (footerElement) {
        // FIXED: Correct path from HTML files
        const response = await fetch('components/footer.html');
        footerElement.innerHTML = await response.text();
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Update authentication link (Sign In / My Account)
function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
    const userPhone = localStorage.getItem('userPhone');
    const userName = localStorage.getItem('userName');
    
    if (userPhone && authLink) {
        authLink.textContent = `👤 ${userName || 'Account'}`;
        authLink.href = '#';
        authLink.onclick = (e) => {
            e.preventDefault();
            showAccountMenu();
        };
    }
}

// Show account dropdown menu
function showAccountMenu() {
    // Remove existing menu if any
    const existing = document.querySelector('.account-menu');
    if (existing) existing.remove();
    
    const menu = document.createElement('div');
    menu.className = 'account-menu';
    menu.innerHTML = `
        <div style="
            position: fixed;
            top: 70px;
            right: 8%;
            background: linear-gradient(145deg, #1e1e1e, #0d0d0d);
            border: 1px solid #D4AF37;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 9999;
            min-width: 200px;
        ">
            <p style="color: #D4AF37; margin-bottom: 15px; font-weight: 600;">
                ${localStorage.getItem('userName') || 'User'}
            </p>
            <a href="orders.html" style="
                display: block;
                color: #F5F5F5;
                text-decoration: none;
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 8px;
                transition: background 0.3s;
            " onmouseover="this.style.background='rgba(212,175,55,0.1)'" 
               onmouseout="this.style.background='transparent'">
                📦 My Orders
            </a>
            <a href="#" onclick="logout(); return false;" style="
                display: block;
                color: #ff4444;
                text-decoration: none;
                padding: 10px;
                border-radius: 8px;
                transition: background 0.3s;
            " onmouseover="this.style.background='rgba(255,68,68,0.1)'" 
               onmouseout="this.style.background='transparent'">
                🚪 Logout
            </a>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!e.target.closest('.account-menu') && !e.target.closest('.auth-link')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userName');
        localStorage.removeItem('cart'); // Optional: clear cart on logout
        window.location.href = 'index.html';
    }
}

// Update cart count in header
function updateCartCountInHeader() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElement = document.getElementById('cart-count');
    
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.innerText = totalItems;
    }
}

// Add scroll effect to header
function addHeaderScrollEffect() {
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Make functions globally accessible
window.updateCartCount = updateCartCountInHeader;
window.logout = logout;

// Initialize on page load
document.addEventListener("DOMContentLoaded", injectComponents);