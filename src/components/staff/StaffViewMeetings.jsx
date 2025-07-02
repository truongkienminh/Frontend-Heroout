import React, { useState, useMemo } from "react";
import { Button, Modal, DatePicker, Typography, Space, List, Card } from "antd";
import dayjs from "dayjs"; // Sử dụng Day.js với Ant Design v4.x+

const { Title, Text } = Typography;

// Hàm tạo danh sách các slot thời gian từ 7:00 đến 17:00 mỗi 30 phút (giữ nguyên)
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

  // Sử dụng useMemo để tạo danh sách các slot thời gian chỉ một lần (giữ nguyên)
  const allTimeSlots = useMemo(() => generateTimeSlots(), []);

  // Hàm xử lý khi click nút "Đăng kí lịch làm việc"
  const showModal = () => {
    setIsModalVisible(true);
    // Optional: Reset selectedDate here if you want the DatePicker to be empty
    // every time the modal is opened:
    // setSelectedDate(null);
  };

  // Hàm xử lý khi click nút "OK" trong Modal
  const handleOk = () => {
    // Tại đây, bạn sẽ xử lý logic đăng ký lịch với selectedDate
    // Ví dụ: console.log('Đăng ký lịch cho ngày:', selectedDate ? selectedDate.format('YYYY-MM-DD') : 'Chưa chọn ngày');
    // Sau khi xử lý, đóng Modal
    setIsModalVisible(false);
    // Optional: Clear the selected date after successful submission
    // setSelectedDate(null);
  };

  // Hàm xử lý khi click nút "Cancel" hoặc đóng Modal bằng cách khác
  const handleCancel = () => {
    console.log("Hủy bỏ");
    // Đóng Modal
    setIsModalVisible(false);
    // Optional: Clear the selected date when cancelling
    setSelectedDate(null);
  };

  // Hàm xử lý khi ngày trên DatePicker trong Modal thay đổi
  const handleDateChange = (date) => {
    // 'dateString' param is not needed here
    setSelectedDate(date);
    // console.log('Ngày đã chọn trong modal:', date ? date.format('YYYY-MM-DD') : 'null');
  };

  return (
    <Card
      title={
        <Title level={3} style={{ marginBottom: 0 }}>
          Xem & Đăng ký Lịch làm việc
        </Title>
      }
    >
      {/* Nút để mở Modal */}
      <Button type="primary" onClick={showModal}>
        Đăng kí lịch làm việc
      </Button>

      {/* Component Modal */}
      <Modal
        title="Chọn Ngày và Slot làm việc"
        visible={isModalVisible} // Điều khiển hiển thị bằng state isModalVisible
        onOk={handleOk} // Gán hàm xử lý cho nút OK
        onCancel={handleCancel} // Gán hàm xử lý cho nút Cancel và các cách đóng khác
        // Tùy chọn: Vô hiệu hóa nút OK nếu chưa chọn ngày
        okButtonProps={{ disabled: !selectedDate }}
      >
        {/* Nội dung bên trong Modal */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Khu vực chọn ngày trong Modal */}
          <div>
            <Text strong>Chọn ngày:</Text>
            <br />
            <DatePicker
              value={selectedDate} // Gắn giá trị DatePicker với state selectedDate
              onChange={handleDateChange} // Xử lý khi ngày thay đổi
              format="YYYY-MM-DD" // Format ngày hiển thị
              style={{ marginTop: "8px" }}
            />
          </div>

          {/* Khu vực hiển thị các slot thời gian trong Modal */}
          {selectedDate ? ( // Chỉ hiển thị khi một ngày đã được chọn
            <div>
              <Title
                level={5}
                style={{ marginTop: "10px", marginBottom: "5px" }}
              >
                Các Slot trong ngày {selectedDate.format("YYYY-MM-DD")}:
              </Title>
              <List
                size="small"
                bordered // Thêm viền cho list
                dataSource={allTimeSlots} // Data source là danh sách các slot đã tạo
                renderItem={(item) => (
                  // Mỗi item trong list sẽ là một List.Item hiển thị thời gian slot
                  // Bạn có thể thêm nút "Chọn" hoặc xử lý click vào slot tại đây
                  <List.Item
                    // Tùy chọn: Thêm style để item trông giống có thể tương tác
                    style={{ cursor: "pointer" }}
                    // Tùy chọn: Thêm onClick để chọn slot cụ thể
                    // onClick={() => handleSlotSelect(item)}
                  >
                    {item}
                  </List.Item>
                )}
                // Tùy chọn: Thêm scroll nếu danh sách slot dài
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  width: "200px",
                }}
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
