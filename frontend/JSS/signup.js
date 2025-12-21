// SIGNUP PAGE JAVASCRIPT

async function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate name
    if (name.length < 2) {
        window.utils.showNotification('Please enter a valid name', 'error');
        return;
    }
    
    // Validate phone number
    if (!window.utils.validatePhone(phone)) {
        window.utils.showNotification('Please enter a valid 10-digit phone number starting with 6-9', 'error');
        return;
    }
    
    // Validate password
    if (!window.utils.validatePassword(password)) {
        window.utils.showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loader
    window.utils.showLoader();
    
    try {
        // Call backend API
        await window.utils.signupUser(name, phone, password);
        
        window.utils.hideLoader();
        window.utils.showNotification('Account created successfully! Please sign in.', 'success');
        
        // Redirect to signin page after 2 seconds
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 2000);
        
    } catch (error) {
        window.utils.hideLoader();
        window.utils.showNotification(error.message || 'Signup failed. User may already exist.', 'error');
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