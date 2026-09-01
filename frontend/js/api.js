const API_BASE = window.location.origin.includes('5000') || window.location.origin.includes('3000')
  ? `${window.location.origin}/api`
  : 'http://localhost:5000/api';

const API = {
  getToken() {
    return localStorage.getItem('kb_token') || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('kb_token', token);
    } else {
      localStorage.removeItem('kb_token');
    }
  },

  getUser() {
    const raw = localStorage.getItem('kb_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('kb_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kb_user');
    }
  },

  logout() {
    localStorage.removeItem('kb_token');
    localStorage.removeItem('kb_user');
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      return { success: false, message: 'Network connection failed. Make sure backend server is running.' };
    }
  },

  // Auth APIs
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.success && res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.success && res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async getMe() {
    return await this.request('/auth/me');
  },

  // Products APIs
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/products?${query}`);
  },

  async createProduct(productData) {
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, productData) {
    return await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Orders APIs
  async createOrder(orderData) {
    return await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getOrders() {
    return await this.request('/orders');
  },

  async updateOrderStatus(id, statusData) {
    return await this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    });
  },

  // Potter Applications APIs
  async submitPotterApplication(appData) {
    return await this.request('/potter-applications', {
      method: 'POST',
      body: JSON.stringify(appData)
    });
  },

  async getPotterApplications() {
    return await this.request('/potter-applications');
  },

  async updatePotterApplicationStatus(id, status) {
    return await this.request(`/potter-applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Complaints APIs
  async submitComplaint(data) {
    return await this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getComplaints() {
    return await this.request('/complaints');
  },

  async resolveComplaint(id, responseText) {
    return await this.request(`/complaints/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ response: responseText })
    });
  },

  // Stats APIs
  async getPotterStats() {
    return await this.request('/stats/potter');
  },

  async getAdminStats() {
    return await this.request('/stats/admin');
  }
};

window.API = API;
