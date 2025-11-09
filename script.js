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
    
    // Real form submission to a backend service
    // Replace 'https://api.example.com/contact' with your actual backend endpoint
    fetch('https://api.fastfunrc.com/contact', {
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
    fetch('https://api.fastfunrc.com/newsletter', {
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
    
    // Real form submission to a backend service
    // Replace 'https://api.example.com/quick-quote' with your actual backend endpoint
    fetch('https://api.fastfunrc.com/quick-quote', {
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
            language: currentLanguage,
            _subject: 'Quick Quote Request from FastFun RC Website'
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
        
        // Track in CRM (placeholder for integration)
        if (typeof hubspot !== 'undefined') {
            hubspot.track('quote_request', {
                product: formData.get('product'),
                quantity: formData.get('quantity'),
                company: formData.get('company'),
                email: formData.get('email')
            });
        }
    })
    .catch(error => {
        console.error('Quick quote form submission error:', error);
        // Show error message
        const messageElement = document.getElementById('quickQuoteFormMessage');
        if (messageElement) {
            messageElement.textContent = 'Sorry, there was an error sending your quote request. Please try again or contact us directly.';
            messageElement.className = 'form-message error';
            messageElement.style.display = 'block';
        }
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

// Trust Indicators Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.trust-indicator-value');
    const speed = 200; // Animation speed

    counters.forEach(counter => {
        const animate = () => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const current = parseFloat(counter.innerText);
            const increment = target / speed;

            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(animate, 10);
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
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px' // Start animation a bit earlier
});

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
    // Initialize counter animation
    const trustSection = document.querySelector('.trust-indicators-section');
    if (trustSection) {
        counterObserver.observe(trustSection);
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