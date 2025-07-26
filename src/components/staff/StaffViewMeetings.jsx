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
import dayjs from "dayjs";

import api from "../../services/axios";

const { Title, Text } = Typography;
const { Option } = Select;

const StaffViewMeetings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [consultants, setConsultants] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);

  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loadingInitialData, setLoadingInitialData] = useState(true);

  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const [registering, setRegistering] = useState(false);

  const [initialDataError, setInitialDataError] = useState(null);

  const [schedulesError, setSchedulesError] = useState(null);

  const [registrationError, setRegistrationError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitialData(true);
      setInitialDataError(null); // Reset lỗi trước khi fetch
      try {
        const consultantsResponse = await api.get("/consultants");
        setConsultants(consultantsResponse.data);

        const slotsResponse = await api.get("/slot");
        setAvailableSlots(slotsResponse.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setInitialDataError(
          "Không thể tải dữ liệu ban đầu (danh sách chuyên viên hoặc slot)."
        );
        // Interceptor đã xử lý lỗi 401 (hết hạn token)
      } finally {
        setLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, []);
  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    setSchedulesError(null); // Reset lỗi trước khi fetch
    try {
      const schedulesResponse = await api.get("/schedules");

      setSchedules(schedulesResponse.data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedulesError("Không thể tải danh sách lịch đã đăng ký.");
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);
  const showModal = () => {
    setIsModalVisible(true);
    // Reset các state khi mở modal để form trống
    setSelectedDate(null);
    setSelectedConsultantId(null);
    setSelectedSlotIds([]); // Reset mảng
    setRegistrationError(null);
  };

  const handleOk = async () => {
    if (
      !selectedDate ||
      selectedConsultantId === null ||
      selectedSlotIds.length === 0
    ) {
      message.warning(
        "Vui lòng chọn đầy đủ Chuyên viên, Ngày và ít nhất một Slot thời gian."
      );
      return;
    }

    setRegistering(true); // Bắt đầu trạng thái đăng ký
    setRegistrationError(null);

    try {
      const registrationData = {
        date: selectedDate.format("YYYY-MM-DD"),
        consultantId: selectedConsultantId,
        slotIds: selectedSlotIds,
      };

      console.log("Đang gửi đăng ký:", registrationData);

      const response = await api.post("/slot/register", registrationData);

      console.log("Đăng ký thành công:", response.data);

      message.success(`Đã đăng ký thành công ${selectedSlotIds.length} slot!`);

      fetchSchedules();

      setIsModalVisible(false);
      setSelectedDate(null);
      setSelectedConsultantId(null);
      setSelectedSlotIds([]); // Reset MẢNG selectedSlotIds
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);

      const errorMessage =
        err.response?.data?.message ||
        "Có lỗi xảy ra khi đăng ký lịch làm việc.";
      setRegistrationError(errorMessage); // Hiển thị lỗi đăng ký ngay trong modal
      message.error(errorMessage); // Hiển thị thông báo lỗi Ant Design
    } finally {
      setRegistering(false); // Kết thúc trạng thái đăng ký
    }
  };

  const handleCancel = () => {
    console.log("Hủy bỏ đăng ký");
    setIsModalVisible(false);
    // Reset các state khi hủy
    setSelectedDate(null);
    setSelectedConsultantId(null);
    setSelectedSlotIds([]); // Reset MẢNG selectedSlotIds
    setRegistrationError(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlotIds([]); // Reset slots đã chọn khi đổi ngày
  };

  const handleConsultantChange = (value) => {
    setSelectedConsultantId(value);
    setSelectedSlotIds([]); // Reset slots đã chọn khi đổi chuyên viên
  };

  const handleSlotSelect = (slotId) => {
    if (selectedSlotIds.includes(slotId)) {
      setSelectedSlotIds((prevIds) => prevIds.filter((id) => id !== slotId));
    } else {
      setSelectedSlotIds((prevIds) => [...prevIds, slotId]);
    }
  };

  const isOkButtonDisabled =
    !selectedDate ||
    selectedConsultantId === null ||
    selectedSlotIds.length === 0 ||
    registering;

  const selectedSlotObjects = useMemo(() => {
    return availableSlots.filter((slot) => selectedSlotIds.includes(slot.id));
  }, [selectedSlotIds, availableSlots]);

  const columns = [
    {
      title: "Chuyên viên",

      dataIndex: "consultantId",
      key: "consultantName",
      render: (consultantId) => {
        const consultant = consultants.find((c) => c.id === consultantId);
        return consultant ? consultant.consultantName : "Không rõ";
      },
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Slot",

      dataIndex: "slot",
      key: "slot",
      render: (slot) => {
        if (!slot) return <Tag color="default">N/A</Tag>;

        return (
          <Tag color="blue">{`${slot.slotStart.substring(
            0,
            5
          )} - ${slot.slotEnd.substring(0, 5)}`}</Tag>
        );
      },
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
          <Text>Đang tải dữ liệu ban đầu...</Text>
        </Space>
      </Card>
    );
  }

  if (initialDataError) {
    return (
      <Card>
        <Alert
          message="Lỗi tải dữ liệu ban đầu"
          description={initialDataError}
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
          Lịch làm việc đã đăng ký
        </Title>

        {schedulesError && (
          <Alert
            message="Lỗi tải lịch đã đăng ký"
            description={schedulesError}
            type="error"
            showIcon
            style={{ marginBottom: "10px" }}
          />
        )}

        <Spin spinning={loadingSchedules}>
          <Table
            dataSource={schedules}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Space>

      <Modal
        title="Đăng ký Lịch làm việc"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: isOkButtonDisabled,
          loading: registering,
          type: "primary",
          style: {
            backgroundColor: "#52c41a",
            borderColor: "#52c41a",
          },
        }}
        cancelButtonProps={{
          type: "primary",
          danger: true,
        }}
        width={400}
        destroyOnClose={true}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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

            <Select
              placeholder="Chọn chuyên viên"
              style={{ width: "100%", marginTop: "8px" }}
              onChange={handleConsultantChange}
              value={selectedConsultantId}
              allowClear
              loading={loadingInitialData}
            >
              {Array.isArray(consultants) &&
                consultants.map((consultant) => (
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

            <List
              size="small"
              bordered
              dataSource={availableSlots}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  style={{
                    cursor: "pointer",

                    backgroundColor: selectedSlotIds.includes(item.id)
                      ? "#e6f7ff"
                      : "transparent",
                    borderColor: selectedSlotIds.includes(item.id)
                      ? "#91d5ff"
                      : undefined,
                  }}
                  onClick={() => handleSlotSelect(item.id)}
                >
                  {item.label}
                </List.Item>
              )}
              style={{ maxHeight: "200px", overflowY: "auto", width: "200px" }}
            />

            {selectedSlotIds.length > 0 && (
              <Text strong style={{ marginTop: "10px", display: "block" }}>
                Slot đã chọn:{" "}
                {selectedSlotObjects.map((slot) => slot.label).join(", ")}
              </Text>
            )}
          </div>
        </Space>
      </Modal>
    </Card>
  );
};

export default StaffViewMeetings;
