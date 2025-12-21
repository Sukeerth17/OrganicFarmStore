// CONTACT PAGE JAVASCRIPT

function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate email
    if (!window.utils.validateEmail(email)) {
        window.utils.showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate phone if provided
    if (phone && !window.utils.validatePhone(phone)) {
        window.utils.showNotification('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    // In a real application, this would send to backend
    // For now, just show success message
    window.utils.showLoader();
    
    setTimeout(() => {
        window.utils.hideLoader();
        window.utils.showNotification('Thank you! We will get back to you soon.', 'success');
        
        // Clear form
        document.getElementById('contact-form').reset();
    }, 1500);
    
    // Log to console (in production, send to backend)
    console.log('Contact Form Submission:', {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString()
    });
}