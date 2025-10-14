const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with auth token
  getHeaders(token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.token),
      ...options,
    };

    console.log('API Request:', { url, config });

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Appointment endpoints
  async createAppointment(appointmentData, token) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
      token,
    });
  }

  async getDoctorsPublic() {
    return this.request('/doctors', {
      method: 'GET'
    });
  }

  async getUserAppointments(token) {
    return this.request('/appointments/my-appointments', {
      method: 'GET',
      token,
    });
  }

  async updateAppointment(appointmentId, appointmentData, token) {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
      token,
    });
  }

  async getAppointmentById(appointmentId, token) {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'GET',
      token,
    });
  }

  // Doctor endpoints
  async getDoctors() {
    return this.request('/doctors', {
      method: 'GET',
    });
  }

  // Admin endpoints
  async getDashboardStats(token) {
    return this.request('/admin/dashboard', {
      method: 'GET',
      token,
    });
  }

  async getAllAppointments(token) {
    console.log("sax")
    return this.request('/appointments', {
      method: 'GET',
      token,
    });
     
  }

  async searchAppointments(searchParams, token) {
    const queryString = new URLSearchParams(searchParams).toString();
    return this.request(`/admin/appointments/search?${queryString}`, {
      method: 'GET',
      token,
    });
  }

  async bulkUpdateAppointments(appointmentIds, status, token) {
    return this.request('/admin/appointments/bulk-update', {
      method: 'PATCH',
      body: JSON.stringify({ appointmentIds, status }),
      token,
    });
  }

  async getRecentActivities(token) {
    return this.request('/admin/recent-activities', {
      method: 'GET',
      token,
    });
  }

  // Doctor management endpoints
  async createDoctor(doctorData, token) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
      token,
    });
  }

  async updateDoctor(doctorId, doctorData, token) {
    return this.request(`/doctors/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
      token,
    });
  }

  async deleteDoctor(doctorId, token) {
    return this.request(`/doctors/${doctorId}`, {
      method: 'DELETE',
      token,
    });
  }

  // User management endpoints
  async getAllUsers(token) {
    return this.request('/users', {
      method: 'GET',
      token,
    });
  }

  async updateUserStatus(userId, status, token) {
    return this.request(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    });
  }

  async deleteUser(userId, token) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
      token,
    });
  }
}

export default new ApiService();
