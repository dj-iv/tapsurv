// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Smooth scrolling for anchor links (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Form submission handler
const demoForm = document.getElementById('demo-form');

demoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = demoForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString()
    };
    
    try {
        // TODO: Replace with your Firebase function endpoint
        // const response = await fetch('YOUR_FIREBASE_FUNCTION_URL', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData)
        // });
        
        // For now, just log to console
        console.log('Form submission:', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        submitButton.textContent = '✓ Request Sent!';
        submitButton.classList.remove('btn-accent');
        submitButton.classList.add('bg-green-500', 'hover:bg-green-600');
        
        // Reset form
        demoForm.reset();
        
        // Show alert
        alert('Thank you for your interest! We\'ll get back to you within 24 hours.');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            submitButton.classList.add('btn-accent');
        }, 3000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        submitButton.textContent = 'Error - Please Try Again';
        submitButton.classList.remove('btn-accent');
        submitButton.classList.add('bg-red-500', 'hover:bg-red-600');
        
        alert('Sorry, there was an error submitting your request. Please try again or email us directly at info@tapsurv.com');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.classList.remove('bg-red-500', 'hover:bg-red-600');
            submitButton.classList.add('btn-accent');
        }, 3000);
    }
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS class for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
