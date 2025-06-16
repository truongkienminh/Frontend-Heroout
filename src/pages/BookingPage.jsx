import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Users,
  Award,
  Search,
} from "lucide-react";
import GoogleMeetInfo from "../components/GoogleMeetInfo";

// Fetch schedules and slots from API
const fetchSchedulesAndSlots = async (consultantId) => {
  try {
    // Fetch all schedules
    const schedulesResponse = await fetch(
      "https://684db8e765ed08713916f5be.mockapi.io/schedule"
    );
    if (!schedulesResponse.ok) throw new Error("Failed to fetch schedules");
    const allSchedules = await schedulesResponse.json();

    // Find schedule for this consultant
    const consultantSchedule = allSchedules.find(
      (s) => s.consultant_id === consultantId
    );
    if (!consultantSchedule) return [];

    // Fetch all slots
    const slotsResponse = await fetch(
      "https://684db8e765ed08713916f5be.mockapi.io/slot"
    );
    if (!slotsResponse.ok) throw new Error("Failed to fetch slots");
    const allSlots = await slotsResponse.json();

    // Filter slots for this schedule that are not booked
    const availableSlots = allSlots.filter(
      (slot) => slot.schedule_id === consultantSchedule.id && !slot.is_booked
    );

    // Transform slots to include date and time for easier handling
    const transformedSlots = availableSlots.map((slot) => ({
      ...slot,
      date: new Date(slot.slot_start).toISOString().split("T")[0],
      time: new Date(slot.slot_start).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return transformedSlots;
  } catch (error) {
    console.error("Error fetching schedules and slots:", error);
    return [];
  }
};

const BookingPage = () => {
  const { consultantId } = useParams();
  const navigate = useNavigate();

  // State for all steps
  const [currentStep, setCurrentStep] = useState(consultantId ? 2 : 1);
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    notes: "",
  });

  // Fetch consultants and selected consultant if consultantId is provided
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all consultants
        const response = await fetch(
          "https://684482e971eb5d1be0337d19.mockapi.io/consultants"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch consultants");
        }
        const data = await response.json();
        setConsultants(data);
        setFilteredConsultants(data);

        // If consultantId is provided, set the selected consultant and fetch slots
        if (consultantId) {
          const foundConsultant = data.find(
            (c) => c.id === Number.parseInt(consultantId)
          );
          if (!foundConsultant) {
            throw new Error("Consultant not found");
          }
          setSelectedConsultant(foundConsultant);

          // Fetch available slots for the selected consultant
          const slots = await fetchSchedulesAndSlots(foundConsultant.id);
          setAvailableSlots(slots);
        }

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultantId]);

  // Filter consultants based on search query and specialty
  useEffect(() => {
    if (!consultants.length) return;

    let results = consultants;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (consultant) =>
          consultant.name.toLowerCase().includes(query) ||
          consultant.field_of_study.toLowerCase().includes(query) ||
          consultant.specialties?.some((specialty) =>
            specialty.toLowerCase().includes(query)
          )
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      results = results.filter(
        (consultant) =>
          consultant.field_of_study.toLowerCase() ===
            selectedSpecialty.toLowerCase() ||
          consultant.specialties?.some(
            (specialty) =>
              specialty.toLowerCase() === selectedSpecialty.toLowerCase()
          )
      );
    }

    setFilteredConsultants(results);
  }, [searchQuery, selectedSpecialty, consultants]);

  // Get all unique specialties
  const getAllSpecialties = () => {
    const specialties = new Set();
    specialties.add("all");

    consultants.forEach((consultant) => {
      specialties.add(consultant.field_of_study.toLowerCase());
      consultant.specialties?.forEach((specialty) => {
        specialties.add(specialty.toLowerCase());
      });
    });

    return Array.from(specialties);
  };

  const handleConsultantSelect = async (consultant) => {
    setSelectedConsultant(consultant);
    setLoading(true);

    try {
      // Fetch slots from API
      const slots = await fetchSchedulesAndSlots(consultant.id);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error loading slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }

    // Update URL to include consultantId without reloading the page
    navigate(`/booking/${consultant.id}`, { replace: true });

    // Move to the next step
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setSelectedDate(slot.date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedConsultant) {
      alert("Vui lòng chọn chuyên gia tư vấn");
      return;
    }

    if (currentStep === 2 && !selectedSlot) {
      alert("Vui lòng chọn khung giờ tư vấn");
      return;
    }

    if (currentStep === 3) {
      // Validate form
      const requiredFields = ["name", "email", "phone"];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    // If we're at step 2 and there's no consultantId in the URL, go back to step 1
    if (currentStep === 2 && !consultantId) {
      setCurrentStep(1);
      // Update URL to remove consultantId
      navigate("/booking", { replace: true });
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);

      // POST appointment
      const appointmentResponse = await fetch(
        "https://684db9dc65ed08713916f8de.mockapi.io/appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            consultant_id: selectedConsultant.id,
            slot_id: selectedSlot.id,
            scheduled_at: selectedSlot.slot_start,
            status: "Booked",
          }),
        }
      );

      if (!appointmentResponse.ok) {
        throw new Error("Failed to create appointment");
      }

      // Update slot to mark as booked
      const slotUpdateResponse = await fetch(
        `https://684db8e765ed08713916f5be.mockapi.io/slot/${selectedSlot.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedSlot,
            is_booked: true,
          }),
        }
      );

      if (!slotUpdateResponse.ok) {
        console.warn("Failed to update slot status");
      }

      setBookingSuccess(true);
      setCurrentStep(5);
    } catch (err) {
      alert("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <Link
            to="/consultation"
            className="text-emerald-600 hover:text-emerald-700"
          >
            ← Quay lại trang tư vấn
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-emerald-600 mb-6">
              <CheckCircle className="w-20 h-20 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Đặt lịch thành công!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Lịch tư vấn của bạn đã được xác nhận. Chúng tôi sẽ gửi thông tin
              chi tiết qua email.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-4">
                Thông tin lịch hẹn:
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Chuyên gia:</span>{" "}
                  {selectedConsultant.name}
                </p>
                <p>
                  <span className="font-medium">Ngày:</span>{" "}
                  {new Date(selectedSlot.slot_start).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
                <p>
                  <span className="font-medium">Giờ:</span> {selectedSlot.time}
                </p>
                <p>
                  <span className="font-medium">Hình thức:</span> Tư vấn trực
                  tuyến qua Google Meet
                </p>
                <p>
                  <span className="font-medium">Link Google Meet:</span> Sẽ được
                  gửi qua email trước buổi tư vấn 15 phút
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/consultation"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Đặt lịch khác
              </Link>
              <Link
                to="/"
                className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach((slot) => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = selectedConsultant
    ? groupSlotsByDate(availableSlots)
    : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tư vấn", href: "/consultation" },
          ...(selectedConsultant
            ? [
                {
                  label: selectedConsultant.name,
                  href: `/consultants/${selectedConsultant.id}`,
                },
              ]
            : []),
          { label: "Đặt lịch hẹn" },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            {[
              { step: 1, label: "Chọn chuyên gia" },
              { step: 2, label: "Chọn thời gian" },
              { step: 3, label: "Thông tin cá nhân" },
              { step: 4, label: "Xác nhận" },
            ].map((item, index, array) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= item.step
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.step}
                </div>
                <div
                  className={`text-sm font-medium ml-2 ${
                    currentStep >= item.step
                      ? "text-emerald-600"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </div>
                {index < array.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      currentStep > item.step ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Choose Consultant */}
        {currentStep === 1 && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Chọn chuyên gia tư vấn
              </h1>
              <p className="text-lg text-gray-600">
                Chọn chuyên gia phù hợp với nhu cầu của bạn để đặt lịch tư vấn
                trực tuyến qua Google Meet
              </p>
            </div>

            {/* Google Meet Info */}
            <div className="mb-8">
              <GoogleMeetInfo />
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm chuyên gia
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên, chuyên môn..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Filter by specialty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo chuyên môn
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {getAllSpecialties().map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty === "all"
                          ? "Tất cả chuyên môn"
                          : specialty.charAt(0).toUpperCase() +
                            specialty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Consultants List */}
            {filteredConsultants.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <AlertCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không tìm thấy chuyên gia phù hợp
                </h3>
                <p className="text-gray-600 mb-4">
                  Vui lòng thử lại với tiêu chí tìm kiếm khác
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecialty("all");
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultants.map((consultant) => (
                  <div
                    key={consultant.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                          {consultant.avatar ||
                            consultant.name?.charAt(0) ||
                            "C"}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {consultant.name}
                        </h3>
                        <p className="text-emerald-600 font-medium mb-2">
                          {consultant.field_of_study}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {consultant.experience}
                        </p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2 text-emerald-600" />
                          <span>{consultant.degree_level}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-emerald-600" />
                          <span>
                            {consultant.consultations || 0} buổi tư vấn
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="flex items-center mr-2">
                            <span className="text-yellow-500">★</span>
                          </div>
                          <span>{consultant.rating || 5.0}/5.0</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Chuyên môn:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {consultant.specialties
                            ?.slice(0, 2)
                            .map((specialty, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            )) || (
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                              {consultant.field_of_study}
                            </span>
                          )}
                          {consultant.specialties?.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{consultant.specialties.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-auto pt-4">
                        <button
                          onClick={() => handleConsultantSelect(consultant)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
                        >
                          Chọn chuyên gia này
                        </button>
                        <Link
                          to={`/consultants/${consultant.id}`}
                          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors text-center block"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Steps 2-4: Time Slot, Personal Info, Confirmation */}
        {currentStep >= 2 && currentStep <= 4 && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Consultant Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                      {selectedConsultant.avatar ||
                        selectedConsultant.name?.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedConsultant.name}
                    </h3>
                    <p className="text-emerald-600 font-medium">
                      {selectedConsultant.field_of_study}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedConsultant.experience}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                      <span>{selectedConsultant.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                      <span>{selectedConsultant.organization}</span>
                    </div>
                  </div>

                  {selectedSlot && (
                    <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Thời gian đã chọn:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(selectedSlot.slot_start).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                        <p className="flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-2" />
                          {selectedSlot.time}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GoogleMeetInfo component */}
                  <div className="mt-6">
                    <GoogleMeetInfo />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  {/* Step 2: Choose Time Slot */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Chọn thời gian tư vấn
                      </h2>

                      {availableSlots.length === 0 ? (
                        <div className="text-center py-8">
                          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Không có lịch khả dụng
                          </h3>
                          <p className="text-gray-600">
                            Chuyên gia này hiện tại không có khung giờ nào khả
                            dụng.
                          </p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Calendar */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                              Chọn ngày
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-7 gap-1 mb-4">
                                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(
                                  (day) => (
                                    <div
                                      key={day}
                                      className="text-center text-sm font-medium text-gray-500 py-2"
                                    >
                                      {day}
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {Object.keys(groupedSlots).map((date) => {
                                  const dateObj = new Date(date);
                                  return (
                                    <button
                                      key={date}
                                      onClick={() => setSelectedDate(date)}
                                      className={`p-2 text-sm rounded-lg transition-colors ${
                                        selectedDate === date
                                          ? "bg-emerald-600 text-white"
                                          : "hover:bg-emerald-50 text-gray-700"
                                      }`}
                                    >
                                      {dateObj.getDate()}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Time Slots */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                              Chọn giờ{" "}
                              {selectedDate &&
                                `- ${new Date(selectedDate).toLocaleDateString(
                                  "vi-VN"
                                )}`}
                            </h3>
                            {selectedDate && groupedSlots[selectedDate] && (
                              <div className="grid grid-cols-2 gap-3">
                                {groupedSlots[selectedDate].map((slot) => (
                                  <button
                                    key={slot.id}
                                    onClick={() => handleSlotSelect(slot)}
                                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                                      selectedSlot?.id === slot.id
                                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={handlePrevStep}
                          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Quay lại
                        </button>
                        <button
                          onClick={handleNextStep}
                          disabled={!selectedSlot}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Tiếp tục
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Personal Information */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Thông tin cá nhân
                      </h2>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Nhập họ và tên"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Nhập email"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số điện thoại{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Nhập số điện thoại"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ngày sinh
                            </label>
                            <input
                              type="date"
                              name="date_of_birth"
                              value={formData.date_of_birth}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Nhập địa chỉ"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Mô tả vấn đề cần tư vấn hoặc ghi chú khác..."
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={handlePrevStep}
                          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Quay lại
                        </button>
                        <button
                          onClick={handleNextStep}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Tiếp tục
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 4 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Xác nhận thông tin
                      </h2>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-800 mb-4">
                            Thông tin lịch hẹn
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Chuyên gia:</span>
                              <p className="font-medium">
                                {selectedConsultant.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Chuyên môn:</span>
                              <p className="font-medium">
                                {selectedConsultant.field_of_study}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Ngày:</span>
                              <p className="font-medium">
                                {new Date(
                                  selectedSlot.slot_start
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Giờ:</span>
                              <p className="font-medium">{selectedSlot.time}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Hình thức:</span>
                              <p className="font-medium">
                                Tư vấn trực tuyến qua Google Meet
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-800 mb-4">
                            Thông tin cá nhân
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Họ và tên:</span>
                              <p className="font-medium">{formData.name}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <p className="font-medium">{formData.email}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Số điện thoại:
                              </span>
                              <p className="font-medium">{formData.phone}</p>
                            </div>
                            {formData.date_of_birth && (
                              <div>
                                <span className="text-gray-600">
                                  Ngày sinh:
                                </span>
                                <p className="font-medium">
                                  {new Date(
                                    formData.date_of_birth
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            )}
                            {formData.address && (
                              <div className="md:col-span-2">
                                <span className="text-gray-600">Địa chỉ:</span>
                                <p className="font-medium">
                                  {formData.address}
                                </p>
                              </div>
                            )}
                            {formData.notes && (
                              <div className="md:col-span-2">
                                <span className="text-gray-600">Ghi chú:</span>
                                <p className="font-medium">{formData.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-medium mb-1">
                                Lưu ý quan trọng:
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Vui lòng có mặt đúng giờ đã hẹn</li>
                                <li>
                                  Nếu cần hủy lịch, vui lòng thông báo trước ít
                                  nhất 24 giờ
                                </li>
                                <li>
                                  Chúng tôi sẽ gửi link tham gia cho bạn qua email
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={handlePrevStep}
                          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Quay lại
                        </button>
                        <button
                          onClick={handleBookingSubmit}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Xác nhận đặt lịch
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
