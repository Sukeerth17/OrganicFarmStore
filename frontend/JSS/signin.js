// SIGNIN PAGE JAVASCRIPT

async function handleSignIn(event) {
    event.preventDefault();
    
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate phone number
    if (!window.utils.validatePhone(phone)) {
        window.utils.showNotification('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    // Validate password
    if (password.length < 6) {
        window.utils.showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loader
    window.utils.showLoader();
    
    try {
        // Call backend API
        const response = await window.utils.loginUser(phone, password);
        
        // Save user data to localStorage
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userName', response.user.name);
        
        window.utils.hideLoader();
        window.utils.showNotification('Login successful!', 'success');
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1000);
        
    } catch (error) {
        window.utils.hideLoader();
        window.utils.showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
    }
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (window.utils.isUserLoggedIn()) {
        window.utils.showNotification('You are already logged in', 'info');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
    }
});