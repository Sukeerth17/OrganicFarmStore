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
    
    // Send to backend API
    window.utils.showLoader();

    window.utils.apiCall('/contact', 'POST', { name, email, phone, message })
        .then(response => {
            window.utils.hideLoader();
            window.utils.showNotification(response.message || 'Thank you! We will get back to you soon.', 'success');
            document.getElementById('contact-form').reset();
            console.log('Contact Form Submission saved:', response);
        })
        .catch(err => {
            window.utils.hideLoader();
            console.error('Failed to submit contact form:', err.message || err);
            window.utils.showNotification(err.message || 'Failed to send message. Please try again later.', 'error');
        });
}