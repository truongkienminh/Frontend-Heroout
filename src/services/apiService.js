import api from "./axios";

// Mock API URLs
const MOCK_APIS = {
  appointment: "https://684db9dc65ed08713916f8de.mockapi.io/appointment",
  schedule: "https://684db8e765ed08713916f5be.mockapi.io/schedule",
  slot: "https://684db8e765ed08713916f5be.mockapi.io/slot",
  blog: "https://684482e971eb5d1be0337d19.mockapi.io/blogs",
  consultant: "https://684482e971eb5d1be0337d19.mockapi.io/consultants",
};

class ApiService {
  static async login(credentials) {
    try {
      const response = await api.post("login", credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async register(userData) {
    try {
      const response = await api.post("register", userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getAccount(userId) {
    try {
      const response = await api.get(`account/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async updateAccount(userId, userData) {
    try {
      const response = await api.put(`/accounts/update`, userData, {
        params: { id: userId },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getAccountById(userId) {
    try {
      const response = await api.get(`account/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Blog APIs
  static async getBlogs() {
    try {
      const response = await fetch(MOCK_APIS.blog);
      if (!response.ok) throw new Error("Failed to fetch blogs");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching blogs: ${error.message}`);
    }
  }

  static async getBlog(id) {
    try {
      const response = await fetch(`${MOCK_APIS.blog}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch blog");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching blog: ${error.message}`);
    }
  }

  // Consultant APIs
  static async getConsultants() {
    try {
      const response = await fetch(MOCK_APIS.consultant);
      if (!response.ok) throw new Error("Failed to fetch consultants");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching consultants: ${error.message}`);
    }
  }

  static async getConsultant(id) {
    try {
      const response = await fetch(`${MOCK_APIS.consultant}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch consultant");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching consultant: ${error.message}`);
    }
  }

  // Schedule APIs
  static async getSchedules() {
    try {
      const response = await fetch(MOCK_APIS.schedule);
      if (!response.ok) throw new Error("Failed to fetch schedules");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching schedules: ${error.message}`);
    }
  }

  // Slot APIs
  static async getSlots() {
    try {
      const response = await fetch(MOCK_APIS.slot);
      if (!response.ok) throw new Error("Failed to fetch slots");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching slots: ${error.message}`);
    }
  }

  static async updateSlot(slotId, slotData) {
    try {
      const response = await fetch(`${MOCK_APIS.slot}/${slotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slotData),
      });
      if (!response.ok) throw new Error("Failed to update slot");
      return await response.json();
    } catch (error) {
      throw new Error(`Error updating slot: ${error.message}`);
    }
  }

  // Appointment APIs
  static async getAppointments() {
    try {
      const response = await fetch(MOCK_APIS.appointment);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching appointments: ${error.message}`);
    }
  }

  static async createAppointment(appointmentData) {
    try {
      const response = await fetch(MOCK_APIS.appointment, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) throw new Error("Failed to create appointment");
      return await response.json();
    } catch (error) {
      throw new Error(`Error creating appointment: ${error.message}`);
    }
  }

  static async updateAppointment(id, appointmentData) {
    try {
      const response = await fetch(`${MOCK_APIS.appointment}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) throw new Error("Failed to update appointment");
      return await response.json();
    } catch (error) {
      throw new Error(`Error updating appointment: ${error.message}`);
    }
  }

  static async deleteAppointment(id) {
    try {
      const response = await fetch(`${MOCK_APIS.appointment}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete appointment");
      return await response.json();
    } catch (error) {
      throw new Error(`Error deleting appointment: ${error.message}`);
    }
  }

  // handle API errors
  static handleError(error) {
    console.error("API Error:", error);
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "Server error occurred";
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error("Network error - please check your connection");
    } else {
      // Something else happened
      return new Error("An unexpected error occurred");
    }
  }
}

export default ApiService;
