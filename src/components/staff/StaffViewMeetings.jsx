import React, { useState, useMemo } from "react";
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
} from "antd"; // Import Table và Tag
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

// Dữ liệu giả cho danh sách chuyên viên (Consultants) (Giữ nguyên)
const fakeConsultants = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Lê Văn C" },
  { id: 4, name: "Phạm Thị D" },
];

// Hàm tạo danh sách các slot thời gian từ 7:00 đến 17:00 mỗi 30 phút (Giữ nguyên)
const generateTimeSlots = () => {
  const slots = [];
  const startMinutes = 7 * 60; // 7:00 AM in minutes
  const endMinutes = 17 * 60; // 5:00 PM (17:00) in minutes
  const interval = 30; // 30 minutes

  for (
    let totalMinutes = startMinutes;
    totalMinutes <= endMinutes;
    totalMinutes += interval
  ) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    slots.push(`${formattedHours}:${formattedMinutes}`);
  }
  return slots;
};

const StaffViewMeetings = () => {
  // State để kiểm soát việc hiển thị Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State lưu trữ ngày được chọn trong Modal
  const [selectedDate, setSelectedDate] = useState(null);
  // State lưu trữ ID của chuyên viên được chọn trong Modal
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);
  // State MỚI: State lưu trữ slot thời gian được chọn trong Modal
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  // State MỚI: State lưu trữ danh sách các lịch đã đăng ký để hiển thị trong bảng
  const [bookedSlots, setBookedSlots] = useState([]);

  // Danh sách các slot thời gian (Giữ nguyên)
  const allTimeSlots = useMemo(() => generateTimeSlots(), []);

  // Hàm xử lý khi click nút "Đăng kí lịch làm việc"
  const showModal = () => {
    setIsModalVisible(true);
    // Optional: Reset các state khi mở modal để form trống
    setSelectedDate(null);
    setSelectedConsultantId(null);
    setSelectedTimeSlot(null); // Reset slot đã chọn
  };

  // Hàm xử lý khi click nút "OK" trong Modal
  const handleOk = () => {
    // Kiểm tra lại xem đã chọn đủ thông tin chưa (button đã disabled rồi nhưng cẩn thận vẫn tốt)
    if (
      !selectedDate ||
      selectedConsultantId === null ||
      selectedTimeSlot === null
    ) {
      console.warn("Thiếu thông tin để đăng ký!");
      return;
    }

    // Lấy thông tin chi tiết của chuyên viên được chọn
    const selectedConsultant = fakeConsultants.find(
      (c) => c.id === selectedConsultantId
    );

    // Tạo đối tượng lịch hẹn mới
    const newBooking = {
      // Sử dụng timestamp làm ID tạm thời (trong thực tế sẽ là ID từ API)
      id: Date.now() + Math.random(),
      consultantId: selectedConsultantId,
      consultantName: selectedConsultant ? selectedConsultant.name : "Không rõ",
      date: selectedDate.format("YYYY-MM-DD"), // Format ngày thành chuỗi
      timeSlot: selectedTimeSlot,
    };

    // Cập nhật state danh sách lịch đã đăng ký (thêm lịch mới vào cuối mảng)
    setBookedSlots([...bookedSlots, newBooking]);

    console.log("Đã đăng ký thành công:", newBooking);

    // Đóng Modal
    setIsModalVisible(false);
    // Reset các state sau khi submit thành công để form trống cho lần đăng ký tiếp theo
    setSelectedDate(null);
    setSelectedConsultantId(null);
    setSelectedTimeSlot(null);
  };

  // Hàm xử lý khi click nút "Cancel" hoặc đóng Modal bằng cách khác
  const handleCancel = () => {
    console.log("Hủy bỏ đăng ký");
    setIsModalVisible(false);
    // Xóa các state khi hủy
    setSelectedDate(null);
    setSelectedConsultantId(null);
    setSelectedTimeSlot(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    setSelectedTimeSlot(null);
  };

  const handleConsultantChange = (value) => {
    setSelectedConsultantId(value);
  };

  const handleSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
    console.log("Slot đã chọn:", slot);
  };

  const isOkButtonDisabled =
    !selectedDate || selectedConsultantId === null || selectedTimeSlot === null;

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
          Lịch làm việc đã đăng ký
        </Title>
        <Table dataSource={bookedSlots} columns={columns} rowKey="id" />
      </Space>

      <Modal
        title="Đăng ký Lịch làm việc"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: isOkButtonDisabled }}
        width={400}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Text strong>Chọn chuyên viên:</Text>
            <br />
            <Select
              placeholder="Chọn chuyên viên"
              style={{ width: "100%", marginTop: "8px" }}
              onChange={handleConsultantChange}
              value={selectedConsultantId}
              allowClear
            >
              {fakeConsultants.map((consultant) => (
                <Option key={consultant.id} value={consultant.id}>
                  {consultant.name}
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
              Chọn Slot thời gian (7:00 - 17:00):
            </Title>
            <List
              size="small"
              bordered
              dataSource={allTimeSlots}
              renderItem={(item) => (
                <List.Item
                  key={item}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedTimeSlot === item ? "#e6f7ff" : "transparent",
                    borderColor:
                      selectedTimeSlot === item ? "#91d5ff" : undefined,
                  }}
                  onClick={() => handleSlotSelect(item)}
                >
                  {item}
                </List.Item>
              )}
              style={{ maxHeight: "200px", overflowY: "auto", width: "200px" }}
            />

            {selectedTimeSlot && (
              <Text strong style={{ marginTop: "10px", display: "block" }}>
                Slot đã chọn: {selectedTimeSlot}
              </Text>
            )}
          </div>
        </Space>
      </Modal>
    </Card>
  );
};

export default StaffViewMeetings;
