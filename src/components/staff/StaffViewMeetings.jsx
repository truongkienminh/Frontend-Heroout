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
} from "antd";
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
  // State để kiểm soát việc hiển thị Modal (Giữ nguyên)
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State lưu trữ ngày được chọn trong Modal (Giữ nguyên)
  const [selectedDate, setSelectedDate] = useState(null);
  // State lưu trữ ID của chuyên viên được chọn trong Modal (Giữ nguyên)
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);
  // State lưu trữ slot thời gian được chọn (Tùy chọn: cần state nếu muốn cho chọn 1 slot cụ thể)
  // const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Danh sách các slot thời gian (Giữ nguyên)
  const allTimeSlots = useMemo(() => generateTimeSlots(), []);

  // Hàm xử lý khi click nút "Đăng kí lịch làm việc" (Giữ nguyên)
  const showModal = () => {
    setIsModalVisible(true);
    // Có thể reset các state tại đây nếu muốn mỗi lần mở modal là trạng thái ban đầu
    // setSelectedDate(null);
    // setSelectedConsultantId(null);
    // setSelectedTimeSlot(null);
  };

  // Hàm xử lý khi click nút "OK" trong Modal (Giữ nguyên logic check/log)
  const handleOk = () => {
    // Lấy tên chuyên viên được chọn từ ID
    const selectedConsultant = fakeConsultants.find(
      (c) => c.id === selectedConsultantId
    );

    // Tại đây, bạn sẽ xử lý logic đăng ký lịch với selectedDate, selectedConsultant
    console.log("Đăng ký lịch với:", {
      date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
      consultant: selectedConsultant
        ? selectedConsultant.name
        : "Chưa chọn chuyên viên",
      // timeSlot: selectedTimeSlot, // Bao gồm slot nếu bạn thêm chức năng chọn slot cụ thể
    });

    // Sau khi xử lý, đóng Modal
    setIsModalVisible(false);
    // Tùy chọn: Xóa các state sau khi submit thành công để reset form
    setSelectedDate(null);
    setSelectedConsultantId(null);
    // setSelectedTimeSlot(null);
  };

  // Hàm xử lý khi click nút "Cancel" hoặc đóng Modal bằng cách khác (Giữ nguyên logic reset)
  const handleCancel = () => {
    console.log("Hủy bỏ đăng ký");
    setIsModalVisible(false);
    // Xóa các state khi hủy
    setSelectedDate(null);
    setSelectedConsultantId(null);
    // setSelectedTimeSlot(null);
  };

  // Hàm xử lý khi ngày trên DatePicker trong Modal thay đổi (Giữ nguyên)
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Khi chọn ngày mới, có thể reset slot được chọn nếu có
    // setSelectedTimeSlot(null);
  };

  // Hàm xử lý khi chuyên viên trên Select trong Modal thay đổi (Giữ nguyên)
  const handleConsultantChange = (value) => {
    setSelectedConsultantId(value); // value ở đây là ID của chuyên viên
    // console.log('Chuyên viên đã chọn:', fakeConsultants.find(c => c.id === value)?.name);
  };

  // Hàm xử lý khi chọn một slot thời gian cụ thể (Tùy chọn - Giữ nguyên comment)
  // const handleSlotSelect = (slot) => {
  //   setSelectedTimeSlot(slot);
  //   console.log('Slot đã chọn:', slot);
  // }

  // Điều kiện để nút OK được kích hoạt (Giữ nguyên - Vẫn cần cả ngày và chuyên viên để đăng ký)
  const isOkButtonDisabled = !selectedDate || selectedConsultantId === null;
  // Nếu bạn thêm chọn slot cụ thể, điều kiện sẽ là:
  // const isOkButtonDisabled = !selectedDate || selectedConsultantId === null || selectedTimeSlot === null;

  return (
    <Card
      title={
        <Title level={3} style={{ marginBottom: 0 }}>
          Xem & Đăng ký Lịch làm việc
        </Title>
      }
    >
      {/* Nút để mở Modal (Giữ nguyên style xanh lá) */}
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

      {/* Component Modal */}
      <Modal
        title="Đăng ký Lịch làm việc"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        // Nút OK bị disabled nếu chưa chọn ngày HOẶC chưa chọn chuyên viên
        okButtonProps={{ disabled: isOkButtonDisabled }}
        // Tùy chọn: Đặt chiều rộng Modal cho dễ nhìn
        width={400}
      >
        {/* Nội dung bên trong Modal */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Khu vực chọn chuyên viên (Giữ nguyên) */}
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

          {/* Khu vực chọn ngày (Giữ nguyên) */}
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

          {/* Khu vực hiển thị các slot thời gian - ĐÃ BỎ ĐIỀU KIỆN HIỂN THỊ DỰA TRÊN selectedDate */}
          <div>
            {/* Cập nhật Title để không phụ thuộc vào ngày đã chọn */}
            <Title level={5} style={{ marginTop: "10px", marginBottom: "5px" }}>
              Danh sách các Slot thời gian (7:00 - 17:00):
            </Title>
            <List
              size="small"
              bordered
              dataSource={allTimeSlots} // Data source là danh sách các slot đã tạo
              renderItem={(item) => (
                // Bạn có thể thêm class hoặc style ở đây để đánh dấu slot đã chọn nếu cần chức năng chọn slot
                // style={{ backgroundColor: selectedTimeSlot === item ? '#e6f7ff' : 'transparent', cursor: 'pointer' }}
                // onClick={() => handleSlotSelect(item)} // Uncomment nếu thêm chức năng chọn slot
                <List.Item>{item}</List.Item>
              )}
              style={{ maxHeight: "200px", overflowY: "auto", width: "200px" }} // Giới hạn chiều cao và thêm scroll
            />
            {/* Tùy chọn: Hiển thị slot đã chọn nếu có state selectedTimeSlot */}
            {/* {selectedTimeSlot && <Text strong style={{ marginTop: '10px' }}>Slot đã chọn: {selectedTimeSlot}</Text>} */}
          </div>

          {/* Đã xóa phần hiển thị thông báo "Vui lòng chọn ngày..." */}
        </Space>
      </Modal>
    </Card>
  );
};

export default StaffViewMeetings;
