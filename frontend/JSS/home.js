// HOME PAGE JAVASCRIPT

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Toggle discount section visibility
function toggleDiscounts() {
    const discountSection = document.getElementById('discountSection');
    const toggleBtn = document.getElementById('discountToggleBtn');
    
    if (discountSection.style.display === 'none') {
        discountSection.style.display = 'block';
        toggleBtn.textContent = '❌ Hide Festive Discounts';
        toggleBtn.classList.add('active');
        
        // Smooth scroll to discount section
        setTimeout(() => {
            discountSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    } else {
        discountSection.style.display = 'none';
        toggleBtn.textContent = '🎄 View Festive Discounts';
        toggleBtn.classList.remove('active');
    }
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in, .feature-card');
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Add parallax effect to hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
    
    // Add animation to discount cards when visible
    const discountObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });
    
    const discountCards = document.querySelectorAll('.discount-card');
    discountCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        discountObserver.observe(card);
    });
});