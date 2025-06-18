"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";
import ApiService from "../services/apiService";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "",
    avatar: "",
  });

  const [originalData, setOriginalData] = useState({});

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        setFetchLoading(true);
        const userData = await ApiService.getAccountById(user.id);

        const formattedData = {
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          date_of_birth: userData.dateOfBirth || "",
          gender: userData.gender || "",
          avatar: userData.avatar || "",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Không thể tải thông tin người dùng");

        // Fallback to user data from context if API fails
        if (user) {
          const fallbackData = {
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            date_of_birth: user.dateOfBirth || "",
            gender: user.gender || "",
            avatar: user.avatar || "",
          };
          setFormData(fallbackData);
          setOriginalData(fallbackData);
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        dateOfBirth: formData.date_of_birth || null,
        gender: formData.gender || null,
        avatar: formData.avatar || null,
      };

      // Call API to update user
      const updatedUser = await ApiService.updateAccount(user.id, updateData);

      // Update user context with new data
      const contextUserData = {
        ...user,
        ...updatedUser,
      };

      updateUser(contextUserData);
      setOriginalData(formData);
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      ADMIN: "Quản trị viên",
      CONSULTANT: "Tư vấn viên",
      MEMBER: "Thành viên",
      STAFF: "Nhân viên",
    };
    return roleMap[role] || role;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {formData.avatar ? (
                <img
                  src={formData.avatar || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg ${
                  formData.avatar ? "hidden" : ""
                }`}
              >
                {getInitials(formData.name)}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {formData.name || "Người dùng"}
              </h1>
              <p className="text-gray-600 mb-1">{formData.email}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>ID: {user.id}</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Đang lưu..." : "Lưu"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Thông tin cá nhân
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nhập họ và tên"
                  required
                  maxLength={255}
                />
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-800">
                    {formData.name || "Chưa cập nhật"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nhập email"
                  required
                  maxLength={255}
                />
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-800">
                    {formData.email || "Chưa cập nhật"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nhập số điện thoại"
                  maxLength={255}
                />
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-800">
                    {formData.phone || "Chưa cập nhật"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-800">
                    {formData.gender === "MALE"
                      ? "Nam"
                      : formData.gender === "FEMALE"
                      ? "Nữ"
                      : "Chưa cập nhật"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  max={new Date().toISOString().split("T")[0]} // Không cho chọn ngày trong tương lai
                />
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-800">
                    {formData.date_of_birth
                      ? new Date(formData.date_of_birth).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Chưa cập nhật"}
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nhập địa chỉ"
                  maxLength={255}
                />
              ) : (
                <div className="flex items-start gap-2 p-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-gray-800">
                    {formData.address || "Chưa cập nhật"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
