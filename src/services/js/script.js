
function initWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const loadingProgress = document.querySelector('.loading-progress');
    

    welcomeScreen.style.display = 'flex';
    

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        

        const loadingText = document.querySelector('.loading-text');
        if (progress < 30) {
            loadingText.textContent = 'Loading Traditional Artistry...';
        } else if (progress < 60) {
            loadingText.textContent = 'Connecting with Master Potters...';
        } else if (progress < 90) {
            loadingText.textContent = 'Preparing Marketplace...';
        } else {
            loadingText.textContent = 'Welcome to KUMBHARBAJAR!';
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            

            setTimeout(() => {
                welcomeScreen.classList.add('fade-out');
                

                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    welcomeScreen.remove();
                }, 1000);
            }, 500);
        }
    }, 200);
    

    welcomeScreen.addEventListener('click', function(e) {
        if (e.target === welcomeScreen || e.target.closest('.welcome-container')) {
            clearInterval(progressInterval);
            welcomeScreen.classList.add('fade-out');
            
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                welcomeScreen.remove();
            }, 1000);
        }
    });
    

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && welcomeScreen.style.display !== 'none') {
            clearInterval(progressInterval);
            welcomeScreen.classList.add('fade-out');
            
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                welcomeScreen.remove();
            }, 1000);
        }
    });
}


function initThemeSystem() {
    const themeBtn = document.getElementById('themeBtn');
    const themeOptions = document.getElementById('themeOptions');
    

    if (!themeBtn || !themeOptions) {
        console.warn('Theme elements not found in DOM');
        return;
    }
    

    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeOptions.classList.toggle('active');
    });
    

    const themeOptionsList = document.querySelectorAll('.theme-option');
    themeOptionsList.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            applyTheme(theme);
            themeOptions.classList.remove('active');
        });
    });
    

    document.addEventListener('click', (e) => {
        if (!themeBtn.contains(e.target) && !themeOptions.contains(e.target)) {
            themeOptions.classList.remove('active');
        }
    });
    

    function applyTheme(theme) {
        const root = document.documentElement;
        

        const themes = {
            earth: {
                '--primary-color': '#8B4513',
                '--secondary-color': '#D2691E',
                '--accent-color': '#F4A460',
                '--terracotta': '#CD853F',
                '--cream': '#F5F5DC',
                '--warm-white': '#FFF8DC',
                '--dark-brown': '#654321',
                '--gold': '#DAA520'
            },
            ocean: {
                '--primary-color': '#006994',
                '--secondary-color': '#0080A3',
                '--accent-color': '#4FC3F7',
                '--terracotta': '#00838F',
                '--cream': '#E1F5FE',
                '--warm-white': '#F5FCFF',
                '--dark-brown': '#006064',
                '--gold': '#00B0FF'
            },
            sunset: {
                '--primary-color': '#FF6B35',
                '--secondary-color': '#F7931E',
                '--accent-color': '#FFD23F',
                '--terracotta': '#FF8C00',
                '--cream': '#FFF5E6',
                '--warm-white': '#FFFAF0',
                '--dark-brown': '#CC5500',
                '--gold': '#FFAA00'
            },
            forest: {
                '--primary-color': '#2E7D32',
                '--secondary-color': '#4CAF50',
                '--accent-color': '#81C784',
                '--terracotta': '#388E3C',
                '--cream': '#E8F5E9',
                '--warm-white': '#F1F8E9',
                '--dark-brown': '#1B5E20',
                '--gold': '#66BB6A'
            },
            royal: {
                '--primary-color': '#512DA8',
                '--secondary-color': '#7B1FA2',
                '--accent-color': '#E1BEE7',
                '--terracotta': '#7E57C2',
                '--cream': '#EDE7F6',
                '--warm-white': '#F3E5F5',
                '--dark-brown': '#4527A0',
                '--gold': '#AB47BC'
            }
        };
        

        if (themes[theme]) {
            Object.keys(themes[theme]).forEach(property => {
                root.style.setProperty(property, themes[theme][property]);
            });
            

            localStorage.setItem('selectedTheme', theme);
        }
    }
    

    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    initWelcomeScreen();
});


const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});


document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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


window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        

        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        

        particle.style.left = Math.random() * 100 + '%';
        

        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        particlesContainer.appendChild(particle);
    }
}


function initTiltEffect() {
    const pots = document.querySelectorAll('[data-tilt]');
    
    pots.forEach(pot => {
        pot.addEventListener('mousemove', (e) => {
            const rect = pot.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            pot.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        pot.addEventListener('mouseleave', () => {
            pot.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}


function initCardFlipEffect() {

    /*
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(5deg) translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
        

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
    });
    */
}


function initButtonEffects() {

    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 5px 15px rgba(139, 69, 19, 0.2)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '';
        });
    });
}


const potterForm = document.getElementById('potterForm');
if (potterForm) {
    potterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        

        if (!data.name || !data.email || !data.phone || !data.location || !data.experience) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
            showNotification('Please enter a valid 10-digit phone number.', 'error');
            return;
        }
        

        showNotification('Registration submitted successfully! We will contact you soon.', 'success');
        this.reset();
    });
}


const customForm = document.getElementById('customForm');
if (customForm) {
    customForm.addEventListener('submit', function(e) {
        e.preventDefault();
        

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        

        if (!data.productType || !data.customSize || !data.customDescription || 
            !data.customBudget || !data.customTimeline || !data.customContact) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        

        showNotification('Custom order request submitted! Our team will get back to you within 24 hours.', 'success');
        this.reset();
    });
}


const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        

        if (!data.contactName || !data.contactEmail || !data.contactSubject || !data.contactMessage) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.contactEmail)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        

        showNotification('Message sent successfully! We will reply to you soon.', 'success');
        this.reset();
    });
}


const newsletterForm = document.querySelector('.newsletter');
if (newsletterForm) {
    const newsletterInput = newsletterForm.querySelector('input[type="email"]');
    const newsletterBtn = newsletterForm.querySelector('.btn');
    
    newsletterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = newsletterInput.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterInput.value = '';
    });
}


function showNotification(message, type = 'info') {

    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
    `;
    

    document.body.appendChild(notification);
    

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}


document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});


document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});


const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);


document.querySelectorAll('.product-card, .feature-card, .custom-step, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.pottery-showcase');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});


function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }, 2000);
}


document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            addLoadingState(submitBtn);
        }
    });
});


function initFormInteractions() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });
}


function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateX(0deg)';
            }
        });
    }, observerOptions);
    

    document.querySelectorAll('.product-card, .feature-card, .custom-step, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) rotateX(20deg)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}


function initEnhancedParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.pottery-showcase');
        const particles = document.querySelectorAll('.particle');
        
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px) rotateX(${scrolled * 0.1}deg)`;
        }
        

        particles.forEach((particle, index) => {
            const speed = 0.5 + (index % 3) * 0.2;
            particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}


function applyDiwaliDiscount() {
    const cartTotal = document.getElementById('cartTotal');
    if (!cartTotal) return;
    
    const total = parseInt(cartTotal.textContent);
    

    if (total > 2999) {
        const discount = total * 0.3;
        const discountedTotal = total - discount;
        

        cartTotal.textContent = Math.round(discountedTotal);
        

        showNotification(`🎉 Diwali Offer Applied! ₹${Math.round(discount)} discount on your order. Total: ₹${Math.round(discountedTotal)}`, 'success');
    } else {

        const remaining = 2999 - total;
        if (remaining > 0) {
            showNotification(`🛒 Spend ₹${remaining} more to get 30% off on your order!`, 'info');
        }
    }
}


function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}


let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProductId = null;

// Validate and repair cart data on initialization
cart = cart.map(item => {
    if (item.price === undefined || item.price === null) {
        const productData = products[item.id];
        if (productData && productData.price !== undefined) {
            item.price = productData.price;
        } else {
            item.price = 0;
        }
    }
    return {
        ...item,
        quantity: item.quantity || 1
    };
});


const products = {
    1: {
        id: 1,
        name: "Traditional Clay Pots",
        description: "Handcrafted earthenware perfect for cooking and storage. Made from natural clay and fired in traditional kilns.",
        price: 599,
        image: "images/claypots.webp"
    },
    2: {
        id: 2,
        name: "Decorative Vases",
        description: "Beautiful ceramic vases for home decoration. Each piece is uniquely crafted by skilled artisans.",
        price: 699,
        image: "images/vases.jpg"
    },
    3: {
        id: 3,
        name: "Tea Cups & Sets",
        description: "Traditional terracotta cups for authentic tea experience. Perfect for your morning chai.",
        price: 324,
        image: "images/tea.webp"
    },
    4: {
        id: 4,
        name: "Planters",
        description: "Eco-friendly clay planters for your garden. Natural clay helps regulate soil moisture.",
        price: 549,
        image: "images/plant.jpg"
    },
    5: {
        id: 5,
        name: "Water Bottles",
        description: "Natural clay bottles for cool, pure water. Clay naturally cools and filters water.",
        price: 474,
        image: "images/bottle.jpeg"
    },
    6: {
        id: 6,
        name: "Lamps & Diyas",
        description: "Traditional clay lamps for festivals and decoration. Create warm, ambient lighting.",
        price: 249,
        image: "images/diya.jpg"
    },
    7: {
        id: 7,
        name: "Clay Bowls",
        description: "Handmade clay bowls for serving and dining. Perfect for traditional meals and modern kitchens.",
        price: 299,
        image: "images/claypots.webp"
    },
    8: {
        id: 8,
        name: "Decorative Figurines",
        description: "Artistic clay figurines and sculptures. Beautiful handcrafted pieces for home decoration.",
        price: 949,
        image: "images/dolls.jpg"
    },
    9: {
        id: 9,
        name: "Storage Jars",
        description: "Large clay jars for food and grain storage. Traditional earthenware with excellent preservation properties.",
        price: 1174,
        image: "images/storage.jpg"
    },
    10: {
        id: 10,
        name: "Terracotta dinner sets",
        description: "Traditional dining plates made from pure clay. Perfect for healthy and eco-friendly dining.",
        price: 224,
        image: "images/dinner.jpg"
    },
    11: {
        id: 11,
        name: "Clay Wind Chimes",
        description: "Musical clay wind chimes for peaceful ambiance. Handcrafted with melodious tones.",
        price: 424,
        image: "images/chimes.jpeg"
    },
    12: {
        id: 12,
        name: "Earthen Coolers",
        description: "Natural clay water coolers for summer. Eco-friendly alternative to electric coolers.",
        price: 1799,
        image: "images/cool.jpeg"
    },
    13: {
        id: 13,
        name: "Kulhad Tea Cups",
        description: "Traditional Indian clay cups for chai. Authentic taste and eco-friendly disposable cups.",
        price: 149,
        image: "images/tea.jpeg"
    },
    14: {
        id: 14,
        name: "Matka Water Pots",
        description: "Traditional water storage earthen pots. Keep water naturally cool and fresh.",
        price: 599,
        image: "images/matka.avif"
    },
    15: {
        id: 15,
        name: "Clay Cooking Pots",
        description: "Traditional handi and earthen cookware. Perfect for slow cooking and enhancing flavors.",
        price: 899,
        image: "images/cookpots.avif"
    }
};




let diwaliDate;
try {

    diwaliDate = new Date('2025-10-26T00:00:00');
    

    if (isNaN(diwaliDate.getTime())) {

    }
    

    if (isNaN(diwaliDate.getTime())) {
        diwaliDate = new Date('October 26, 2025');
    }
} catch (error) {
    console.error('Date creation failed:', error);

    diwaliDate = new Date();
    diwaliDate.setDate(diwaliDate.getDate() + 30);
}


console.log('Diwali Date:', diwaliDate);
console.log('Current Date:', new Date());
console.log('Time difference (ms):', diwaliDate.getTime() - new Date().getTime());
console.log('Days until Diwali:', Math.floor((diwaliDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));


function initCountdown() {
    console.log('Initializing Diwali countdown...');
    
    const countdownElement = document.getElementById('diwaliCountdown');
    console.log('Countdown container found:', !!countdownElement);
    
    if (!countdownElement) {
        console.error('Diwali countdown container not found!');
    
        setTimeout(() => {
            console.log('Retrying countdown initialization...');
            initCountdown();
        }, 1000);
        return;
    }


    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    console.log('Individual timer elements:', {
        days: !!daysElement,
        hours: !!hoursElement,
        minutes: !!minutesElement,
        seconds: !!secondsElement
    });

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error('Some countdown elements are missing!');
        console.log('Available elements in diwaliCountdown:', countdownElement.innerHTML);
        return;
    }


    updateCountdown();
    

    const intervalId = setInterval(updateCountdown, 1000);
    console.log('Countdown interval started with ID:', intervalId);
}


function updateCountdown() {
    try {
        const now = new Date().getTime();
        const distance = diwaliDate.getTime() - now;

        console.log('Update countdown called - distance:', distance);

        if (distance < 0) {
            console.log('Countdown expired, hiding offer section');
            const diwaliOfferSection = document.getElementById('diwaliOffer');
            if (diwaliOfferSection) {
                diwaliOfferSection.style.display = 'none';
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);


        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        console.log('Timer elements found:', {
            days: !!daysElement,
            hours: !!hoursElement,
            minutes: !!minutesElement,
            seconds: !!secondsElement
        });

        console.log('Calculated time:', { days, hours, minutes, seconds });


        if (daysElement) {
            daysElement.textContent = days.toString().padStart(2, '0');
            console.log('Updated days element:', daysElement.textContent);
        } else {
            console.error('Days element not found!');
        }
        
        if (hoursElement) {
            hoursElement.textContent = hours.toString().padStart(2, '0');
        } else {
            console.error('Hours element not found!');
        }
        
        if (minutesElement) {
            minutesElement.textContent = minutes.toString().padStart(2, '0');
        } else {
            console.error('Minutes element not found!');
        }
        
        if (secondsElement) {
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            console.error('Seconds element not found!');
        }
        

        if (daysElement) {
            daysElement.style.opacity = '0.99';
            setTimeout(() => {
                daysElement.style.opacity = '1';
            }, 10);
        }
        
    } catch (error) {
        console.error('Error in updateCountdown:', error);
    }
}


function addToCart(productId) {
    console.log('addToCart function called with productId:', productId);
    console.log('Products object:', products);
    console.log('Product for ID:', products[productId]);
    
    const product = products[productId];
    if (!product) {
        console.error('Product not found for ID:', productId);
        return;
    }
    
    console.log('Product found:', product);

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Increased quantity of existing item. New quantity:', existingItem.quantity);
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        console.log('Added new item to cart');
    }
    
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`, 'success');
    applyDiwaliDiscount();
}

function removeFromCart(productId) {
    console.log('Removing product from cart. Product ID:', productId);
    cart = cart.filter(item => item.id !== productId);
    console.log('Cart after removal:', cart);
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    console.log('updateQuantity called with productId:', productId, 'change:', change);
    
    const quantityChange = parseInt(change);
    const item = cart.find(item => item.id === productId);
    
    if (!item) {
        console.error('Item not found in cart:', productId);
        return;
    }
    
    item.quantity += quantityChange;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        showNotification('Item removed from cart', 'info');
    } else {
        updateCartDisplay();
        console.log('Updated quantity for item:', productId, 'new quantity:', item.quantity);
    }
}






/**
 * Save the current cart as an order and clear the cart.
 * Redirect to dashboard.html after payment.
 */
function saveOrderAndRedirect() {
    if (!cart || cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    // Create order object with validated data
    const order = {
        date: new Date().toLocaleString(),
        items: cart.map(item => ({
            name: item.name,
            qty: item.quantity || 1,
            price: item.price !== undefined ? item.price : 0
        })),
        total: cart.reduce((sum, item) => {
            const itemPrice = item.price !== undefined ? item.price : 0;
            const itemQuantity = item.quantity || 1;
            return sum + (itemPrice * itemQuantity);
        }, 0),
        status: "Order Placed"
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();

    // Show success message
    showNotification('Order placed successfully!', 'success');

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}



function initCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    
    // Initialize cart modal functionality
    if (!cartBtn || !cartModal || !cartClose) {
        console.warn('Cart modal elements not found in DOM');
        return;
    }
    
    // Open cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close cart modal
    cartClose.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                updateCartDisplay();
                showNotification('Cart cleared successfully', 'info');
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                // Redirect to payment page
                window.location.href = 'payment.html';
            } else {
                showNotification('Your cart is empty!', 'error');
            }
        });
    }
}




function initChatbot() {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('sendButton');
    

    function toggleChatbot() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {

            chatbotInput.focus();
        }
    }
    

    function closeChatbotWindow() {
        chatbotWindow.classList.remove('active');
    }
    

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    

    function getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! Welcome to KUMBHARBAJAR. How can I help you today?';
        } else if (lowerMessage.includes('pottery') || lowerMessage.includes('clay') || lowerMessage.includes('ceramic')) {
            return 'We offer a wide variety of handmade pottery items including traditional clay pots, decorative vases, tea cups, planters, and more. All our products are crafted by skilled artisans using traditional techniques.';
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
            return 'Our prices vary depending on the item and its size. Traditional clay pots start at ₹599, decorative vases at ₹699, and tea cups at ₹324. We offer fair pricing directly from the artisans.';
        } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('deliver')) {
            return 'We offer nationwide delivery with secure packaging. Delivery typically takes 3-7 business days depending on your location. We provide tracking information once your order ships.';
        } else if (lowerMessage.includes('custom') || lowerMessage.includes('special') || lowerMessage.includes('unique')) {
            return 'Yes! We offer custom pottery orders. You can request personalized pieces with specific sizes, colors, and designs. Visit our Custom Orders section to submit your request.';
        } else if (lowerMessage.includes('artisan') || lowerMessage.includes('potter') || lowerMessage.includes('maker')) {
            return 'We connect customers directly with traditional potters across India. If you\'re an artisan looking to join our platform, visit our Join as Potter section to register.';
        } else if (lowerMessage.includes('thank')) {
            return 'You\'re welcome! Is there anything else I can help you with?';
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('exit')) {
            return 'Thank you for chatting with us! Have a wonderful day.';
        } else {
            return 'I\'m here to help with questions about our pottery products, ordering process, delivery, or becoming an artisan. Could you please specify what you\'d like to know?';
        }
    }
    

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {

            addMessage(message, true);
            

            chatbotInput.value = '';
            

            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, false);
            }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5 seconds
        }
    }
    

    if (chatbotButton) {
        chatbotButton.addEventListener('click', toggleChatbot);
    }
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', closeChatbotWindow);
    }
    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    

    document.addEventListener('click', (e) => {
        if (!chatbotWindow.contains(e.target) && !chatbotButton.contains(e.target) && chatbotWindow.classList.contains('active')) {
            closeChatbotWindow();
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    initWelcomeScreen();
    initThemeSystem();
    initChatbot();
});



function updateCartDisplay() {
    console.log('updateCartDisplay function called');
    console.log('Current cart contents:', cart);
    
    // Validate and repair cart data
    cart = cart.map(item => {
        if (item.price === undefined || item.price === null) {
            const productData = products[item.id];
            if (productData && productData.price !== undefined) {
                item.price = productData.price;
            } else {
                item.price = 0;
            }
        }
        return {
            ...item,
            quantity: item.quantity || 1
        };
    });
    
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log('Total items in cart:', totalItems);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        console.log('Updated cart count display');
    } else {
        console.error('Cart count element not found');
    }
    
    // Update cart items display
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            console.log('Cart is empty, showing empty message');
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₹${item.price || 0}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            console.log('Updated cart items display');
        }
    } else {
        console.error('Cart items element not found');
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => {
            const itemPrice = item.price !== undefined ? item.price : 0;
            const itemQuantity = item.quantity || 0;
            return sum + (itemPrice * itemQuantity);
        }, 0);
        console.log('Cart total:', total);
        cartTotal.textContent = total;
    } else {
        console.error('Cart total element not found');
    }
    
    if (cartFooter) {
        cartFooter.style.display = cart.length > 0 ? 'block' : 'none';
        console.log('Updated cart footer display');
    } else {
        console.error('Cart footer element not found');
    }
}


function initAddToCartButtons() {
    console.log('Initializing Add to Cart Buttons...');
    

    setTimeout(() => {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        console.log('Found', addToCartBtns.length, 'add-to-cart buttons');
        
        if (addToCartBtns.length === 0) {
            console.warn('No add to cart buttons found');
            return;
        }
        

        addToCartBtns.forEach(btn => {

            const newBtn = document.createElement('button');
            newBtn.className = btn.className;
            newBtn.setAttribute('data-product-id', btn.getAttribute('data-product-id'));
            newBtn.textContent = btn.textContent;
            

            btn.parentNode.replaceChild(newBtn, btn);
            

            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = parseInt(this.getAttribute('data-product-id'));
                console.log('Add to cart button clicked for product ID:', productId);
                
                if (productId && products[productId]) {
                    addToCart(productId);
                } else {
                    console.error('Invalid product ID or product not found:', productId);
                    showNotification('Error adding product to cart', 'error');
                }
            });
        });
    }, 100);
}


function initProductModal() {
    console.log('Initializing Product Modal System...');
    const productModal = document.getElementById('productModal');
    const productClose = document.getElementById('productClose');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductImage = document.getElementById('modalProductImage');
    const modalProductDescription = document.getElementById('modalProductDescription');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalAddToCart = document.getElementById('modalAddToCart');
    

    if (!productModal || !productClose || !modalProductName || !modalProductImage || 
        !modalProductDescription || !modalProductPrice || !modalAddToCart) {
        console.error('Product modal elements not found in DOM');
        return;
    }
    

    setTimeout(() => {
        const viewDetailBtns = document.querySelectorAll('.view-details');
        console.log('Found', viewDetailBtns.length, 'view-details buttons');
        
        viewDetailBtns.forEach(btn => {

            const newBtn = document.createElement('button');
            newBtn.className = btn.className;
            newBtn.setAttribute('data-product-id', btn.getAttribute('data-product-id'));
            newBtn.textContent = btn.textContent;
            

            btn.parentNode.replaceChild(newBtn, btn);
            

            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = parseInt(this.getAttribute('data-product-id'));
                console.log('View detail button clicked for product ID:', productId);
                const product = products[productId];
                
                if (product) {

                    const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
                    let productImageSrc = '';
                    
                    if (productCard) {
                        const productImage = productCard.querySelector('.product-image img');
                        if (productImage) {
                            productImageSrc = productImage.src;
                        }
                    }
                    
                    currentProductId = productId;
                    modalProductName.textContent = product.name;
                    modalProductImage.src = productImageSrc || product.image;
                    modalProductImage.alt = product.name;
                    modalProductDescription.textContent = product.description;
                    modalProductPrice.textContent = product.price || 0;
                    
                    productModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    console.error('Product not found for ID:', productId);
                    showNotification('Product not found', 'error');
                }
            });
        });
    }, 100);
    

    setTimeout(() => {
        const newProductClose = document.createElement('button');
        newProductClose.id = 'productClose';
        newProductClose.className = productClose.className;
        newProductClose.innerHTML = productClose.innerHTML;
        
        productClose.parentNode.replaceChild(newProductClose, productClose);
        
        newProductClose.addEventListener('click', () => {
            productModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }, 100);
    

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    

    setTimeout(() => {
        const newModalAddToCart = document.createElement('button');
        newModalAddToCart.id = 'modalAddToCart';
        newModalAddToCart.className = modalAddToCart.className;
        newModalAddToCart.textContent = modalAddToCart.textContent;
        
        modalAddToCart.parentNode.replaceChild(newModalAddToCart, modalAddToCart);
        
        newModalAddToCart.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Add to cart from modal clicked. Current product ID:', currentProductId);
            
            if (currentProductId && products[currentProductId]) {
                addToCart(currentProductId);
                productModal.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                console.error('Invalid product ID or product not found in modal:', currentProductId);
                showNotification('Error adding product to cart', 'error');
            }
        });
    }, 100);
}


function initCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    

    if (!cartBtn || !cartModal || !cartClose) {
        console.warn('Cart modal elements not found in DOM');
        return;
    }
    

    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    

    cartClose.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCartDisplay();
        });
    }
    
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {

                localStorage.setItem('cart', JSON.stringify(cart));

                window.location.href = 'payment.html';
            } else {
                showNotification('Your cart is empty!', 'error');
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing systems...');
    
    initWelcomeScreen();
    initThemeSystem();
    initCartModal();
    

    console.log('Initializing product modal and add to cart buttons...');
    initProductModal();
    initAddToCartButtons();
    

    console.log('Initializing video previews...');
    initVideoPreviews();
    

    setTimeout(() => {
        console.log('Initializing Diwali countdown...');
        initCountdown();
    }, 300);
    
    initMagneticButtons();
    initCustomCursor();
});


setTimeout(() => {
    createParticles();
    initTiltEffect();
    initCardFlipEffect();
    initButtonEffects();
    initFormInteractions();
    initScrollAnimations();
    initEnhancedParallax();
    

    updateCartDisplay();
}, 100);


window.addEventListener('load', function() {
    console.log('Window fully loaded - backup countdown initialization...');
    

    setTimeout(() => {
        console.log('Running backup countdown initialization...');
        

        const countdownContainer = document.getElementById('diwaliCountdown');
        if (countdownContainer) {
            console.log('Found countdown container, forcing update...');
            

            updateCountdown();
            

            setInterval(updateCountdown, 1000);
        }
    }, 2000);
});


setTimeout(() => {
    console.log('Manual countdown trigger after 3 seconds...');
    if (typeof updateCountdown === 'function') {
        updateCountdown();
        

        const now = new Date();
        const currentSeconds = now.getSeconds();
        const currentMinutes = now.getMinutes();
        const currentHours = now.getHours();
        
        console.log('Current time for testing:', {
            hours: currentHours,
            minutes: currentMinutes, 
            seconds: currentSeconds
        });
        

        const secondsElement = document.getElementById('seconds');
        if (secondsElement) {
            console.log('Testing: Setting seconds to current seconds:', currentSeconds);
            secondsElement.textContent = currentSeconds.toString().padStart(2, '0');
            

            setTimeout(() => {
                console.log('Reverting to countdown...');
                updateCountdown();
            }, 2000);
        }
    }
}, 3000);


const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    setTimeout(() => {
        heroContent.style.opacity = '1';
    }, 500);
}


const pots = document.querySelectorAll('.pot');
pots.forEach((pot, index) => {
    pot.style.animationDelay = `${index * 0.5}s`;
});


const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});


document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});


document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});


const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


initMagneticButtons();


initCustomCursor();


function initVideoPreviews() {
    console.log('Initializing video previews...');
    

    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {

        const iframe = container.querySelector('iframe');
        if (iframe) {

            const src = iframe.src || iframe.getAttribute('data-src');
            if (src) {
                iframe.setAttribute('data-src', src);
                iframe.removeAttribute('src');
            }
        }
        
        container.addEventListener('click', function() {

            this.classList.add('active');
            

            const iframe = this.querySelector('iframe');
            

            if (iframe && !iframe.src) {
                const src = iframe.getAttribute('data-src');
                if (src) {
                    iframe.src = src;
                }
            }
        });
    });
}
