// FastFun Remote Control - Main JavaScript File

// Global variables
let currentLanguage = 'en';
let translations = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
async function initializeApp() {
    // Show loading state
    showLoadingState();
    
    // Load translations first
    await loadTranslations();
    
    // Initialize other components
    initializeLanguageSelector();
    initializeMobileMenu();
    initializeNavbar();
    initializeForms();
    initializeAnimations();
    initializeSmoothScrolling();
    
    // Load saved language preference after translations are loaded
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLanguage);
    
    // Hide loading state
    hideLoadingState();
}

// Load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        return true;
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if translations fail to load
        translations = {
            en: {
                site: { title: "FastFun Remote Control", description: "" },
                nav: { home: "Home", about: "About", products: "Products", blog: "Blog", contact: "Contact" },
                loading: { message: "Loading..." }
            }
        };
        return false;
    }
}

// Language Management
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Translation for language '${lang}' not found`);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update language display
    const currentLangElement = document.getElementById('currentLanguage');
    if (currentLangElement) {
        currentLangElement.textContent = lang.toUpperCase();
    }
    
    // Update language option active states
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });
    
    // Update all translatable elements
    updateTranslations();
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update page title and meta tags
    updatePageMetadata(lang);
}

function updateTranslations() {
    if (!translations[currentLanguage]) return;
    
    const langData = translations[currentLanguage];
    
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            if (element.tagName === 'INPUT' && element.type === 'email') {
                element.placeholder = langData[key];
            } else if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = langData[key];
            } else {
                element.textContent = langData[key];
            }
        }
    });
    
    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            element.placeholder = langData[key];
        }
    });
}

function updatePageMetadata(lang) {
    const langData = translations[lang];
    if (!langData.site) return;
    
    // Update page title
    if (langData.site.title) {
        document.title = langData.site.title;
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && langData.site.description) {
        metaDescription.content = langData.site.description;
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && langData.site.keywords) {
        metaKeywords.content = langData.site.keywords;
    }
    
    // Update Open Graph tags
    document.querySelectorAll('[property^="og:"]').forEach(element => {
        const property = element.getAttribute('property');
        if (property === 'og:title' && langData.site.title) {
            element.content = langData.site.title;
        } else if (property === 'og:description' && langData.site.description) {
            element.content = langData.site.description;
        }
    });
    
    // Update Twitter tags
    document.querySelectorAll('[name^="twitter:"]').forEach(element => {
        const name = element.getAttribute('name');
        if (name === 'twitter:title' && langData.site.title) {
            element.content = langData.site.title;
        } else if (name === 'twitter:description' && langData.site.description) {
            element.content = langData.site.description;
        }
    });
}

// Language Selector
function initializeLanguageSelector() {
    const dropdown = document.getElementById('languageDropdown');
    const menu = document.getElementById('languageMenu');
    
    if (!dropdown || !menu) return;
    
    // Toggle dropdown
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
    });
    
    // Handle language selection
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.dataset.lang;
            setLanguage(lang);
            menu.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        menu.classList.remove('active');
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', function() {
        const isActive = menu.classList.toggle('active');
        
        // Update ARIA attributes
        toggle.setAttribute('aria-expanded', isActive);
        
        // Animate hamburger
        const hamburger = toggle.querySelector('.hamburger');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Navbar Scroll Effect
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Form Handling
function initializeForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formMessage = document.getElementById('formMessage');
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = translations[currentLanguage]?.contact?.form?.sending || 'Sending...';
    submitButton.disabled = true;
    
    // Real form submission to a backend service
    // Replace 'https://api.example.com/contact' with your actual backend endpoint
    fetch('https://api.example.com/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            language: formData.get('language'),
            product: formData.get('product'),
            message: formData.get('message'),
            _subject: 'Contact Form Submission from FastFun RC Website'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        if (formMessage) {
            formMessage.textContent = translations[currentLanguage]?.contact?.form?.success || 'Thank you for your message! We\'ll get back to you soon.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
        }
        
        // Reset form
        e.target.reset();
        
        // Track conversion event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'contact',
                'event_label': 'contact_form'
            });
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        // Show error message
        if (formMessage) {
            formMessage.textContent = translations[currentLanguage]?.contact?.form?.error || 'Sorry, there was an error sending your message. Please try again later.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
    })
    .finally(() => {
        // Restore button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Hide message after 10 seconds
        setTimeout(() => {
            if (formMessage) {
                formMessage.style.display = 'none';
            }
        }, 10000);
    });
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = translations[currentLanguage]?.blog?.subscribe?.subscribing || 'Subscribing...';
    button.disabled = true;
    
    // Real newsletter subscription
    // Replace 'https://api.example.com/newsletter' with your actual newsletter service endpoint
    fetch('https://api.example.com/newsletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            source: 'fastfunrc.com',
            language: currentLanguage,
            _subject: 'Newsletter Subscription from FastFun RC Website'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        button.textContent = translations[currentLanguage]?.blog?.subscribe?.subscribed || 'Subscribed!';
        button.classList.add('success');
        
        // Reset form
        e.target.reset();
        
        // Track conversion event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'newsletter',
                'event_label': 'newsletter_signup'
            });
        }
    })
    .catch(error => {
        console.error('Newsletter subscription error:', error);
        // Show error message
        button.textContent = translations[currentLanguage]?.blog?.subscribe?.error || 'Error. Please try again.';
        button.classList.add('error');
    })
    .finally(() => {
        // Restore button after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('success', 'error');
        }, 3000);
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Handle product parameter from URL
function handleProductParameter() {
    const product = getUrlParameter('product');
    if (product) {
        // Pre-select product in contact form
        const productSelect = document.getElementById('product');
        if (productSelect) {
            productSelect.value = product;
        }
        
        // Scroll to contact form if on contact page
        if (window.location.pathname.includes('contact.html')) {
            setTimeout(() => {
                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }
}

// Initialize product parameter handling
handleProductParameter();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});

// Loading state functions
function showLoadingState() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loadingOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading translations...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingState() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Export functions for potential use in other scripts
window.FastFunRC = {
    setLanguage,
    currentLanguage: () => currentLanguage,
    translations: () => translations
};