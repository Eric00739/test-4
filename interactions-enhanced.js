// FastFun RC - Enhanced Visual Interactions and Advanced Animations

// Enhanced Intersection Observer for scroll animations
const EnhancedAnimations = {
    observers: new Map(),
    
    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupCountUpAnimations();
        this.setupHoverEffects();
        this.setupFormInteractions();
        this.setupScrollToTop();
        this.setupProgressIndicators();
        this.setupKeyboardNavigation();
        this.setupLazyLoading();
        this.setupMicroInteractions();
    },
    
    // Advanced Scroll Animations with Performance Optimization
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right');
        
        if (animatedElements.length === 0) return;
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation || 'fadeInUp';
                    
                    // Add animation class with delay
                    setTimeout(() => {
                        element.classList.add('visible');
                        element.style.animationDelay = element.dataset.delay || '0ms';
                    }, parseInt(element.dataset.delay || 0));
                    
                    // Disconnect after animation
                    animationObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
        
        this.observers.set('scrollAnimations', animationObserver);
    },
    
    // Parallax Effects for Hero Section
    setupParallaxEffects() {
        const heroSection = document.querySelector('.hero');
        const heroArticles = document.querySelector('.hero-particles');
        
        if (!heroSection) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.5;
            
            if (heroArticles) {
                heroArticles.style.transform = `translateY(${rate}px)`;
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    },
    
    // Enhanced Count-up Animations
    setupCountUpAnimations() {
        const counters = document.querySelectorAll('.trust-indicator-value');
        
        if (counters.length === 0) return;
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    const decimal = target % 1 !== 0;
                    
                    this.animateCounter(counter, target, duration, decimal);
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
        this.observers.set('counters', counterObserver);
    },
    
    animateCounter(element, target, duration, decimal = false) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
                
                // Add completion animation
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
            
            if (decimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.ceil(current);
            }
        }, 16);
    },
    
    // Advanced Hover Effects
    setupHoverEffects() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', this.handleButtonHoverEnter);
            button.addEventListener('mouseleave', this.handleButtonHoverLeave);
        });
        
        // Card hover effects with 3D tilt
        const cards = document.querySelectorAll('.card, .feature-card, .trust-indicator-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', this.handleCardTilt);
            card.addEventListener('mouseleave', this.handleCardTiltReset);
        });
        
        // Image hover effects
        const images = document.querySelectorAll('.card-image, .feature-image');
        images.forEach(image => {
            image.addEventListener('mouseenter', this.handleImageHover);
            image.addEventListener('mouseleave', this.handleImageHoverReset);
        });
    },
    
    handleButtonHoverEnter(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    },
    
    handleButtonHoverLeave(e) {
        const button = e.currentTarget;
        const ripples = button.querySelectorAll('.ripple');
        ripples.forEach(ripple => ripple.remove());
    },
    
    handleCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    },
    
    handleCardTiltReset(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    },
    
    handleImageHover(e) {
        const image = e.currentTarget;
        image.style.transform = 'scale(1.05) rotateX(-2deg)';
        image.style.filter = 'brightness(1.1) contrast(1.1)';
    },
    
    handleImageHoverReset(e) {
        const image = e.currentTarget;
        image.style.transform = 'scale(1) rotateX(0)';
        image.style.filter = 'brightness(1) contrast(1)';
    },
    
    // Enhanced Form Interactions
    setupFormInteractions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            this.enhanceFormInputs(form);
            this.addFormValidation(form);
            this.addFormProgressIndicator(form);
        });
    },
    
    enhanceFormInputs(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Floating labels
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (label && !input.classList.contains('enhanced')) {
                input.classList.add('enhanced');
                label.classList.add('floating-label');
                
                input.addEventListener('focus', () => {
                    label.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('focused');
                    }
                });
            }
            
            // Input animations
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('input-focused');
            });
        });
    },
    
    addFormValidation(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    },
    
    validateInput(input) {
        const isValid = input.checkValidity();
        const errorMessage = input.parentElement.querySelector('.error-message');
        
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMessage) {
                errorMessage.remove();
            }
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            
            if (!errorMessage) {
                const message = document.createElement('div');
                message.className = 'error-message';
                message.textContent = input.validationMessage || 'Please fill in this field correctly.';
                input.parentElement.appendChild(message);
            }
        }
    },
    
    addFormProgressIndicator(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress';
        progressBar.innerHTML = '<div class="form-progress-fill"></div>';
        
        form.appendChild(progressBar);
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateFormProgress(form, inputs);
            });
        });
    },
    
    updateFormProgress(form, inputs) {
        const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '').length;
        const progress = (filledInputs.length / inputs.length) * 100;
        
        const progressFill = form.querySelector('.form-progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    },
    
    // Scroll to Top Button
    setupScrollToTop() {
        // Create scroll to top button
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = `
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 15.586 6.707 6.293a1 1 0 01-1.414 0l-8 8a1 1 0 01-1.414 1.414l8-8a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
        `;
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        
        document.body.appendChild(scrollButton);
        
        // Show/hide based on scroll position
        let ticking = false;
        
        function updateScrollButton() {
            const shouldShow = window.scrollY > 300;
            
            if (shouldShow) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollButton);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Scroll to top functionality
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    // Progress Indicators
    setupProgressIndicators() {
        // Reading progress bar
        this.createReadingProgressBar();
        
        // Page loading progress
        this.createPageLoadingProgress();
    },
    
    createReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.querySelector('.reading-progress-fill').style.width = scrolled + '%';
        }, { passive: true });
    },
    
    createPageLoadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'page-loading-progress';
        progressBar.innerHTML = '<div class="page-loading-progress-fill"></div>';
        
        document.body.appendChild(progressBar);
        
        // Update progress based on resources loaded
        let resourcesLoaded = 0;
        const totalResources = document.querySelectorAll('img, script, link').length;
        
        const updateProgress = () => {
            resourcesLoaded++;
            const progress = (resourcesLoaded / totalResources) * 100;
            progressBar.querySelector('.page-loading-progress-fill').style.width = progress + '%';
            
            if (progress >= 100) {
                setTimeout(() => {
                    progressBar.style.opacity = '0';
                    setTimeout(() => progressBar.remove(), 300);
                }, 500);
            }
        };
        
        // Monitor resource loading
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                updateProgress();
            } else {
                img.addEventListener('load', updateProgress);
            }
        });
        
        document.querySelectorAll('script').forEach(script => {
            script.addEventListener('load', updateProgress);
        });
        
        document.querySelectorAll('link').forEach(link => {
            link.addEventListener('load', updateProgress);
        });
    },
    
    // Enhanced Keyboard Navigation
    setupKeyboardNavigation() {
        // Skip links
        this.createSkipLinks();
        
        // Enhanced focus management
        this.setupFocusManagement();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    },
    
    createSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    },
    
    setupFocusManagement() {
        // Track focused element
        let focusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            focusedElement = e.target;
            document.body.classList.add('keyboard-navigation');
        });
        
        document.addEventListener('focusout', () => {
            focusedElement = null;
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Mouse detection
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Enhanced focus visible styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--primary-blue) !important;
                outline-offset: 2px !important;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--primary-blue);
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 0 0 8px 8px;
                z-index: 10000;
                transition: top 0.3s ease;
            }
            
            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(style);
    },
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + M: Jump to main content
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const mainContent = document.querySelector('#main-content, main, .hero');
                if (mainContent) {
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Alt + N: Jump to navigation
            if (e.altKey && e.key === 'n') {
                e.preventDefault();
                const navigation = document.querySelector('#navigation, nav, .navbar');
                if (navigation) {
                    navigation.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Alt + S: Jump to search
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                const search = document.querySelector('input[type="search"], .search-input');
                if (search) {
                    search.scrollIntoView({ behavior: 'smooth' });
                    search.focus();
                }
            }
            
            // Alt + L: Switch language
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                const languageDropdown = document.getElementById('languageDropdown');
                if (languageDropdown) {
                    languageDropdown.click();
                }
            }
            
            // Escape: Close modals and menus
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    },
    
    closeAllModals() {
        // Close mobile menu
        const mobileMenu = document.getElementById('navMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
        
        // Close language menu
        const languageMenu = document.getElementById('languageMenu');
        if (languageMenu && languageMenu.classList.contains('active')) {
            languageMenu.classList.remove('active');
        }
        
        // Close any custom modals
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
    },
    
    // Lazy Loading for Images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    // Load image
                    img.src = src;
                    img.classList.add('loaded');
                    
                    // Remove data-src after loading
                    img.removeAttribute('data-src');
                    
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.transition = 'opacity 0.5s ease';
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px 50px 0px'
        });
        
        images.forEach(img => imageObserver.observe(img));
        this.observers.set('lazyLoading', imageObserver);
    },
    
    // Micro-interactions
    setupMicroInteractions() {
        // Button ripple effects
        this.setupRippleEffects();
        
        // Text selection effects
        this.setupTextSelectionEffects();
        
        // Copy to clipboard feedback
        this.setupCopyFeedback();
        
        // Loading skeleton screens
        this.setupLoadingSkeletons();
    },
    
    setupRippleEffects() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn, .nav-link, .card');
            if (!target) return;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.opacity = '0';
                setTimeout(() => ripple.remove(), 600);
            }, 100);
        });
    },
    
    setupTextSelectionEffects() {
        document.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText.length > 0) {
                this.showCopyButton(selectedText);
            }
        });
    },
    
    showCopyButton(selectedText) {
        // Remove existing copy button
        const existingButton = document.querySelector('.copy-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 001-1V7a1 1 0 00-1-1H8a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                <path d="M8 5a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1H8z"/>
            </svg>
            Copy
        `;
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        copyButton.style.position = 'absolute';
        copyButton.style.top = (rect.top + window.scrollY - 40) + 'px';
        copyButton.style.left = (rect.left + window.scrollX + rect.width / 2 - 40) + 'px';
        
        document.body.appendChild(copyButton);
        
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(selectedText).then(() => {
                copyButton.innerHTML = `
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 00-1.414 1.414l8 8a1 1 0 000-1.414z" clip-rule="evenodd"/>
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    copyButton.remove();
                }, 2000);
            });
        });
        
        // Remove button when selection changes
        setTimeout(() => {
            document.addEventListener('mouseup', () => {
                setTimeout(() => {
                    if (document.querySelector('.copy-button')) {
                        copyButton.remove();
                    }
                }, 100);
            }, { once: true });
        }, 100);
    },
    
    setupCopyFeedback() {
        // Add feedback for successful copy operations
        document.addEventListener('copy', (e) => {
            const copiedText = window.getSelection().toString();
            if (copiedText.length > 0) {
                this.showToast('Text copied to clipboard!', 'success');
            }
        });
    },
    
    setupLoadingSkeletons() {
        // Create skeleton loading states
        const style = document.createElement('style');
        style.textContent = `
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            .skeleton-text {
                height: 1em;
                margin: 0.5em 0;
                border-radius: 4px;
            }
            
            .skeleton-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        `;
        document.head.appendChild(style);
    },
    
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide toast after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // Cleanup method
    cleanup() {
        // Disconnect all observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Remove dynamically created elements
        const dynamicElements = document.querySelectorAll('.scroll-to-top, .skip-links, .reading-progress, .page-loading-progress, .copy-button, .toast');
        dynamicElements.forEach(element => element.remove());
    }
};

// Initialize enhanced interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    EnhancedAnimations.init();
});

// Export for external use
window.EnhancedAnimations = EnhancedAnimations;