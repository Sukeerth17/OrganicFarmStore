// ABOUT PAGE JAVASCRIPT

// Add scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const contentBlocks = document.querySelectorAll('.content-block');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    contentBlocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(30px)';
        block.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(block);
    });
});