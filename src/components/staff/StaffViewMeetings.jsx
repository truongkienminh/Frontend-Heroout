import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  DatePicker,
  Typography,
  Space,
  List,
  Card,
  Select,
  Table,
  Tag,
  Spin,
  Alert,
  message,
} from "antd";

import api from "../../services/axios";

const { Title, Text } = Typography;
const { Option } = Select;

const StaffViewMeetings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [consultants, setConsultants] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);

  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const [bookedSlots, setBookedSlots] = useState([]);

  // State cho trạng thái tải dữ liệu ban đầu
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  // State cho trạng thái đăng ký
  const [registering, setRegistering] = useState(false);
  // State cho lỗi
  const [error, setError] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);

  // Effect để tải dữ liệu ban đầu (consultants và slots)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitialData(true);
      setError(null);
      try {
        // 1. Tải danh sách chuyên viên từ /api/consultants
        const consultantsResponse = await api.get("/consultants");
        // API /api/consultants trả về mảng các đối tượng consultant
        setConsultants(consultantsResponse.data);

        // 2. Tải danh sách các slot định nghĩa từ /api/slot
        const slotsResponse = await api.get("/slot");
        // API /api/slot trả về mảng các đối tượng slot với id, label, ...
        setAvailableSlots(slotsResponse.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(
          "Không thể tải dữ liệu ban đầu (danh sách chuyên viên hoặc slot)."
        );
        // Interceptor sẽ xử lý lỗi 401 (hết hạn token)
      } finally {
        setLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, []); // Mảng dependency rỗng: chỉ chạy một lần khi component mount

  // Hàm xử lý khi click nút "Đăng kí lịch làm việc"
  const showModal = () => {
    setIsModalVisible(true);
    // Reset các state khi mở modal để form trống
    setSelectedDate(null);
    setSelectedConsultantId(null);
    setSelectedSlotId(null); // Reset slot ID đã chọn
    setRegistrationError(null); // Xóa lỗi đăng ký cũ
  };

  // Hàm xử lý khi click nút "OK" trong Modal
  const handleOk = async () => {
    // Kiểm tra thông tin đã đủ chưa
    if (
      !selectedDate ||
      selectedConsultantId === null ||
      selectedSlotId === null // Kiểm tra selectedSlotId
    ) {
      message.warning(
        "Vui lòng chọn đầy đủ Chuyên viên, Ngày và Slot thời gian."
      );
      return;
    }

    setRegistering(true); // Bắt đầu trạng thái đăng ký
    setRegistrationError(null); // Xóa lỗi đăng ký cũ

    try {
      // Chuẩn bị dữ liệu theo định dạng API /api/slot/register
      const registrationData = {
        date: selectedDate.format("YYYY-MM-DD"), // Format ngày
        consultantId: selectedConsultantId,
        slotIds: [selectedSlotId], // Gửi ID slot đã chọn dưới dạng mảng 1 phần tử
      };

      console.log("Đang gửi đăng ký:", registrationData);

      // Gọi API đăng ký sử dụng instance api
      const response = await api.post("/slot/register", registrationData);

      console.log("Đăng ký thành công:", response.data);

      // Tìm thông tin chi tiết của consultant và slot vừa đăng ký để hiển thị trong bảng
      const registeredConsultant = consultants.find(
        (c) => c.id === selectedConsultantId
      );
      const registeredSlot = availableSlots.find(
        (slot) => slot.id === selectedSlotId
      );

      // Thêm lịch vừa đăng ký vào state bookedSlots (chỉ hiển thị tạm thời)
      const newBooking = {
        // Tạo ID tạm dựa trên dữ liệu đăng ký để đảm bảo tính duy nhất
        id: `${selectedConsultantId}-${selectedDate.format(
          "YYYY-MM-DD"
        )}-${selectedSlotId}`,
        consultantId: selectedConsultantId,
        consultantName: registeredConsultant
          ? registeredConsultant.consultantName
          : "Không rõ", // Lấy tên từ danh sách consultants đã fetch
        date: selectedDate.format("YYYY-MM-DD"),
        timeSlot: registeredSlot ? registeredSlot.label : "Không rõ", // Lấy label từ danh sách slots đã fetch
      };
      setBookedSlots([...bookedSlots, newBooking]);

      message.success("Đăng ký lịch làm việc thành công!");

      // Đóng Modal và reset form
      setIsModalVisible(false);
      setSelectedDate(null);
      setSelectedConsultantId(null);
      setSelectedSlotId(null);
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);
      // Interceptor đã xử lý lỗi 401. Xử lý các lỗi khác tại đây.
      const errorMessage =
        err.response?.data?.message ||
        "Có lỗi xảy ra khi đăng ký lịch làm việc.";
      setRegistrationError(errorMessage); // Hiển thị lỗi đăng ký ngay trong modal
      message.error(errorMessage); // Hiển thị thông báo lỗi Ant Design
    } finally {
      setRegistering(false); // Kết thúc trạng thái đăng ký
    }
  };

  // Hàm xử lý khi click nút "Cancel" hoặc đóng Modal bằng cách khác
  const handleCancel = () => {
    console.log("Hủy bỏ đăng ký");
    setIsModalVisible(false);
    // Reset các state khi hủy
    setSelectedDate(null);
    setSelectedConsultantId(null);
    setSelectedSlotId(null);
    setRegistrationError(null); // Xóa lỗi đăng ký
  };

  // Hàm xử lý khi chọn ngày
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlotId(null); // Reset slot đã chọn khi đổi ngày
  };

  // Hàm xử lý khi chọn chuyên viên
  const handleConsultantChange = (value) => {
    setSelectedConsultantId(value);
    setSelectedSlotId(null); // Reset slot đã chọn khi đổi chuyên viên
  };

  // Hàm xử lý khi chọn slot thời gian (lưu ID slot)
  const handleSlotSelect = (slotId) => {
    setSelectedSlotId(slotId);
  };

  // Kiểm tra điều kiện để bật/tắt nút OK
  const isOkButtonDisabled =
    !selectedDate ||
    selectedConsultantId === null ||
    selectedSlotId === null ||
    registering;

  // Tìm slot được chọn để hiển thị label trong UI
  const selectedSlotObject = useMemo(() => {
    return availableSlots.find((slot) => slot.id === selectedSlotId);
  }, [selectedSlotId, availableSlots]);

  // Cấu hình cột cho bảng hiển thị lịch đã đăng ký (tạm thời)
  const columns = [
    {
      title: "Chuyên viên",
      dataIndex: "consultantName",
      key: "consultantName",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Slot",
      dataIndex: "timeSlot",
      key: "timeSlot",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ];

  if (loadingInitialData) {
    return (
      <Card>
        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Spin size="large" />
          <Text>Đang tải dữ liệu...</Text>
        </Space>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Title level={3} style={{ marginBottom: 0 }}>
          Xem & Đăng ký Lịch làm việc
        </Title>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            backgroundColor: "#52c41a",
            borderColor: "#52c41a",
          }}
        >
          Đăng kí lịch làm việc
        </Button>

        <Title level={4} style={{ marginTop: "30px", marginBottom: "10px" }}>
          Lịch làm việc đã đăng ký (Trong phiên hiện tại)
        </Title>

        <Table dataSource={bookedSlots} columns={columns} rowKey="id" />
      </Space>

      <Modal
        title="Đăng ký Lịch làm việc"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: isOkButtonDisabled, loading: registering }} // Hiển thị loading trên nút OK
        width={400}
        destroyOnClose={true} // Tự động hủy modal khi đóng để reset state bên trong
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Hiển thị lỗi đăng ký nếu có */}
          {registrationError && (
            <Alert
              message="Lỗi đăng ký"
              description={registrationError}
              type="error"
              showIcon
            />
          )}

          <div>
            <Text strong>Chọn chuyên viên:</Text>
            <br />
            {/* Sử dụng danh sách consultant lấy từ API */}
            <Select
              placeholder="Chọn chuyên viên"
              style={{ width: "100%", marginTop: "8px" }}
              onChange={handleConsultantChange}
              value={selectedConsultantId}
              allowClear
              loading={loadingInitialData}
            >
              {consultants.map((consultant) => (
                <Option key={consultant.id} value={consultant.id}>
                  {consultant.consultantName}{" "}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Chọn ngày:</Text>
            <br />
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              style={{ marginTop: "8px" }}
            />
          </div>

          <div>
            <Title level={5} style={{ marginTop: "10px", marginBottom: "5px" }}>
              Chọn Slot thời gian:
            </Title>
            {/* Sử dụng danh sách slot lấy từ API */}
            <List
              size="small"
              bordered
              dataSource={availableSlots} // Sử dụng availableSlots từ API
              renderItem={(item) => (
                <List.Item
                  key={item.id} // Dùng ID làm key
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedSlotId === item.id ? "#e6f7ff" : "transparent", // So sánh ID
                    borderColor:
                      selectedSlotId === item.id ? "#91d5ff" : undefined, // So sánh ID
                  }}
                  onClick={() => handleSlotSelect(item.id)} // Truyền ID khi click
                >
                  {item.label} {/* Hiển thị label */}
                </List.Item>
              )}
              style={{ maxHeight: "200px", overflowY: "auto", width: "200px" }}
            />

            {selectedSlotId &&
              selectedSlotObject && ( // Chỉ hiển thị khi đã chọn slot và tìm được object
                <Text strong style={{ marginTop: "10px", display: "block" }}>
                  Slot đã chọn: {selectedSlotObject.label}{" "}
                  {/* Hiển thị label */}
                </Text>
              )}
          </div>
        </Space>
      </Modal>
    </Card>
  );
};

export default StaffViewMeetings;
