// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeSmoothScroll();
    initializeAnimations();
    initializeContactForm();
    initializeMobileMenu();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // Active link highlighting
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
}

// Smooth scrolling for navigation links
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const navMenu = document.getElementById('nav-menu');
                if (mobileMenu && navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .experience-item, .education-item, .stat-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const formElements = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };
    
    // Validation rules
    const validators = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (letters only, minimum 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 5,
            message: 'Please enter a subject (minimum 5 characters)'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Please enter a message (minimum 10 characters)'
        }
    };
    
    // Real-time validation
    Object.keys(formElements).forEach(fieldName => {
        const field = formElements[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName, field.value));
            field.addEventListener('input', () => clearError(fieldName));
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = {};
        
        // Validate all fields
        Object.keys(formElements).forEach(fieldName => {
            const field = formElements[fieldName];
            if (field) {
                const value = field.value.trim();
                formData[fieldName] = value;
                
                if (!validateField(fieldName, value)) {
                    isValid = false;
                }
            }
        });
        
        if (isValid) {
            submitForm(formData);
        }
    });
    
    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        const field = formElements[fieldName];
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (validator.required && !value.trim()) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        // Pattern validation
        else if (value && validator.pattern && !validator.pattern.test(value)) {
            isValid = false;
            errorMessage = validator.message;
        }
        // Length validation
        else if (value && validator.minLength && value.length < validator.minLength) {
            isValid = false;
            errorMessage = validator.message;
        }
        
        // Display error
        if (!isValid) {
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
            if (field) {
                field.classList.add('error');
                field.classList.remove('success');
            }
        } else {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            if (field && value) {
                field.classList.add('success');
                field.classList.remove('error');
            }
        }
        
        return isValid;
    }
    
    function clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const field = formElements[fieldName];
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        if (field) {
            field.classList.remove('error');
        }
    }
    
    function submitForm(formData) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        form.classList.add('loading');
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Create mailto link with form data
            const mailtoLink = createMailtoLink(formData);
            window.location.href = mailtoLink;
            
            // Reset form
            form.reset();
            Object.keys(formElements).forEach(fieldName => {
                const field = formElements[fieldName];
                if (field) {
                    field.classList.remove('success', 'error');
                }
            });
            
            // Show success message
            showSuccessMessage();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.classList.remove('loading');
        }, 1000);
    }
    
    function createMailtoLink(formData) {
        const subject = encodeURIComponent(`Portfolio Contact: ${formData.subject}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Subject: ${formData.subject}\n\n` +
            `Message:\n${formData.message}\n\n` +
            `---\nSent from ahsan-ali.me contact form`
        );
        
        return `mailto:ahsan.ali00946@gmail.com?subject=${subject}&body=${body}`;
    }
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <p style="color: #10b981; font-weight: 500; margin: 1rem 0;">
                ✓ Thank you for your message! Your email client should open shortly.
            </p>
        `;
        
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization for scroll events
window.addEventListener('scroll', throttle(function() {
    // Optimized scroll handling
}, 16)); // ~60fps

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Resize handler
window.addEventListener('resize', debounce(function() {
    // Handle resize events
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (window.innerWidth > 768) {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }
}, 250));

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeSmoothScroll,
        initializeAnimations,
        initializeContactForm,
        initializeMobileMenu,
        initializeScrollEffects
    };
}