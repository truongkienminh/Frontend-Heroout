import api from "./axios";

// Mock API URLs
const MOCK_APIS = {
  appointment: "https://684db9dc65ed08713916f8de.mockapi.io/appointment",
  schedule: "https://684db8e765ed08713916f5be.mockapi.io/schedule",
  slot: "https://684db8e765ed08713916f5be.mockapi.io/slot",
  blog: "https://684482e971eb5d1be0337d19.mockapi.io/blogs",
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

  // Dashboard Statistics APIs
  static async getAllAccounts() {
    try {
      const response = await api.get("accounts");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getCourses() {
    try {
      const response = await api.get("courses");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getEvents() {
    try {
      const response = await api.get("events");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Consultant APIs
  static async getConsultants() {
    try {
      // Lấy thông tin consultant từ bảng consultants
      const consultantsResponse = await api.get("consultants");
      const allConsultants = consultantsResponse.data;
      console.log("All consultants from /api/consultants:", allConsultants);

      if (!allConsultants || allConsultants.length === 0) {
        console.warn("No consultants found in /api/consultants.");
        return [];
      }

      // Lấy tất cả accounts để bổ sung thông tin bổ sung nếu cần
      const accountsResponse = await api.get("accounts");
      const allAccounts = accountsResponse.data;
      console.log("All accounts from /api/accounts:", allAccounts);

      // Map consultant data, sử dụng account từ consultant
      const consultantsWithAccountInfo = allConsultants.map((consultant) => {
        const account = consultant.account;
        if (!account) {
          console.warn(
            `No account info found for consultant ID: ${consultant.id}`
          );
          return null;
        }

        // Tìm account chi tiết từ /api/accounts nếu cần
        const fullAccount = allAccounts.find((acc) => acc.id === account.id);

        return {
          id: account.id,
          name: account.name || "Chưa cập nhật",
          email: account.email || "",
          phone: account.phone || "",
          avatar: account.avatar || account.name?.charAt(0) || "C",
          address: account.address || "",
          gender: account.gender || "",
          date_of_birth: account.dateOfBirth || null,
          status: account.status || "ACTIVE",
          bio: consultant.bio || "Chưa có thông tin",
          consultations: consultant.consultations || 0,
          degree_level: consultant.degreeLevel || "Chưa cập nhật",
          experience: consultant.experience || "Chưa cập nhật",
          expiry_date: consultant.expiryDate || null,
          field_of_study: consultant.fieldOfStudy || "Chưa cập nhật",
          issued_date: consultant.issuedDate || null,
          organization: consultant.organization || "Chưa cập nhật",
          rating: consultant.rating || 5.0,
          specialties: consultant.specialities
            ? consultant.specialities
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : ["Tư vấn tâm lý"],
          consultant_id: consultant.id || null,
        };
      });

      // Lọc bỏ các null
      const finalConsultants = consultantsWithAccountInfo.filter(
        (consultant) => consultant !== null
      );
      console.log("Final consultants:", finalConsultants);

      return finalConsultants;
    } catch (error) {
      console.error("Error in getConsultants:", error);
      throw this.handleError(error);
    }
  }

  static async getConsultant(id) {
    try {
      // Lấy thông tin account từ endpoint thực tế
      const accountResponse = await api.get(`account/${id}`);
      const account = accountResponse.data;

      if (account.role !== "CONSULTANT") {
        throw new Error("Account is not a consultant");
      }

      // Lấy thông tin consultant
      const consultantsResponse = await api.get("consultants");
      const allConsultants = consultantsResponse.data;
      const consultantInfo = allConsultants.find(
        (consultant) => Number.parseInt(consultant.account?.id) === account.id
      );

      if (!consultantInfo) {
        throw new Error("Consultant information not found");
      }

      return {
        id: account.id,
        name: account.name || "Chưa cập nhật",
        email: account.email || "",
        phone: account.phone || "",
        avatar: account.avatar || account.name?.charAt(0) || "C",
        address: account.address || "",
        gender: account.gender || "",
        dateOfBirth: account.dateOfBirth || null,
        status: account.status || "ACTIVE",
        bio: consultantInfo.bio || "Chưa có thông tin",
        consultations: consultantInfo.consultations || 0,
        degreeLevel: consultantInfo.degreeLevel || "Chưa cập nhật",
        experience: consultantInfo.experience || "Chưa cập nhật",
        expiryDate: consultantInfo.expiryDate || null,
        fieldOfStudy: consultantInfo.fieldOfStudy || "Chưa cập nhật",
        issuedDate: consultantInfo.issuedDate || null,
        organization: consultantInfo.organization || "Chưa cập nhật",
        rating: consultantInfo.rating || 5.0,
        specialties: consultantInfo.specialities
          ? consultantInfo.specialities
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : ["Tư vấn tâm lý"],
        consultant_id: consultantInfo.id,
      };
    } catch (error) {
      console.error("Error in getConsultant:", error);
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
