// FastFun Remote Control - Optimized JavaScript with Performance Enhancements

// Global variables with better encapsulation
const FastFunRC = {
    currentLanguage: 'en',
    translations: {},
    isLoaded: false,
    observers: new Map(),
    cache: new Map()
};

// DOM Content Loaded with error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
    } catch (error) {
        console.error('Initialization error:', error);
        showErrorState();
    }
});

// Initialize Application with performance monitoring
async function initializeApp() {
    const startTime = performance.now();
    
    // Show minimal loading state
    showMinimalLoadingState();
    
    // Initialize core modules in parallel
    const initPromises = [
        loadTranslations(),
        initializeCoreComponents(),
        preloadCriticalResources()
    ];
    
    await Promise.allSettled(initPromises);
    
    // Initialize secondary modules after core is ready
    requestIdleCallback(() => {
        initializeSecondaryModules();
    });
    
    // Hide loading state
    hideLoadingState();
    FastFunRC.isLoaded = true;
    
    // Performance logging
    const initTime = performance.now() - startTime;
    console.log(`App initialized in ${initTime.toFixed(2)}ms`);
    
    // Send performance metrics
    reportPerformanceMetric('app_initialization', initTime);
}

// Load translations with caching
async function loadTranslations() {
    const cacheKey = 'translations';
    
    // Check cache first
    if (FastFunRC.cache.has(cacheKey)) {
        FastFunRC.translations = FastFunRC.cache.get(cacheKey);
        return true;
    }
    
    try {
        const response = await fetch('translations.json', {
            headers: {
                'Cache-Control': 'max-age=3600'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const translations = await response.json();
        FastFunRC.translations = translations;
        FastFunRC.cache.set(cacheKey, translations);
        
        return true;
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English
        FastFunRC.translations = getFallbackTranslations();
        return false;
    }
}

// Fallback translations
function getFallbackTranslations() {
    return {
        en: {
            site: {
                title: "FastFun Remote Control",
                description: "Professional RF remote replacement and Wi-Fi switch solutions. Compatible with LiftMaster, Chamberlain, and 80% of garage door brands.",
                keywords: "RF remote replacement, Wi-Fi switch, car remote control, garage door remote, LiftMaster compatible, Chamberlain remote, universal RF controller"
            },
            nav: {
                home: "Home",
                about: "About",
                products: "Products",
                blog: "Blog",
                contact: "Contact",
                getQuote: "Get Quote"
            },
            loading: { message: "Loading..." },
            home: {
                heroTitle: "Professional RF Remote Control Solutions",
                heroSubtitle: "14+ Years Manufacturing Excellence | 20+ Brand Compatibility | ODM/OEM Available",
                heroCtaPrimary: "Get Quote Now",
                heroCtaSecondary: "Download Catalog"
            },
            contact: {
                form: {
                    sending: "Sending...",
                    success: "Thank you for your message! We'll get back to you soon.",
                    error: "Sorry, there was an error sending your message. Please try again later."
                }
            },
            blog: {
                subscribe: {
                    subscribing: "Subscribing...",
                    subscribed: "Subscribed!",
                    error: "Error. Please try again."
                }
            },
            footer: {
                copyright: "© 2025 FastFun Remote. All rights reserved."
            }
        }
    };
}

// Initialize core components
function initializeCoreComponents() {
    const modules = [
        initializeLanguageSelector,
        initializeMobileMenu,
        initializeNavbar,
        initializeForms,
        initializeSmoothScrolling
    ];
    
    modules.forEach(module => {
        try {
            module();
        } catch (error) {
            console.error('Error initializing module:', error);
        }
    });
}

// Initialize secondary modules
function initializeSecondaryModules() {
    const modules = [
        initializeAnimations,
        initializePerformanceMonitoring,
        initializeIntersectionObservers
    ];
    
    modules.forEach(module => {
        try {
            module();
        } catch (error) {
            console.error('Error initializing secondary module:', error);
        }
    });
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        { url: 'images/logo.png', as: 'image' },
        { url: 'images/og-image.jpg', as: 'image' }
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.url;
        link.as = resource.as;
        document.head.appendChild(link);
    });
}

// Language Management with performance optimization
function setLanguage(lang) {
    if (!FastFunRC.translations[lang]) {
        console.warn(`Translation for language '${lang}' not found`);
        return;
    }
    
    FastFunRC.currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        updateLanguageDisplay(lang);
        updateTranslations();
        updatePageMetadata(lang);
    });
}

function updateLanguageDisplay(lang) {
    const currentLangElement = document.getElementById('currentLanguage');
    if (currentLangElement) {
        currentLangElement.textContent = lang.toUpperCase();
    }
    
    // Update language option active states
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });
}

function getTranslationValue(root, keyPath) {
    if (!root || !keyPath) return null;
    return keyPath.split('.').reduce((obj, segment) => {
        if (obj && Object.prototype.hasOwnProperty.call(obj, segment)) {
            return obj[segment];
        }
        return null;
    }, root);
}

function updateTranslations() {
    const langData = FastFunRC.translations[FastFunRC.currentLanguage];
    if (!langData) return;
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getTranslationValue(langData, key);
        if (value !== null && value !== undefined) {
            if (element.tagName === 'INPUT' && element.type === 'email') {
                element.placeholder = value;
            } else if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });
    
    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const value = getTranslationValue(langData, key);
        if (value !== null && value !== undefined) {
            element.placeholder = value;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = FastFunRC.currentLanguage;
}

function updatePageMetadata(lang) {
    const langData = FastFunRC.translations[lang];
    if (!langData.site) return;
    
    // Update page title
    if (langData.site.title) {
        document.title = langData.site.title;
    }
    
    // Update meta tags
    const metaUpdates = [
        { selector: 'meta[name="description"]', content: langData.site.description },
        { selector: 'meta[name="keywords"]', content: langData.site.keywords },
        { selector: 'meta[property="og:title"]', content: langData.site.title },
        { selector: 'meta[property="og:description"]', content: langData.site.description },
        { selector: 'meta[name="twitter:title"]', content: langData.site.title },
        { selector: 'meta[name="twitter:description"]', content: langData.site.description }
    ];
    
    metaUpdates.forEach(update => {
        const element = document.querySelector(update.selector);
        if (element && update.content) {
            element.content = update.content;
        }
    });
}

// Language Selector with event delegation
function initializeLanguageSelector() {
    const dropdown = document.getElementById('languageDropdown');
    const menu = document.getElementById('languageMenu');
    
    if (!dropdown || !menu) return;
    
    // Use event delegation for better performance
    document.addEventListener('click', function(e) {
        if (e.target.closest('#languageDropdown')) {
            e.stopPropagation();
            menu.classList.toggle('active');
        } else if (e.target.closest('.language-option')) {
            e.preventDefault();
            const lang = e.target.closest('.language-option').dataset.lang;
            setLanguage(lang);
            menu.classList.remove('active');
        } else if (!menu.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
}

// Mobile Menu with touch support
function initializeMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const isActive = menu.classList.toggle('active');
        
        // Update ARIA attributes
        toggle.setAttribute('aria-expanded', isActive);
        
        // Animate hamburger
        const hamburger = toggle.querySelector('.hamburger');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Handle touch events for better mobile experience
    let touchStartY = 0;
    
    menu.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    menu.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;
        
        // Allow scrolling within menu but prevent body scroll
        if (Math.abs(deltaY) > 10) {
            e.preventDefault();
        }
    });
}

// Navbar Scroll Effect with throttling
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Form Handling with validation and error handling
function initializeForms() {
    const forms = [
        { id: 'contactForm', handler: handleContactForm },
        { id: 'newsletterForm', handler: handleNewsletterForm },
        { id: 'quickQuoteForm', handler: handleQuickQuoteForm }
    ];
    
    forms.forEach(form => {
        const element = document.getElementById(form.id);
        if (element) {
            element.addEventListener('submit', form.handler);
            // Add client-side validation
            addFormValidation(element);
        }
    });
}

function addFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateInput(this);
            }
        });
    });
}

function validateInput(input) {
    const isValid = input.checkValidity();
    
    if (isValid) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
    } else {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
    }
    
    return isValid;
}

async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formMessage = document.getElementById('formMessage');
    
    // Validate form
    if (!validateForm(e.target)) {
        showFormMessage(formMessage, 'Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    setButtonLoading(submitButton, 'Sending...');
    
    try {
        const response = await fetch('https://api.fastfunrc.com/contact', {
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
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Show success message
        showFormMessage(formMessage, 
            FastFunRC.translations[FastFunRC.currentLanguage]?.contact?.form?.success || 
            'Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        e.target.reset();
        
        // Track conversion
        trackConversion('contact_form_submission');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(formMessage, 
            FastFunRC.translations[FastFunRC.currentLanguage]?.contact?.form?.error || 
            'Sorry, there was an error sending your message. Please try again later.', 'error');
    } finally {
        // Restore button
        restoreButton(submitButton, originalText);
        
        // Hide message after 10 seconds
        setTimeout(() => {
            hideFormMessage(formMessage);
        }, 10000);
    }
}

async function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Validate email
    if (!validateEmail(email)) {
        showButtonError(button, 'Please enter a valid email address.');
        return;
    }
    
    // Show loading state
    setButtonLoading(button, 'Subscribing...');
    
    try {
        const response = await fetch('https://api.fastfunrc.com/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                source: 'fastfunrc.com',
                language: FastFunRC.currentLanguage,
                _subject: 'Newsletter Subscription from FastFun RC Website'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Show success state
        button.textContent = FastFunRC.translations[FastFunRC.currentLanguage]?.blog?.subscribe?.subscribed || 'Subscribed!';
        button.classList.add('success');
        
        // Reset form
        e.target.reset();
        
        // Track conversion
        trackConversion('newsletter_signup');
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showButtonError(button, 
            FastFunRC.translations[FastFunRC.currentLanguage]?.blog?.subscribe?.error || 
            'Error. Please try again.');
    } finally {
        // Restore button after 3 seconds
        setTimeout(() => {
            restoreButton(button, originalText);
        }, 3000);
    }
}

// Utility functions for form handling
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function setButtonLoading(button, text) {
    button.textContent = text;
    button.disabled = true;
    button.classList.add('loading');
}

function restoreButton(button, text) {
    button.textContent = text;
    button.disabled = false;
    button.classList.remove('loading', 'success', 'error');
}

function showButtonError(button, message) {
    button.textContent = message;
    button.classList.add('error');
    button.disabled = true;
    
    setTimeout(() => {
        restoreButton(button, 'Subscribe');
    }, 3000);
}

function showFormMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    element.setAttribute('role', 'alert');
}

function hideFormMessage(element) {
    if (!element) return;
    
    element.style.display = 'none';
    element.removeAttribute('role');
}

// Trust Indicators Counter Animation with Intersection Observer
function animateCounters() {
    const counters = document.querySelectorAll('.trust-indicator-value');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = target * speed / 100;
        const increment = target / (duration / 16);
        let current = 0;
        
        const animate = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(animate);
            } else {
                // Handle decimal values
                if (target % 1 !== 0) {
                    counter.innerText = target.toFixed(1);
                } else {
                    counter.innerText = target;
                }
            }
        };
        
        animate();
    });
}

// Intersection Observer for performance
function initializeIntersectionObservers() {
    // Counter animation observer
    const counterSection = document.querySelector('.trust-indicators-section');
    if (counterSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        
        counterObserver.observe(counterSection);
        FastFunRC.observers.set('counter', counterObserver);
    }
    
    // Fade-in animation observer
    const animatedElements = document.querySelectorAll('.animate-fade-in-up');
    if (animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => animationObserver.observe(el));
        FastFunRC.observers.set('animation', animationObserver);
    }
}

// Smooth Scrolling with keyboard navigation
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                target.focus();
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
        
        // Keyboard support
        anchor.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            reportPerformanceMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                reportPerformanceMetric('fid', entry.processingStart - entry.startTime);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            reportPerformanceMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
    
    // Page load performance
    window.addEventListener('load', function() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            const domContentLoaded = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            
            reportPerformanceMetric('page_load_time', loadTime);
            reportPerformanceMetric('dom_content_loaded', domContentLoaded);
        }
    });
}

// Analytics and conversion tracking
function trackConversion(event) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'event_category': 'engagement',
            'event_label': event
        });
    }
    
    // Custom analytics
    reportPerformanceMetric(`conversion_${event}`, Date.now());
}

function reportPerformanceMetric(name, value) {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'performance_metric', {
            'custom_map': {
                'metric_name': name,
                'metric_value': value
            }
        });
    }
    
    // Console logging for development
    console.log(`Performance Metric - ${name}:`, value);
}

// Loading states
function showMinimalLoadingState() {
    // Show minimal loading indicator
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoadingState() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showErrorState() {
    // Show error message if initialization fails
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = 'An error occurred while loading the page. Please refresh.';
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff3b30;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        font-family: system-ui;
    `;
    document.body.appendChild(errorDiv);
}

// Cleanup function
function cleanup() {
    // Disconnect observers
    FastFunRC.observers.forEach(observer => {
        observer.disconnect();
    });
    FastFunRC.observers.clear();
    
    // Clear cache
    FastFunRC.cache.clear();
}

// Initialize animations
function initializeAnimations() {
    // Add any additional animations here
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause non-essential animations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Handle beforeunload for cleanup
window.addEventListener('beforeunload', cleanup);

// Export public API
window.FastFunRC = {
    setLanguage,
    getCurrentLanguage: () => FastFunRC.currentLanguage,
    getTranslations: () => FastFunRC.translations,
    isLoaded: () => FastFunRC.isLoaded,
    trackConversion,
    reportPerformanceMetric
};

// Quick Quote Form Handler (placeholder)
async function handleQuickQuoteForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formMessage = document.getElementById('quickQuoteFormMessage');
    
    if (!validateForm(e.target)) {
        showFormMessage(formMessage, 'Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    setButtonLoading(submitButton, 'Sending...');
    
    try {
        const response = await fetch('https://api.fastfunrc.com/quick-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                product: formData.get('product'),
                quantity: formData.get('quantity'),
                company: formData.get('company'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message'),
                language: FastFunRC.currentLanguage,
                _subject: 'Quick Quote Request from FastFun RC Website'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        showFormMessage(formMessage, 'Thank you for your quote request! Our team will contact you within 24 hours.', 'success');
        e.target.reset();
        trackConversion('quick_quote_form');
        
    } catch (error) {
        console.error('Quick quote form submission error:', error);
        showFormMessage(formMessage, 'Sorry, there was an error sending your quote request. Please try again or contact us directly.', 'error');
    } finally {
        restoreButton(submitButton, originalText);
        
        setTimeout(() => {
            hideFormMessage(formMessage);
        }, 10000);
    }
}

// Load saved language preference after translations are loaded
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    // Wait a bit for translations to load, then set language
    setTimeout(() => {
        if (FastFunRC.translations[savedLanguage]) {
            setLanguage(savedLanguage);
        } else {
            // Fallback to English if saved language not available
            setLanguage('en');
        }
    }, 100);
});
