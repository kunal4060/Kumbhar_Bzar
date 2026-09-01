(function() {
  let pendingActionCallback = null;

  function renderAuthModal() {
    if (document.getElementById('authModal')) return;

    const modalHtml = `
      <div class="auth-modal-overlay" id="authModal" style="display:none;">
        <div class="auth-modal-card">
          <button class="auth-modal-close" id="authModalClose">&times;</button>
          
          <div class="auth-modal-header">
            <div class="auth-logo">
              <i class="fas fa-wine-bottle"></i>
              <span>KUMBHARBAJAR</span>
            </div>
            <h3 class="auth-title" id="authTitle">Welcome to Kumbhar Bazar</h3>
            <p class="auth-subtitle" id="authSubtitle">Please log in or create an account to complete your order</p>
          </div>

          <div class="auth-tabs">
            <button class="auth-tab active" id="tabLoginBtn">Login</button>
            <button class="auth-tab" id="tabRegisterBtn">Create Account</button>
          </div>

          <!-- Login Form -->
          <form class="auth-form" id="loginForm">
            <div class="form-group">
              <label><i class="fas fa-envelope"></i> Email Address</label>
              <input type="email" id="loginEmail" placeholder="Enter your email" required value="customer@gmail.com">
            </div>
            <div class="form-group">
              <label><i class="fas fa-lock"></i> Password</label>
              <input type="password" id="loginPassword" placeholder="Enter your password" required value="customer123">
            </div>
            <div class="auth-error-msg" id="loginError"></div>
            <button type="submit" class="auth-submit-btn">
              <span>Sign In & Continue</span> <i class="fas fa-arrow-right"></i>
            </button>
          </form>

          <!-- Register Form -->
          <form class="auth-form" id="registerForm" style="display:none;">
            <div class="form-group">
              <label><i class="fas fa-user"></i> Full Name</label>
              <input type="text" id="regName" placeholder="e.g. Rahul Sharma" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-envelope"></i> Email Address</label>
              <input type="email" id="regEmail" placeholder="e.g. rahul@example.com" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-phone"></i> Phone Number</label>
              <input type="tel" id="regPhone" placeholder="e.g. 9876543210" required>
            </div>
            <div class="form-group">
              <label><i class="fas fa-lock"></i> Password</label>
              <input type="password" id="regPassword" placeholder="Create password" required minlength="4">
            </div>
            <div class="auth-error-msg" id="regError"></div>
            <button type="submit" class="auth-submit-btn">
              <span>Create Account</span> <i class="fas fa-user-plus"></i>
            </button>
          </form>

          <!-- Quick Demo Buttons -->
          <div class="quick-demo-accounts">
            <p>⚡ Quick Demo Autofill:</p>
            <div class="demo-btn-group">
              <button type="button" class="demo-chip" id="demoCustomerBtn">Customer</button>
              <button type="button" class="demo-chip" id="demoPotterBtn">Potter</button>
              <button type="button" class="demo-chip" id="demoAdminBtn">Admin</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Event Listeners
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('authModalClose');
    const tabLogin = document.getElementById('tabLoginBtn');
    const tabRegister = document.getElementById('tabRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    closeBtn.addEventListener('click', hideAuthModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideAuthModal();
    });

    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      document.getElementById('authTitle').textContent = 'Welcome Back';
      document.getElementById('authSubtitle').textContent = 'Log in to complete your pottery purchase';
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
      document.getElementById('authTitle').textContent = 'Join Kumbhar Bazar';
      document.getElementById('authSubtitle').textContent = 'Create an account to track orders & support authentic potters';
    });

    // Quick Demo Autofill handlers
    document.getElementById('demoCustomerBtn').addEventListener('click', () => {
      tabLogin.click();
      document.getElementById('loginEmail').value = 'customer@gmail.com';
      document.getElementById('loginPassword').value = 'customer123';
    });
    document.getElementById('demoPotterBtn').addEventListener('click', () => {
      tabLogin.click();
      document.getElementById('loginEmail').value = 'ramesh@kumbharbazar.com';
      document.getElementById('loginPassword').value = 'potter123';
    });
    document.getElementById('demoAdminBtn').addEventListener('click', () => {
      tabLogin.click();
      document.getElementById('loginEmail').value = 'admin@kumbharbazar.com';
      document.getElementById('loginPassword').value = 'admin123';
    });

    // Submit Handlers
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = document.getElementById('loginError');
      errBox.textContent = '';
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      const res = await window.API.login(email, password);
      if (res.success) {
        showToast(res.message || 'Login successful!');
        hideAuthModal();
        if (window.updateNavUserUI) window.updateNavUserUI();
        if (pendingActionCallback) {
          pendingActionCallback(res.user);
          pendingActionCallback = null;
        }
      } else {
        errBox.textContent = res.message || 'Login failed.';
      }
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = document.getElementById('regError');
      errBox.textContent = '';

      const userData = {
        name: document.getElementById('regName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        phone: document.getElementById('regPhone').value.trim(),
        password: document.getElementById('regPassword').value,
        role: 'customer'
      };

      const res = await window.API.register(userData);
      if (res.success) {
        showToast('Account created successfully!');
        hideAuthModal();
        if (window.updateNavUserUI) window.updateNavUserUI();
        if (pendingActionCallback) {
          pendingActionCallback(res.user);
          pendingActionCallback = null;
        }
      } else {
        errBox.textContent = res.message || 'Registration failed.';
      }
    });
  }

  function showAuthModal(callbackOnSuccess) {
    renderAuthModal();
    pendingActionCallback = callbackOnSuccess || null;
    const modal = document.getElementById('authModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function requireUserAuth(callback) {
    const user = window.API.getUser();
    if (user && window.API.getToken()) {
      callback(user);
    } else {
      showAuthModal(callback);
    }
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  window.AuthModal = {
    show: showAuthModal,
    hide: hideAuthModal,
    requireAuth: requireUserAuth,
    showToast
  };
})();
