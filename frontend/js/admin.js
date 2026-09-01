document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
});

async function checkAdminAuth() {
    const user = window.API.getUser();
    const token = window.API.getToken();

    const authScreen = document.getElementById('adminAuthScreen');
    const appScreen = document.getElementById('adminPortalApp');

    if (user && token && user.role === 'admin') {
        if (authScreen) authScreen.style.display = 'none';
        if (appScreen) appScreen.style.display = 'flex';
        loadAdminDashboard(user);
    } else {
        if (authScreen) authScreen.style.display = 'flex';
        if (appScreen) appScreen.style.display = 'none';
        initAdminLoginForm();
    }
}

function initAdminLoginForm() {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmailInput').value.trim();
        const password = document.getElementById('adminPassInput').value;
        const errBox = document.getElementById('adminLoginError');
        errBox.textContent = '';

        const res = await window.API.login(email, password);
        if (res.success && res.user.role === 'admin') {
            window.AuthModal.showToast('Admin access granted!');
            checkAdminAuth();
        } else if (res.success) {
            errBox.textContent = 'Access denied. Account is not an Admin.';
            window.API.logout();
        } else {
            errBox.textContent = res.message || 'Admin login failed.';
        }
    });

    const demoBtn = document.getElementById('demoAdminFillBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            document.getElementById('adminEmailInput').value = 'admin@kumbharbazar.com';
            document.getElementById('adminPassInput').value = 'admin123';
        });
    }
}

async function loadAdminDashboard(user) {
    // Load Admin Stats
    const statsRes = await window.API.getAdminStats();
    if (statsRes.success && statsRes.stats) {
        const s = statsRes.stats;
        document.getElementById('statTotalPotters').textContent = s.totalPotters;
        document.getElementById('statTotalOrders').textContent = s.totalOrders;
        document.getElementById('statTotalRevenue').textContent = `₹${s.totalRevenue}`;
        document.getElementById('statPendingApps').textContent = s.pendingApplications;
        document.getElementById('statOpenComplaints').textContent = s.openComplaints;
    }

    loadPotterApplications();
    loadAllOrders();
    loadCustomerComplaints();

    // Sidebar Nav active toggle
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
        window.API.logout();
        checkAdminAuth();
    });
}

// Potter Applications Review Desk
async function loadPotterApplications() {
    const tableBody = document.getElementById('potterAppsTable');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading applications...</td></tr>`;

    const res = await window.API.getPotterApplications();
    if (!res.success || !res.applications || res.applications.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No potter registration applications.</td></tr>`;
        return;
    }

    tableBody.innerHTML = res.applications.map(app => `
        <tr>
            <td><strong>${app.id}</strong></td>
            <td>
                <strong>${app.name}</strong><br>
                <small style="color:#64748B;">${app.email} | ${app.phone}</small>
            </td>
            <td>
                <strong>${app.workshopName}</strong><br>
                <small style="color:#64748B;">${app.location}</small>
            </td>
            <td>${app.speciality} (${app.experience})</td>
            <td>
                <span class="badge-status ${app.status === 'Approved' ? 'badge-delivered' : (app.status === 'Rejected' ? 'badge-cancelled' : 'badge-pending')}">
                    ${app.status}
                </span>
            </td>
            <td>
                ${app.status === 'Pending' ? `
                    <button onclick="reviewPotterApp('${app.id}', 'Approved')" class="btn-approve" title="Approve Potter"><i class="fas fa-check"></i> Approve</button>
                    <button onclick="reviewPotterApp('${app.id}', 'Rejected')" class="btn-reject" title="Reject Potter"><i class="fas fa-times"></i> Reject</button>
                ` : `<small style="color:#64748B;">Reviewed</small>`}
            </td>
        </tr>
    `).join('');
}

window.reviewPotterApp = async function(id, status) {
    if (!confirm(`Are you sure you want to mark application ${id} as ${status}?`)) return;
    const res = await window.API.updatePotterApplicationStatus(id, status);
    if (res.success) {
        window.AuthModal.showToast(res.message);
        loadPotterApplications();
        loadAdminDashboard(window.API.getUser());
    } else {
        window.AuthModal.showToast(res.message || 'Action failed', 'error');
    }
};

// All Orders Desk
async function loadAllOrders() {
    const tableBody = document.getElementById('adminOrdersTable');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading platform orders...</td></tr>`;

    const res = await window.API.getOrders();
    if (!res.success || !res.orders || res.orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No platform orders placed yet.</td></tr>`;
        return;
    }

    tableBody.innerHTML = res.orders.map(o => `
        <tr>
            <td><strong>${o.id}</strong></td>
            <td>
                ${o.customerName}<br>
                <small style="color:#64748B;">${o.customerEmail}</small>
            </td>
            <td>
                <span title="${o.deliveryAddress}">${o.deliveryAddress.substring(0, 30)}...</span>
                <button onclick="editOrderAddress('${o.id}', '${o.deliveryAddress}')" style="background:none; border:none; color:#3F51B5; cursor:pointer;" title="Edit Address"><i class="fas fa-edit"></i></button>
            </td>
            <td>₹${o.totalAmount}</td>
            <td>
                <select onchange="updateAdminOrderStatus('${o.id}', this.value)" style="padding:4px 8px; border-radius:4px; border:1px solid #CBD5E1;">
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

window.updateAdminOrderStatus = async function(orderId, newStatus) {
    const res = await window.API.updateOrderStatus(orderId, { status: newStatus });
    if (res.success) {
        window.AuthModal.showToast(`Order ${orderId} status set to ${newStatus}`);
        loadAllOrders();
    } else {
        window.AuthModal.showToast(res.message || 'Failed to update order', 'error');
    }
};

window.editOrderAddress = async function(orderId, currentAddr) {
    const newAddress = prompt('Edit Delivery Address for Order ' + orderId, currentAddr);
    if (!newAddress || newAddress === currentAddr) return;

    const res = await window.API.updateOrderStatus(orderId, { deliveryAddress: newAddress });
    if (res.success) {
        window.AuthModal.showToast('Delivery address updated');
        loadAllOrders();
    }
};

// Customer Complaints Desk
async function loadCustomerComplaints() {
    const tableBody = document.getElementById('complaintsTable');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading complaints...</td></tr>`;

    const res = await window.API.getComplaints();
    if (!res.success || !res.complaints || res.complaints.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No customer complaints or inquiries.</td></tr>`;
        return;
    }

    tableBody.innerHTML = res.complaints.map(c => `
        <tr>
            <td><strong>${c.id}</strong></td>
            <td>
                <strong>${c.name}</strong><br>
                <small style="color:#64748B;">${c.email} | ${c.phone}</small>
            </td>
            <td>
                <strong>${c.subject}</strong><br>
                <p style="margin:0; font-size:0.85rem; color:#475569;">"${c.message}"</p>
            </td>
            <td>
                <span class="badge-status ${c.status === 'Resolved' ? 'badge-delivered' : 'badge-pending'}">
                    ${c.status}
                </span>
            </td>
            <td>
                ${c.status === 'Open' ? `
                    <button onclick="resolveComplaintModal('${c.id}')" style="background:#3F51B5; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-reply"></i> Resolve
                    </button>
                ` : `<small style="color:#64748B;" title="${c.response}">Resolved</small>`}
            </td>
        </tr>
    `).join('');
}

window.resolveComplaintModal = async function(id) {
    const responseText = prompt('Enter support reply resolution for Complaint ' + id + ':');
    if (!responseText) return;

    const res = await window.API.resolveComplaint(id, responseText);
    if (res.success) {
        window.AuthModal.showToast(`Complaint ${id} resolved!`);
        loadCustomerComplaints();
        loadAdminDashboard(window.API.getUser());
    } else {
        window.AuthModal.showToast(res.message || 'Failed to resolve complaint', 'error');
    }
};
