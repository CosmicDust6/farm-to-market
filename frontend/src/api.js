const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export function getToken() {
  return localStorage.getItem('agriintel_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('agriintel_token', token);
  } else {
    localStorage.removeItem('agriintel_token');
  }
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('agriintel_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('agriintel_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('agriintel_user');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `Request failed (${response.status})`;
      const error = new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  async loginFarmer({ phone, farmer_id, name }) {
    try {
      const data = await request('/auth/farmer/login', {
        method: 'POST',
        body: JSON.stringify({ phone, farmer_id }),
      });
      setToken(data.access_token);
      const user = await this.getMe().catch(() => ({ name: name || farmer_id, role: 'farmer' }));
      setCurrentUser(user);
      return { token: data.access_token, user };
    } catch (err) {
      // If farmer not found but has valid ID and provided name, try register
      if (name && err.status === 400) {
        return this.registerFarmer({ name, phone, farmer_id });
      }
      throw err;
    }
  },

  async registerFarmer({ name, phone, farmer_id }) {
    const data = await request('/auth/farmer/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, farmer_id }),
    });
    setToken(data.access_token);
    const user = await this.getMe().catch(() => ({ name, phone, role: 'farmer', farmer_id }));
    setCurrentUser(user);
    return { token: data.access_token, user };
  },

  async loginBuyer({ email, password }) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    const user = await this.getMe();
    setCurrentUser(user);
    return { token: data.access_token, user };
  },

  async registerBuyer(buyerData) {
    const data = await request('/auth/buyer/register', {
      method: 'POST',
      body: JSON.stringify(buyerData),
    });
    setToken(data.access_token);
    const user = await this.getMe();
    setCurrentUser(user);
    return { token: data.access_token, user };
  },

  async loginAdmin({ email, password }) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    const user = await this.getMe();
    setCurrentUser(user);
    return { token: data.access_token, user };
  },

  async getMe() {
    return request('/auth/me');
  },

  logout() {
    setToken(null);
    setCurrentUser(null);
  },

  // Predictions (ML)
  async predictCrop({ soil_type, land_area, location, budget, water_availability }) {
    return request('/predictions/crop-recommendation', {
      method: 'POST',
      body: JSON.stringify({
        soil_type,
        land_area: parseFloat(land_area) || 2.0,
        location,
        budget: parseFloat(budget) || 30000.0,
        water_availability,
      }),
    });
  },

  async predictPrice({ crop, location }) {
    return request('/predictions/price', {
      method: 'POST',
      body: JSON.stringify({ crop, location }),
    });
  },

  // Farmer listings & Buyer Matches
  async getBuyerMatches(crop, location) {
    const params = new URLSearchParams({ crop, location });
    return request(`/matches?${params.toString()}`);
  },

  async createCropListing({ crop_name, location, description }) {
    return request('/listings', {
      method: 'POST',
      body: JSON.stringify({ crop_name, location, description }),
    });
  },

  async getMyListings() {
    return request('/listings/my');
  },

  async getAllListings() {
    return request('/listings');
  },

  // Buyer Requests
  async createBuyerRequest({ crop_name, location }) {
    return request('/requests', {
      method: 'POST',
      body: JSON.stringify({ crop_name, location }),
    });
  },

  async getMyBuyerRequests() {
    return request('/requests/my');
  },

  async getMatchesForRequest(requestId) {
    return request(`/matches/${requestId}`);
  },

  // Support
  async createSupportQuery(question) {
    return request('/support', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  },

  async getMySupportQueries() {
    return request('/support/my');
  },

  // Admin
  async getAdminStats() {
    return request('/admin/stats');
  },

  async getAdminFarmers() {
    return request('/admin/farmers');
  },

  async getAdminBuyers() {
    return request('/admin/buyers');
  },

  async getAdminSupport() {
    return request('/admin/support');
  },

  async resolveSupportQuery(queryId, status = 'resolved') {
    return request(`/admin/support/${queryId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
