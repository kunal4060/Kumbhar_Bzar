document.addEventListener('DOMContentLoaded', () => {
    initWelcomeScreen();
    initThemeSystem();
    initProductsAndCart();
    initPotterForm();
    initContactForm();
    updateNavUserUI();
});

// Welcome Screen Logic
function initWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (!welcomeScreen) return;

    // Check if user previously skipped/seen in session
    if (sessionStorage.getItem('kb_welcome_seen') === 'true') {
        welcomeScreen.style.display = 'none';
        welcomeScreen.remove();
        document.body.style.overflow = '';
        return;
    }

    document.body.style.overflow = 'hidden';
    const progressBar = welcomeScreen.querySelector('.loading-progress');
    const loadingText = welcomeScreen.querySelector('.loading-text');
    const skipBtn = document.getElementById('skipWelcomeBtn');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 10;
        if (progress > 100) progress = 100;

        if (progressBar) progressBar.style.width = progress + '%';

        if (loadingText) {
            if (progress < 30) loadingText.textContent = 'Loading Traditional Artistry...';
            else if (progress < 65) loadingText.textContent = 'Connecting with Master Potters...';
            else if (progress < 90) loadingText.textContent = 'Preparing Marketplace...';
            else loadingText.textContent = 'Welcome to KUMBHARBAJAR!';
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(closeWelcome, 400);
        }
    }, 150);

    function closeWelcome() {
        clearInterval(interval);
        sessionStorage.setItem('kb_welcome_seen', 'true');
        welcomeScreen.classList.add('fade-out');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (welcomeScreen.parentNode) welcomeScreen.remove();
        }, 800);
    }

    if (skipBtn) skipBtn.addEventListener('click', closeWelcome);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeWelcome();
    });
}

// Theme Switcher
function initThemeSystem() {
    const themeBtn = document.getElementById('themeBtn');
    const themeOptions = document.getElementById('themeOptions');
    if (!themeBtn || !themeOptions) return;

    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeOptions.classList.toggle('active');
    });

    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            themeOptions.classList.remove('active');
            localStorage.setItem('kb_theme', theme);
        });
    });

    document.addEventListener('click', () => themeOptions.classList.remove('active'));

    const savedTheme = localStorage.getItem('kb_theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
}

// User Nav UI
function updateNavUserUI() {
    const user = window.API.getUser();
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    let userContainer = document.getElementById('navUserContainer');
    if (!userContainer) {
        userContainer = document.createElement('div');
        userContainer.id = 'navUserContainer';
        navActions.insertBefore(userContainer, navActions.firstChild);
    }

    if (user && window.API.getToken()) {
        const firstLetter = (user.name || 'U').charAt(0).toUpperCase();
        userContainer.innerHTML = `
            <div class="user-nav-badge">
                <div class="user-avatar-circle">${firstLetter}</div>
                <span>${user.name.split(' ')[0]}</span>
                ${user.role === 'admin' ? '<a href="admin.html" title="Admin Control Panel" style="color:var(--gold);margin-left:4px;"><i class="fas fa-crown"></i></a>' : ''}
                ${user.role === 'potter' ? '<a href="potter.html" title="Potter Seller Dashboard" style="color:var(--terracotta);margin-left:4px;"><i class="fas fa-store"></i></a>' : ''}
                <button id="logoutBtn" title="Logout" style="background:none;border:none;cursor:pointer;color:var(--text-muted);margin-left:6px;"><i class="fas fa-sign-out-alt"></i></button>
            </div>
        `;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.API.logout();
            window.AuthModal.showToast('Logged out successfully');
            updateNavUserUI();
        });
    } else {
        userContainer.innerHTML = `
            <button class="nav-btn btn-secondary" id="navLoginBtn">
                <i class="fas fa-user"></i> Login / Register
            </button>
        `;
        document.getElementById('navLoginBtn').addEventListener('click', () => {
            window.AuthModal.show();
        });
    }
}
window.updateNavUserUI = updateNavUserUI;

// Products & Cart State
let cart = JSON.parse(localStorage.getItem('kb_cart') || '[]');

function saveCart() {
    localStorage.setItem('kb_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) {
        const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.textContent = totalCount;
    }
}

async function initProductsAndCart() {
    updateCartBadge();
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Loading artisanal products...</p></div>`;

    const response = await window.API.getProducts();

    if (!response.success || !response.products || response.products.length === 0) {
        productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><p>No products available right now.</p></div>`;
        return;
    }

    renderProducts(response.products);

    // Category Filter Listeners
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', async () => {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const category = chip.getAttribute('data-category');
            productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>`;
            const res = await window.API.getProducts({ category });
            if (res.success) renderProducts(res.products);
        });
    });

    // Live Product Search Listener
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const search = e.target.value.trim();
                const activeCategoryChip = document.querySelector('.category-chip.active');
                const category = activeCategoryChip ? activeCategoryChip.getAttribute('data-category') : 'all';
                
                const res = await window.API.getProducts({ search, category });
                if (res.success) renderProducts(res.products);
            }, 250);
        });
    }

    // Cart Button Drawer trigger
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCartDrawer);
    }
}

function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><p>No products found in this category.</p></div>`;
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='frontend/images/claypots.webp'">
                ${product.isFeatured ? '<span class="product-badge">Featured</span>' : ''}
            </div>
            <div class="product-info">
                <span class="potter-tag"><i class="fas fa-hands"></i> ${product.workshopName || product.potterName}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <div class="price-box">
                        <span class="current-price">₹${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                    </div>
                    <button class="buy-now-btn" onclick="handleBuyClick('${product.id}')">
                        <i class="fas fa-shopping-bag"></i> Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.handleBuyClick = async function(productId) {
    // Requires Buyer Auth Popup if not logged in!
    window.AuthModal.requireAuth(async (user) => {
        const res = await window.API.getProducts();
        const product = (res.products || []).find(p => p.id === productId);
        if (!product) return;

        // Add to cart
        const existingIndex = cart.findIndex(item => item.productId === productId);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                potterId: product.potterId,
                quantity: 1
            });
        }
        saveCart();
        window.AuthModal.showToast(`Added '${product.title}' to cart!`);
        openCartDrawer();
    });
};

function openCartDrawer() {
    let drawer = document.getElementById('cartDrawerModal');
    if (!drawer) {
        const drawerHtml = `
            <div class="auth-modal-overlay" id="cartDrawerModal" style="display:none;">
                <div class="auth-modal-card" style="max-width: 520px;">
                    <button class="auth-modal-close" id="closeCartBtn">&times;</button>
                    <div class="auth-modal-header">
                        <h3><i class="fas fa-shopping-cart"></i> Your Shopping Cart</h3>
                    </div>
                    <div id="cartItemsContainer" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;"></div>
                    <div id="cartSummaryBox" style="border-top: 1px solid var(--border-color); padding-top: 1rem;"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHtml);
        drawer = document.getElementById('cartDrawerModal');
        document.getElementById('closeCartBtn').addEventListener('click', () => {
            drawer.style.display = 'none';
        });
    }

    renderCartItems();
    drawer.style.display = 'flex';
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const summary = document.getElementById('cartSummaryBox');

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:2rem;"><p>Your cart is empty.</p></div>`;
        summary.innerHTML = '';
        return;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    container.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom:1px solid #EEE;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <img src="${item.image}" style="width:48px; height:48px; object-fit:cover; border-radius:6px;" onerror="this.src='frontend/images/claypots.webp'">
                <div>
                    <h5 style="margin:0; font-size:0.9rem;">${item.title}</h5>
                    <span style="font-size:0.8rem; color:var(--text-muted);">₹${item.price} x ${item.quantity}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <button onclick="changeCartQty(${idx}, -1)" style="padding:2px 8px;">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeCartQty(${idx}, 1)" style="padding:2px 8px;">+</button>
                <button onclick="removeCartItem(${idx})" style="color:red; background:none; border:none; margin-left:8px; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');

    summary.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;"><span>Subtotal:</span><strong>₹${subtotal}</strong></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;"><span>Shipping:</span><strong>${shipping === 0 ? 'FREE' : '₹' + shipping}</strong></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; font-size:1.1rem; color:var(--dark-brown);"><span>Total Amount:</span><strong>₹${total}</strong></div>
        <button onclick="proceedToCheckout()" class="auth-submit-btn" style="width:100%;">
            Proceed to Checkout <i class="fas fa-check-circle"></i>
        </button>
    `;
}

window.changeCartQty = function(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        saveCart();
        renderCartItems();
    }
};

window.removeCartItem = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
};

window.proceedToCheckout = function() {
    window.AuthModal.requireAuth(async (user) => {
        if (cart.length === 0) {
            window.AuthModal.showToast('Your cart is empty', 'error');
            return;
        }

        const res = await window.API.createOrder({
            items: cart,
            deliveryAddress: user.address || "Standard Address",
            customerPhone: user.phone || "+91 9876543210",
            paymentMethod: "UPI / Online Payment"
        });

        if (res.success) {
            cart = [];
            saveCart();
            document.getElementById('cartDrawerModal').style.display = 'none';
            window.AuthModal.showToast(`Order ${res.order.id} placed successfully!`);
            window.location.href = `dashboard.html?orderId=${res.order.id}`;
        } else {
            window.AuthModal.showToast(res.message || 'Checkout failed', 'error');
        }
    });
};

// Potter Application Form Handler
function initPotterForm() {
    const form = document.getElementById('potterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('potterName').value.trim(),
            email: document.getElementById('potterEmail').value.trim(),
            phone: document.getElementById('potterPhone').value.trim(),
            workshopName: document.getElementById('potterWorkshop').value.trim(),
            location: document.getElementById('potterLocation').value.trim(),
            speciality: document.getElementById('potterSpeciality').value.trim(),
            experience: document.getElementById('potterExp').value.trim(),
            bio: document.getElementById('potterBio').value.trim()
        };

        const res = await window.API.submitPotterApplication(formData);

        if (res.success) {
            window.AuthModal.showToast(res.message);
            form.reset();
        } else {
            window.AuthModal.showToast(res.message || 'Submission failed.', 'error');
        }
    });
}

// Contact Form Handler
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            phone: document.getElementById('contactPhone').value.trim(),
            subject: document.getElementById('contactSubject').value.trim(),
            message: document.getElementById('contactMessage').value.trim()
        };

        const res = await window.API.submitComplaint(formData);

        if (res.success) {
            window.AuthModal.showToast(res.message);
            form.reset();
        } else {
            window.AuthModal.showToast(res.message || 'Failed to submit contact message', 'error');
        }
    });
}
