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
    try {
        // Show loading state
        showLoadingState();
        
        // Load translations first with timeout
        await Promise.race([
            loadTranslations(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Translation load timeout')), 5000))
        ]);
        
        // Initialize other components with error handling
        initializeLanguageSelector();
        initializeMobileMenu();
        initializeNavbar();
        initializeForms();
        initializeAnimations();
        initializeSmoothScrolling();
        initializeAccessibility();
        
        // Detect language from URL or use saved preference
        const urlLanguage = detectLanguageFromUrl();
        const savedLanguage = localStorage.getItem('preferredLanguage') || urlLanguage || 'en';
        setLanguage(savedLanguage, false); // Don't update URL on initial load
        
        // Hide loading state
        hideLoadingState();
        
        // Add loaded class to body for CSS transitions
        document.body.classList.add('app-loaded');
        
    } catch (error) {
        console.error('App initialization error:', error);
        
        // Ensure fallback translations are loaded
        if (!translations || Object.keys(translations).length === 0) {
            translations = {
                en: {
                    site: {
                        title: "FastFun Remote Control",
                        description: "Professional RF remote replacement and Wi-Fi switch solutions."
                    },
                    nav: {
                        home: "Home", about: "About", products: "Products", blog: "Blog", contact: "Contact"
                    },
                    loading: { message: "Loading..." }
                }
            };
            currentLanguage = 'en';
        }
        
        // Initialize essential components even if translation loading failed
        try {
            initializeLanguageSelector();
            initializeMobileMenu();
            initializeNavbar();
            initializeForms();
            initializeAnimations();
            initializeSmoothScrolling();
            initializeAccessibility();
        } catch (initError) {
            console.error('Component initialization error:', initError);
        }
        
        // Hide loading state even if there was an error
        hideLoadingState();
        
        // Add loaded class to body
        document.body.classList.add('app-loaded');
        
        // Show error message to user (optional)
        const errorBanner = document.createElement('div');
        errorBanner.className = 'error-banner';
        errorBanner.textContent = 'Some features may not be available. Please refresh the page.';
        errorBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff6b6b;
            color: white;
            padding: 10px;
            text-align: center;
            z-index: 10000;
            font-size: 14px;
        `;
        document.body.appendChild(errorBanner);
        
        // Auto-hide error banner after 5 seconds
        setTimeout(() => {
            if (errorBanner.parentNode) {
                errorBanner.parentNode.removeChild(errorBanner);
            }
        }, 5000);
    }
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
                products: {
                    title: "Our Products",
                    subtitle: "Professional remote control solutions for every application",
                    rfRemote: {
                        title: "RF Remote",
                        description: "High-performance RF remote controls with reliable signal transmission and long battery life.",
                        cta: "Get Quote"
                    }
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
        return false;
    }
}

// Language Management
function setLanguage(lang, updateUrl = true) {
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
    
    // Update URL if requested
    if (updateUrl) {
        updateLanguageUrl(lang);
    }
    
    // Update hreflang links
    updateHreflangLinks(lang);
    
    // Track language change
    if (typeof trackLanguageChange !== 'undefined' && currentLanguage !== lang) {
        trackLanguageChange(currentLanguage, lang);
    }
    
    // Announce language change to screen readers
    if (typeof announceToScreenReader !== 'undefined') {
        announceToScreenReader(`Language changed to ${lang.toUpperCase()}`);
    }
}

function updateLanguageUrl(lang) {
    if (lang === 'en') {
        // For English, remove language prefix
        const currentPath = window.location.pathname;
        const langPrefixRegex = /^\/(es|pt|fr|it)\//;
        
        if (langPrefixRegex.test(currentPath)) {
            const newPath = currentPath.replace(langPrefixRegex, '/');
            window.history.replaceState({}, '', newPath);
        }
    } else {
        // For other languages, add/update language prefix
        const currentPath = window.location.pathname;
        const langPrefixRegex = /^\/(es|pt|fr|it)\//;
        
        if (langPrefixRegex.test(currentPath)) {
            // Replace existing language prefix
            const newPath = currentPath.replace(langPrefixRegex, `/${lang}/`);
            window.history.replaceState({}, '', newPath);
        } else {
            // Add new language prefix
            const newPath = `/${lang}${currentPath}`;
            window.history.replaceState({}, '', newPath);
        }
    }
}

function updateHreflangLinks(currentLang) {
    const supportedLanguages = ['en', 'es', 'pt', 'fr', 'it'];
    const baseUrl = window.location.origin;
    
    supportedLanguages.forEach(lang => {
        const link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
        if (link) {
            if (lang === 'en') {
                link.href = baseUrl + '/';
            } else {
                link.href = `${baseUrl}/${lang}/`;
            }
        }
    });
    
    // Update x-default
    const defaultLink = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (defaultLink) {
        defaultLink.href = baseUrl + '/';
    }
}

function getTranslationValue(langData, keyPath) {
    if (!langData || !keyPath) return null;
    return keyPath.split('.').reduce((obj, segment) => {
        if (obj && Object.prototype.hasOwnProperty.call(obj, segment)) {
            return obj[segment];
        }
        return null;
    }, langData);
}

function updateTranslations() {
    if (!translations[currentLanguage]) return;
    
    const langData = translations[currentLanguage];
    
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
            
            // Check if we need to navigate to a different page
            const currentPage = window.location.pathname;
            const isHomePage = currentPage === '/' || currentPage === '/index.html';
            
            if (isHomePage) {
                // On home page, just update language without navigation
                setLanguage(lang);
            } else {
                // On other pages, navigate to the language-specific version
                navigateToLanguageVersion(lang, currentPage);
            }
            
            menu.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        menu.classList.remove('active');
    });
}

function navigateToLanguageVersion(lang, currentPath) {
    // Extract the current page name without language prefix
    let pageName = currentPath;
    
    // Remove language prefix if present
    const langPrefixRegex = /^\/(es|pt|fr|it)\//;
    if (langPrefixRegex.test(pageName)) {
        pageName = pageName.replace(langPrefixRegex, '/');
    }
    
    // Remove leading slash for consistency
    pageName = pageName.replace(/^\//, '');
    
    // Handle root path case
    if (pageName === '' || pageName === '/') {
        pageName = 'index.html';
    }
    
    // Build the new URL
    let newUrl;
    if (lang === 'en') {
        newUrl = `/${pageName}`;
    } else {
        newUrl = `/${lang}/${pageName}`;
    }
    
    // Navigate to the new language version
    console.log('Navigating to:', newUrl, 'from:', currentPath, 'language:', lang);
    window.location.href = newUrl;
}

// Detect language from URL
function detectLanguageFromUrl() {
    const path = window.location.pathname;
    const langMatch = path.match(/^\/(es|pt|fr|it)\//);
    
    if (langMatch) {
        return langMatch[1];
    }
    
    return 'en'; // Default to English
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
    
    // Quick quote form
    const quickQuoteForm = document.getElementById('quickQuoteForm');
    if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', handleQuickQuoteForm);
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
    
    // Use Formspree for form submission
    fetch(e.target.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
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
        
        // Enhanced error handling with specific error types
        let errorMessage = translations[currentLanguage]?.contact?.form?.error || 'Sorry, there was an error sending your message. Please try again later.';
        
        // Check if it's a Formspree-specific error
        if (error.message && error.message.includes('formspree')) {
            errorMessage = 'Form service temporarily unavailable. Please email us directly at eric@fastfunrc.com';
        } else if (error.response) {
            // Handle HTTP errors
            switch (error.response.status) {
                case 400:
                    errorMessage = 'Please check all required fields and try again.';
                    break;
                case 429:
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later or contact us directly.';
                    break;
                case 503:
                    errorMessage = 'Service unavailable. Please try again later.';
                    break;
                default:
                    errorMessage = `Error ${error.response.status}: ${error.response.statusText || 'Unknown error occurred.'}`;
            }
        } else if (error.name === 'TypeError') {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.name === 'AbortError') {
            errorMessage = 'Request was cancelled. Please try again if needed.';
        }
        
        // Show error message with enhanced styling
        if (formMessage) {
            formMessage.textContent = errorMessage;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            formMessage.setAttribute('role', 'alert');
            formMessage.setAttribute('aria-live', 'polite');
            
            // Announce to screen readers
            if (typeof announceToScreenReader !== 'undefined') {
                announceToScreenReader(`Form submission error: ${errorMessage}`);
            }
        }
        
        // Log detailed error for debugging
        console.error('Form submission failed:', {
            error: error,
            errorMessage: errorMessage,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            formType: 'contact_form'
        });
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
    
    // Use Formspree for newsletter subscription
    fetch('https://formspree.io/f/xqkavzwp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            form_type: 'newsletter',
            source: 'fastfunrc.com',
            language: currentLanguage,
            _subject: 'Newsletter Subscription from FastFun RC Website'
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
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
        
        // Enhanced error handling for newsletter
        let errorMessage = translations[currentLanguage]?.blog?.subscribe?.error || 'Error. Please try again.';
        
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 409:
                    errorMessage = 'This email is already subscribed.';
                    break;
                case 429:
                    errorMessage = 'Too many subscription attempts. Please wait and try again.';
                    break;
                default:
                    errorMessage = `Subscription error: ${error.response.statusText || 'Please try again later.'}`;
            }
        } else if (error.name === 'TypeError') {
            errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        // Show error message with enhanced styling
        button.textContent = errorMessage;
        button.classList.add('error');
        button.setAttribute('aria-label', `Subscription error: ${errorMessage}`);
        
        // Announce to screen readers
        if (typeof announceToScreenReader !== 'undefined') {
            announceToScreenReader(`Newsletter subscription error: ${errorMessage}`);
        }
        
        // Log detailed error for debugging
        console.error('Newsletter subscription failed:', {
            error: error,
            errorMessage: errorMessage,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            formType: 'newsletter_signup'
        });
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

// Quick Quote Form Handler
function handleQuickQuoteForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formMessage = document.getElementById('quickQuoteFormMessage');
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Create message element if it doesn't exist
    if (!formMessage) {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'quickQuoteFormMessage';
        messageDiv.className = 'form-message';
        e.target.appendChild(messageDiv);
    }
    
    // Use Formspree for quick quote submission
    fetch('https://formspree.io/f/xqkavzwp', {
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
            form_type: 'quick_quote',
            language: currentLanguage,
            _subject: 'Quick Quote Request from FastFun RC Website'
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    })
    .then(data => {
        // Show success message
        const messageElement = document.getElementById('quickQuoteFormMessage');
        if (messageElement) {
            messageElement.textContent = 'Thank you for your quote request! Our team will contact you within 24 hours.';
            messageElement.className = 'form-message success';
            messageElement.style.display = 'block';
        }
        
        // Reset form
        e.target.reset();
        
        // Track conversion event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'quote',
                'event_label': 'quick_quote_form'
            });
        }
    })
    .catch(error => {
        console.error('Quick quote form submission error:', error);
        
        // Enhanced error handling for quick quote
        let errorMessage = 'Sorry, there was an error sending your quote request. Please try again or contact us directly.';
        
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = 'Please fill in all required fields with valid information.';
                    break;
                case 413:
                    errorMessage = 'Request too large. Please reduce file sizes or contact us directly.';
                    break;
                case 429:
                    errorMessage = 'Too many quote requests. Please wait a moment and try again.';
                    break;
                case 500:
                    errorMessage = 'Server error processing your quote. Please contact us directly for immediate assistance.';
                    break;
                default:
                    errorMessage = `Quote request error: ${error.response.statusText || 'Please try again later.'}`;
            }
        } else if (error.name === 'TypeError') {
            errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        // Show error message with enhanced styling
        const messageElement = document.getElementById('quickQuoteFormMessage');
        if (messageElement) {
            messageElement.textContent = errorMessage;
            messageElement.className = 'form-message error';
            messageElement.style.display = 'block';
            messageElement.setAttribute('role', 'alert');
            messageElement.setAttribute('aria-live', 'polite');
            
            // Announce to screen readers
            if (typeof announceToScreenReader !== 'undefined') {
                announceToScreenReader(`Quote request error: ${errorMessage}`);
            }
        }
        
        // Log detailed error for debugging
        console.error('Quick quote form submission failed:', {
            error: error,
            errorMessage: errorMessage,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            formType: 'quick_quote_form'
        });
    })
    .finally(() => {
        // Restore button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Hide message after 10 seconds
        setTimeout(() => {
            const messageElement = document.getElementById('quickQuoteFormMessage');
            if (messageElement) {
                messageElement.style.display = 'none';
            }
        }, 10000);
    });
}

// Trust Indicators Counter Animation - FIXED
function animateCounters() {
    const counters = document.querySelectorAll('.trust-indicator-value');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds animation
        const start = performance.now();
        const startValue = 0;
        
        // Set initial value to ensure it works without animation
        counter.innerText = '0';
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (target - startValue) * easeOutQuart;
            
            // Update counter with proper formatting
            if (target % 1 !== 0) {
                counter.innerText = currentValue.toFixed(1);
            } else {
                counter.innerText = Math.floor(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value is exact
                if (target % 1 !== 0) {
                    counter.innerText = target.toFixed(1);
                } else {
                    counter.innerText = target;
                }
            }
        }
        
        requestAnimationFrame(animate);
    });
}

// Intersection Observer for Counter Animation with performance optimization
let animationTriggered = false;
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animationTriggered) {
            animationTriggered = true;
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px' // Start animation earlier
});

// Fallback for immediate display if JavaScript fails or IntersectionObserver not supported
function initializeCounterFallback() {
    const counters = document.querySelectorAll('.trust-indicator-value');
    counters.forEach(counter => {
        const target = counter.getAttribute('data-target');
        if (target) {
            // Set static values as fallback
            counter.innerText = target;
        }
    });
}

// Enhanced Navigation with Active State and Sticky Behavior
function initializeEnhancedNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Handle scroll events
    function handleScroll() {
        // Add/remove scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Initialize optimized scroll listener with throttling
    const optimizedHandleScroll = throttle(handleScroll, 16); // ~60fps
    window.addEventListener('scroll', optimizedHandleScroll, { passive: true });
    handleScroll(); // Call once on load
}

// Animations
function initializeAnimations() {
    // Initialize counter animation with fallback
    const trustSection = document.querySelector('.trust-indicators-section');
    if (trustSection) {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            counterObserver.observe(trustSection);
            // Fallback: if animation doesn't trigger after 3 seconds, show static values
            setTimeout(() => {
                if (!animationTriggered) {
                    initializeCounterFallback();
                }
            }, 3000);
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            initializeCounterFallback();
        }
    }

    // Initialize enhanced navigation
    initializeEnhancedNavigation();

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

// Smooth Scrolling with keyboard navigation support
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                target.focus(); // 添加焦点以支持键盘导航
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
        
        // 添加键盘支持
        anchor.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Accessibility Functions
function initializeAccessibility() {
    try {
        // Add skip links for keyboard navigation
        addSkipLinks();
        
        // Enhance focus management
        enhanceFocusManagement();
        
        // Add ARIA live regions for dynamic content
        addAriaLiveRegions();
        
        // Initialize keyboard navigation for interactive elements
        initializeKeyboardNavigation();
        
        // Add screen reader announcements
        initializeScreenReaderAnnouncements();
    } catch (error) {
        console.error('Accessibility initialization error:', error);
    }
}

function addSkipLinks() {
    try {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `;
        skipLinks.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #007AFF;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 0 0 4px 0;
        `;
        
        // Add hover/focus styles
        const style = document.createElement('style');
        style.textContent = `
            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(style);
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    } catch (error) {
        console.error('Error adding skip links:', error);
    }
}

function enhanceFocusManagement() {
    try {
        // Add focus indicators to all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        interactiveElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.setAttribute('data-focused', 'true');
            });
            element.addEventListener('blur', function() {
                this.removeAttribute('data-focused');
            });
        });
        
        // Add focus styles
        const focusStyle = document.createElement('style');
        focusStyle.textContent = `
            [data-focused="true"] {
                outline: 2px solid #007AFF !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(focusStyle);
    } catch (error) {
        console.error('Error enhancing focus management:', error);
    }
}

function addAriaLiveRegions() {
    try {
        // Create a live region for announcements
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(liveRegion);
        }
    } catch (error) {
        console.error('Error adding ARIA live regions:', error);
    }
}

function initializeKeyboardNavigation() {
    try {
        // Add keyboard support for dropdown menus
        const dropdowns = document.querySelectorAll('.language-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                } else if (e.key === 'Escape') {
                    const menu = document.getElementById('languageMenu');
                    if (menu) {
                        menu.classList.remove('active');
                    }
                }
            });
        });
        
        // Add keyboard support for language options
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    } catch (error) {
        console.error('Error initializing keyboard navigation:', error);
    }
}

function initializeScreenReaderAnnouncements() {
    try {
        // Make announceToScreenReader globally available
        window.announceToScreenReader = function(message) {
            const liveRegion = document.getElementById('aria-live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                // Clear after announcement
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        };
    } catch (error) {
        console.error('Error initializing screen reader announcements:', error);
    }
}

// Enhanced Utility Functions with performance optimizations
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

// Throttle function for performance optimization
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
    };
}

// Enhanced DOM ready function
function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Performance optimized scroll event handler
function optimizedScrollHandler(callback) {
    let ticking = false;
    return function() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                callback();
                ticking = false;
            });
            ticking = true;
        }
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

// Enhanced performance monitoring
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        const domContentLoaded = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        
        console.log('Page load time:', loadTime + 'ms');
        console.log('DOM Content Loaded time:', domContentLoaded + 'ms');
        
        // 发送到分析服务
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load', {
                'custom_map': {
                    'load_time': loadTime,
                    'dom_content_loaded': domContentLoaded
                }
            });
        }
    }
    
    // 监控资源加载
    if (window.performance && window.performance.getEntriesByType) {
        const resources = window.performance.getEntriesByType('resource');
        const resourceTiming = resources.map(resource => ({
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize
        }));
        
        console.table('Resource Timing:', resourceTiming);
    }
});

// Loading state functions with enhanced error handling
function showLoadingState() {
    try {
        // Create loading overlay if it doesn't exist
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading translations...</p>
                </div>
            `;
            
            // Add loading styles
            const loadingStyles = document.createElement('style');
            loadingStyles.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(5px);
                }
                .loading-spinner {
                    text-align: center;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007AFF;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .app-loaded .loading-overlay {
                    display: none !important;
                }
            `;
            document.head.appendChild(loadingStyles);
            document.body.appendChild(overlay);
        }
        
        overlay.style.display = 'flex';
        
        // Auto-hide after 10 seconds as fallback
        setTimeout(() => {
            if (overlay.style.display !== 'none') {
                console.warn('Loading overlay auto-hiding after timeout');
                hideLoadingState();
            }
        }, 10000);
        
    } catch (error) {
        console.error('Error showing loading state:', error);
    }
}

function hideLoadingState() {
    try {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        // Remove loading overlay after transition
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500);
        
    } catch (error) {
        console.error('Error hiding loading state:', error);
    }
}

// Export functions for potential use in other scripts
window.FastFunRC = {
    setLanguage,
    currentLanguage: () => currentLanguage,
    translations: () => translations
};
