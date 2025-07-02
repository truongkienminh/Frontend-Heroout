import React, { useState, useMemo } from "react";
import { Button, Modal, DatePicker, Typography, Space, List, Card } from "antd";
import dayjs from "dayjs"; // Sử dụng Day.js với Ant Design v4.x+

const { Title, Text } = Typography;

// Hàm tạo danh sách các slot thời gian (giữ nguyên)
const generateTimeSlots = () => {
  const slots = [];
  const startMinutes = 7 * 60;
  const endMinutes = 17 * 60;
  const interval = 30;

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

  // Danh sách các slot thời gian (giữ nguyên)
  const allTimeSlots = useMemo(() => generateTimeSlots(), []);

  // Hàm xử lý khi click nút "Đăng kí lịch làm việc" (giữ nguyên)
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm xử lý khi click nút "OK" trong Modal (giữ nguyên)
  const handleOk = () => {
    // Xử lý logic đăng ký lịch tại đây với selectedDate và có thể cả slot được chọn
    console.log(
      "Đăng ký lịch cho ngày:",
      selectedDate ? selectedDate.format("YYYY-MM-DD") : "Chưa chọn ngày"
    );
    // Bạn có thể thêm logic chọn slot cụ thể và xử lý ở đây

    setIsModalVisible(false);
    // Tùy chọn: Xóa ngày đã chọn sau khi submit thành công
    // setSelectedDate(null);
  };

  // Hàm xử lý khi click nút "Cancel" hoặc đóng Modal (giữ nguyên)
  const handleCancel = () => {
    console.log("Hủy bỏ đăng ký");
    setIsModalVisible(false);
    // Xóa ngày đã chọn khi hủy
    setSelectedDate(null);
  };

  // Hàm xử lý khi ngày trên DatePicker trong Modal thay đổi (giữ nguyên)
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Card
      title={
        <Title level={3} style={{ marginBottom: 0 }}>
          Xem & Đăng ký Lịch làm việc
        </Title>
      }
    >
      {/* Nút để mở Modal - ĐÃ THAY ĐỔI STYLE TẠI ĐÂY */}
      <Button
        type="primary" // Giữ type="primary" để kế thừa các style khác (padding, text color trắng)
        onClick={showModal}
        style={{
          backgroundColor: "#52c41a", // Mã màu xanh lá cây (màu success của antd)
          borderColor: "#52c41a", // Màu viền trùng màu nền
        }}
      >
        Đăng kí lịch làm việc
      </Button>

      {/* Component Modal (giữ nguyên) */}
      <Modal
        title="Chọn Ngày và Slot làm việc"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !selectedDate }} // Nút OK bị disabled nếu chưa chọn ngày
      >
        {/* Nội dung bên trong Modal (giữ nguyên) */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Khu vực chọn ngày trong Modal */}
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

          {/* Khu vực hiển thị các slot thời gian trong Modal */}
          {selectedDate ? (
            <div>
              <Title
                level={5}
                style={{ marginTop: "10px", marginBottom: "5px" }}
              >
                Các Slot trong ngày {selectedDate.format("YYYY-MM-DD")}:
              </Title>
              <List
                size="small"
                bordered
                dataSource={allTimeSlots}
                renderItem={(item) => (
                  // Bạn có thể thêm class hoặc style ở đây để đánh dấu slot đã chọn
                  <List.Item
                    // Tùy chọn: Style để item trông giống có thể tương tác
                    style={{ cursor: "pointer" }}
                    // Tùy chọn: Thêm onClick để chọn slot cụ thể
                    // onClick={() => handleSlotSelect(item)}
                  >
                    {item}
                  </List.Item>
                )}
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  width: "200px",
                }} // Thêm scroll và giới hạn chiều rộng
              />
            </div>
          ) : (
            // Hiển thị thông báo khi chưa chọn ngày
            <div style={{ marginTop: "10px" }}>
              <Text type="secondary">
                Vui lòng chọn một ngày để xem các slot.
              </Text>
            </div>
          )}
        </Space>
      </Modal>
    </Card>
  );
};

export default StaffViewMeetings;
