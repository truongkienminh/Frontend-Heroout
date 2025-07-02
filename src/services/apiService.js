import api from "./axios";

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
      const consultantsResponse = await api.get("consultants");
      const allConsultants = consultantsResponse.data;
      if (!allConsultants || allConsultants.length === 0) {
        console.warn("No consultants found in /api/consultants.");
        return [];
      }

      const consultantsWithAccountInfo = await Promise.all(
        allConsultants.map(async (consultant) => {
          let account = null;
          try {
            const accountResponse = await api.get(
              `account/${consultant.accountId}`
            );
            account = accountResponse.data;
          } catch (error) {
            console.warn(
              `No account info found for consultant ID: ${consultant.id}`
            );
            account = {
              id: consultant.accountId,
              name: consultant.consultantName || "Chưa cập nhật",
              email: "",
              phone: "",
              avatar: consultant.consultantName?.charAt(0) || "C",
              address: "",
              gender: "",
              dateOfBirth: null,
              status: "ACTIVE",
            };
          }

          return {
            id: account.id,
            name: account.name || consultant.consultantName || "Chưa cập nhật",
            email: account.email || "",
            phone: account.phone || "",
            avatar:
              account.avatar || consultant.consultantName?.charAt(0) || "C",
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
        })
      );

      const finalConsultants = consultantsWithAccountInfo.filter(
        (consultant) => consultant !== null
      );

      return finalConsultants;
    } catch (error) {
      console.error("Error in getConsultants:", error);
      throw this.handleError(error);
    }
  }

  static async getConsultant(id) {
    try {
      const accountResponse = await api.get(`account/${id}`);
      const account = accountResponse.data;

      if (account.role !== "CONSULTANT") {
        throw new Error("Account is not a consultant");
      }

      const consultantsResponse = await api.get("consultants");
      const allConsultants = consultantsResponse.data;
      const consultantInfo = allConsultants.find(
        (consultant) => consultant.accountId === account.id
      );

      if (!consultantInfo) {
        throw new Error("Consultant information not found");
      }

      return {
        id: account.id,
        name: account.name || consultantInfo.consultantName || "Chưa cập nhật",
        email: account.email || "",
        phone: account.phone || "",
        avatar:
          account.avatar || consultantInfo.consultantName?.charAt(0) || "C",
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

  // Schedule APIs
  static async getSchedules() {
    try {
      const response = await api.get("schedules");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getSchedule(id) {
    try {
      const response = await api.get(`schedules/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getConsultantSchedules(consultantId) {
    try {
      const response = await api.get(`schedules/consultant/${consultantId}`);
      const schedules = response.data || [];

      // Chuyển đổi dữ liệu để phù hợp với frontend
      return schedules.map((schedule) => {
        return {
          id: schedule.id,
          date: schedule.date,
          recurrence: schedule.recurrence,
          bookedStatus: schedule.bookedStatus === 0, // Giả định 0 = true (đã đặt), 1 = false (chưa đặt)
          slotId: schedule.slotId,
          slot: {
            slotStart: schedule.slot.slotStart,
            slotEnd: schedule.slot.slotEnd,
          },
        };
      });
    } catch (error) {
      console.error("Error fetching consultant schedules:", error);
      return [];
    }
  }

  // Slot APIs
  static async getSlots() {
    try {
      const response = await api.get("slot");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async createSlot(slotData) {
    try {
      const response = await api.post("slot", slotData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Đăng ký lịch làm việc cho consultant
  static async registerSchedule(scheduleData) {
    try {
      const response = await api.post("slot/register", scheduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Appointment APIs
  static async createAppointment(appointmentData) {
    try {
      const payload = {
        slotId: appointmentData.slotId,
        scheduleId: appointmentData.scheduleId,
        consultantId: appointmentData.consultantId,
        description: appointmentData.description || "",
        appointmentDate: appointmentData.appointmentDate,
      };

      const response = await api.post("appointment", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error.response?.status === 500) {
        throw new Error(
          "Lỗi server: Không thể tạo lịch hẹn. Vui lòng liên hệ admin"
        );
      } else if (error.response?.status === 400) {
        throw new Error(
          "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin."
        );
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.handleError(error);
    }
  }

  static async updateAppointment(id, appointmentData) {
    try {
      const response = await api.put(`appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async deleteAppointment(id) {
    try {
      const response = await api.delete(`appointments/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getAppointments() {
    try {
      const response = await api.get("appointment");
      const appointments = response.data || [];

      return appointments.map((appointment) => ({
        id: appointment.id,
        createAt: appointment.createAt,
        description: appointment.description || "",
        status: appointment.status || "BOOKED",
        accountId: appointment.accountId,
        consultantId: appointment.consultantId,
      }));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw this.handleError(error);
    }
  }

  // Helper function to format time
  static formatTimeFromObject(timeData) {
    if (!timeData || typeof timeData !== "string") return null;
    return timeData.substring(0, 5); // Lấy "HH:MM" từ "HH:MM:SS"
  }

  // Get appointments for a specific member
  static async getMemberAppointments(memberId) {
    try {
      // Get appointments for the member
      const response = await api.get(`appointment/account/${memberId}`);
      const appointments = response.data || [];

      // Kiểm tra scheduleId trước khi enrich
      if (appointments.some((apt) => !apt.scheduleId)) {
        if (this.DEBUG) {
          console.warn(
            "Some raw appointments are missing scheduleId:",
            appointments.filter((apt) => !apt.scheduleId)
          );
        }
      }

      // Get all schedules to match with appointments
      const schedulesResponse = await api.get("schedules");
      const allSchedules = schedulesResponse.data || [];

      // Get all consultants to match with appointments
      const consultantsResponse = await api.get("consultants");
      const allConsultants = consultantsResponse.data || [];

      // Transform and enrich the appointment data
      const enrichedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          // Find the schedule for this appointment
          const schedule = allSchedules.find(
            (s) => s.id === appointment.scheduleId
          );
          if (this.DEBUG && !schedule) {
            console.warn(
              `No schedule found for appointment ${appointment.id} with scheduleId: ${appointment.scheduleId}`
            );
          }

          // Find the consultant for this appointment
          const consultant = allConsultants.find(
            (c) => c.id === appointment.consultantId
          );

          return {
            id: appointment.id,
            create_at: appointment.createAt,
            description: appointment.description || "",
            status: appointment.status || "BOOKED",
            checked_in: appointment.checkedIn || false,
            meeting_link: appointment.meetingLink || null,
            account_id: appointment.accountId,
            schedule_id: appointment.scheduleId,
            consultant_id: appointment.consultantId,
            appointment_date: appointment.appointmentDate,
            schedule: schedule
              ? {
                  id: schedule.id,
                  date: schedule.date,
                  is_booked: schedule.bookedStatus === 1,
                  recurrence: schedule.recurrence,
                  slot_id: schedule.slotId,
                  slot: schedule.slot
                    ? {
                        id: schedule.slotId,
                        label:
                          schedule.slot.label ||
                          `${this.formatTimeFromObject(
                            schedule.slot.slotStart
                          )} - ${this.formatTimeFromObject(
                            schedule.slot.slotEnd
                          )}`,
                        slot_start: this.formatTimeFromObject(
                          schedule.slot.slotStart
                        ),
                        slot_end: this.formatTimeFromObject(
                          schedule.slot.slotEnd
                        ),
                      }
                    : null,
                }
              : null,
            consultant: consultant
              ? {
                  id: consultant.id,
                  name: consultant.account?.name || "Chuyên gia",
                  email: consultant.account?.email || "",
                  phone: consultant.account?.phone || "",
                  avatar: consultant.account?.avatar || "",
                  field_of_study: consultant.fieldOfStudy || "",
                  degree_level: consultant.degreeLevel || "",
                  experience: consultant.experience || "",
                  organization: consultant.organization || "",
                  rating: consultant.rating || 5.0,
                  bio: consultant.bio || "",
                  specialties: consultant.specialities
                    ? consultant.specialities.split(",").map((s) => s.trim())
                    : [],
                }
              : null,
          };
        })
      );

      return enrichedAppointments;
    } catch (error) {
      console.error("Error fetching member appointments:", error);
      throw this.handleError(error);
    }
  }

  // Check-in to an appointment
  static async checkInAppointment(appointmentId) {
    try {
      const response = await api.post(`appointment/${appointmentId}/check-in`);
      return response.data;
    } catch (error) {
      console.error("Error checking in appointment:", error);
      if (error.response?.status === 400) {
        throw new Error(
          "Không thể check-in vào thời điểm này. Vui lòng kiểm tra lại thời gian."
        );
      } else if (error.response?.status === 404) {
        throw new Error("Không tìm thấy lịch hẹn.");
      } else if (error.response?.status === 409) {
        throw new Error("Lịch hẹn đã được check-in trước đó.");
      }
      throw this.handleError(error);
    }
  }

  // Blog APIs
  static async getBlogs() {
    try {
      const response = await fetch(
        "https://684482e971eb5d1be0337d19.mockapi.io/blogs"
      );
      if (!response.ok) throw new Error("Failed to fetch blogs");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching blogs: ${error.message}`);
    }
  }

  static async getBlog(id) {
    try {
      const response = await fetch(
        `https://684482e971eb5d1be0337d19.mockapi.io/blogs/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch blog");
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching blog: ${error.message}`);
    }
  }

  // handle API errors
  static handleError(error) {
    console.error("API Error:", error);
    if (error.response) {
      const message = error.response.data?.message || "Server error occurred";
      return new Error(message);
    } else if (error.request) {
      return new Error("Network error - please check your connection");
    } else {
      return new Error("An unexpected error occurred");
    }
  }
}

export default ApiService;
