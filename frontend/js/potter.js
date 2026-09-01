document.addEventListener('DOMContentLoaded', () => {
    checkPotterAuth();
});

async function checkPotterAuth() {
    const user = window.API.getUser();
    const token = window.API.getToken();

    const authContainer = document.getElementById('potterAuthScreen');
    const portalContainer = document.getElementById('potterPortalApp');

    if (user && token && (user.role === 'potter' || user.role === 'admin')) {
        if (authContainer) authContainer.style.display = 'none';
        if (portalContainer) portalContainer.style.display = 'flex';
        loadPotterDashboard(user);
    } else {
        if (authContainer) authContainer.style.display = 'flex';
        if (portalContainer) portalContainer.style.display = 'none';
        initPotterLoginForm();
    }
}

function initPotterLoginForm() {
    const form = document.getElementById('potterLoginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('potterEmailInput').value.trim();
        const password = document.getElementById('potterPassInput').value;
        const errBox = document.getElementById('potterLoginError');
        errBox.textContent = '';

        const res = await window.API.login(email, password);
        if (res.success && (res.user.role === 'potter' || res.user.role === 'admin')) {
            window.AuthModal.showToast(`Welcome to your Potter Workshop, ${res.user.name}!`);
            checkPotterAuth();
        } else if (res.success) {
            errBox.textContent = 'Account exists but is not registered as a Potter. Please register as a potter or wait for admin approval.';
            window.API.logout();
        } else {
            errBox.textContent = res.message || 'Login failed.';
        }
    });

    // Quick fill demo potter
    const demoBtn = document.getElementById('demoPotterFillBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            document.getElementById('potterEmailInput').value = 'ramesh@kumbharbazar.com';
            document.getElementById('potterPassInput').value = 'potter123';
        });
    }
}

async function loadPotterDashboard(user) {
    document.getElementById('potterNameBadge').textContent = user.workshopName || user.name;

    // Load Stats
    const statsRes = await window.API.getPotterStats();
    if (statsRes.success && statsRes.stats) {
        const s = statsRes.stats;
        document.getElementById('statSales').textContent = `₹${s.totalSales}`;
        document.getElementById('statOrders').textContent = s.totalOrders;
        document.getElementById('statProducts').textContent = s.totalProducts;
        document.getElementById('statPending').textContent = s.pendingOrders;
    }

    // Load Products
    loadPotterProducts(user.id);

    // Load Orders
    loadPotterOrders();

    // Add Product Modal trigger
    const addBtn = document.getElementById('openAddProductModalBtn');
    if (addBtn) {
        addBtn.addEventListener('click', openAddProductModal);
    }

    // Sidebar Nav active toggle
    document.querySelectorAll('.portal-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                document.querySelectorAll('.portal-nav a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Logout
    document.getElementById('potterLogoutBtn').addEventListener('click', () => {
        window.API.logout();
        checkPotterAuth();
    });
}

async function loadPotterProducts(potterId) {
    const tableBody = document.getElementById('potterProductsTable');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading listings...</td></tr>`;

    const res = await window.API.getProducts({ potterId });
    if (!res.success || !res.products || res.products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No products listed yet. Click "+ Add New Product" to list your pottery!</td></tr>`;
        return;
    }

    tableBody.innerHTML = res.products.map(p => `
        <tr>
            <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                    <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:6px;" onerror="this.src='frontend/images/claypots.webp'">
                    <strong>${p.title}</strong>
                </div>
            </td>
            <td><span style="text-transform:capitalize;">${p.category}</span></td>
            <td>₹${p.price}</td>
            <td>${p.stock} units</td>
            <td><span class="badge-status badge-shipped">${p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
            <td>
                <button onclick="deletePotterProduct('${p.id}')" style="background:#FFEBEB; color:#D32F2F; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Delete Listing">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function loadPotterOrders() {
    const tableBody = document.getElementById('potterOrdersTable');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading orders...</td></tr>`;

    const res = await window.API.getOrders();
    if (!res.success || !res.orders || res.orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No orders received yet.</td></tr>`;
        return;
    }

    tableBody.innerHTML = res.orders.map(o => `
        <tr>
            <td><strong>${o.id}</strong></td>
            <td>${o.customerName}<br><small style="color:#7A6A56;">${o.customerPhone}</small></td>
            <td>${o.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}</td>
            <td>₹${o.totalAmount}</td>
            <td>
                <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:4px 8px; border-radius:4px; border:1px solid #E0D5C1;">
                    <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td><small>${new Date(o.createdAt).toLocaleDateString()}</small></td>
        </tr>
    `).join('');
}

window.deletePotterProduct = async function(id) {
    if (!confirm('Are you sure you want to delete this product listing?')) return;
    const res = await window.API.deleteProduct(id);
    if (res.success) {
        window.AuthModal.showToast('Product deleted');
        const user = window.API.getUser();
        loadPotterProducts(user.id);
    } else {
        window.AuthModal.showToast(res.message || 'Failed to delete', 'error');
    }
};

window.updateOrderStatus = async function(orderId, newStatus) {
    const res = await window.API.updateOrderStatus(orderId, { status: newStatus });
    if (res.success) {
        window.AuthModal.showToast(`Order ${orderId} updated to ${newStatus}`);
        loadPotterOrders();
    } else {
        window.AuthModal.showToast(res.message || 'Failed to update order', 'error');
    }
};

function openAddProductModal() {
    let modal = document.getElementById('addProductModal');
    if (!modal) {
        const modalHtml = `
            <div class="modal-overlay" id="addProductModal">
                <div class="modal-box">
                    <button style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:1.4rem; cursor:pointer;" id="closeAddProductBtn">&times;</button>
                    <h3 style="margin-bottom:1.25rem;"><i class="fas fa-plus-circle"></i> Add New Pottery Item</h3>
                    <form id="newProductForm">
                        <div style="margin-bottom:1rem;">
                            <label style="display:block; font-size:0.85rem; margin-bottom:4px;">Product Title</label>
                            <input type="text" id="npTitle" placeholder="e.g. Handcrafted Terracotta Water Jug" required style="width:100%; padding:0.6rem; border:1px solid #CCC; border-radius:6px;">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
                            <div>
                                <label style="display:block; font-size:0.85rem; margin-bottom:4px;">Category</label>
                                <select id="npCategory" style="width:100%; padding:0.6rem; border:1px solid #CCC; border-radius:6px;">
                                    <option value="diyas">Festive Diyas</option>
                                    <option value="cookware">Clay Cookware</option>
                                    <option value="tableware">Earthy Tableware</option>
                                    <option value="home-decor">Home Decor & Vases</option>
                                    <option value="planters">Garden Planters</option>
                                </select>
                            </div>
                            <div>
                                <label style="display:block; font-size:0.85rem; margin-bottom:4px;">Selling Price (₹)</label>
                                <input type="number" id="npPrice" placeholder="499" required style="width:100%; padding:0.6rem; border:1px solid #CCC; border-radius:6px;">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
                            <div>
                                <label style="display:block; font-size:0.85rem; margin-bottom:4px;">Stock Quantity</label>
                                <input type="number" id="npStock" placeholder="20" value="25" style="width:100%; padding:0.6rem; border:1px solid #CCC; border-radius:6px;">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.85rem; margin-bottom:4px;">Image Asset Path / URL</label>
                                <select id="npImage" style="width:100%; padding:0.6rem; border:1px solid #CCC; border-radius:6px;">
                                    <option value="frontend/images/matka.avif">Water Matka</option>
                                    <option value="frontend/images/diya.jpg">Handcrafted Diyas</option>
                                    <option value="frontend/images/cookpots.avif">Clay Cookware</option>
                                    <option value="frontend/images/tea.webp">Chai Kulhad</option>
                                    <option value="frontend/images/vases.jpg">Pottery Vase</option>
                                    <option value="frontend/images/plant.jpg">Terracotta Planter</option>
                                    <option value="frontend/images/claypots.webp">Artisanal Clay Pots</option>
                                </select>
                            </div>
                        </div>
                        <div style="margin-bottom:1.25rem;">
                            <label style="display:block; font-size:0.85rem; margin-bottom:4px;">Description</label>
                            <textarea id="npDescription" rows="3" placeholder="Describe craft materials, natural clay benefits, dimensions..." style="width:100%; padding:0.6rem; border:1px solid #CCC; border-radius:6px;"></textarea>
                        </div>
                        <button type="submit" style="width:100%; padding:0.75rem; background:#8B4513; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">
                            List Product on Marketplace
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.getElementById('addProductModal');
        document.getElementById('closeAddProductBtn').addEventListener('click', () => modal.remove());

        document.getElementById('newProductForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const productData = {
                title: document.getElementById('npTitle').value.trim(),
                category: document.getElementById('npCategory').value,
                price: Number(document.getElementById('npPrice').value),
                stock: Number(document.getElementById('npStock').value),
                image: document.getElementById('npImage').value,
                description: document.getElementById('npDescription').value.trim()
            };

            const res = await window.API.createProduct(productData);
            if (res.success) {
                window.AuthModal.showToast('New pottery product listed successfully!');
                modal.remove();
                const user = window.API.getUser();
                loadPotterProducts(user.id);
            } else {
                window.AuthModal.showToast(res.message || 'Failed to add product', 'error');
            }
        });
    }
}
