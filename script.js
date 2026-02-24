// CliffMart - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (if needed in future)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add to cart functionality (placeholder)
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const product = this.dataset.product;
            const price = this.dataset.price;
            // Redirect to checkout with product info
            window.location.href = `/checkout.html?product=${product}&price=${price}`;
        });
    });

    // Newsletter signup (if added later)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert('Thanks for subscribing! We\'ll keep you updated.');
            this.reset();
        });
    }

    // Console easter egg
    console.log('🧗 Welcome to CliffMart! Built by Cliff & Tim.');
    console.log('🐦 Follow the build: @CliffCircuit & @timharris707');
});
