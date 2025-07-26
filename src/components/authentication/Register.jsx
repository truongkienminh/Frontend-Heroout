import { useState } from "react";
import { Button, Form, Input, Select, DatePicker, Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import "./Login/Login.css";
import logo from "../../assets/heroout.jpg";

const { Option } = Select;

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const registerData = {
        email: values.email,
        phone: values.phone,
        password: values.password,
        name: values.name,
        address: values.address || "",
        avatar: values.avatar || "",
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.toISOString()
          : null,
        gender: values.gender,
        role: "MEMBER",
      };

      const result = await register(registerData);

      if (result.success) {
        toast.success("Đăng ký thành công!");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page">
      <div className="register-container">
        <Card className="register-card" bordered={false}>
          <div className="login-header">
            <Link to="/">
              <img
                src={logo || "/placeholder.svg"}
                alt="Heroout Logo"
                className="login-logo"
              />
            </Link>
            <h2 className="login-title">Đăng ký</h2>
            <p className="login-subtitle">
              Tạo tài khoản mới để bắt đầu hành trình của bạn
            </p>
          </div>

          <div className="login-form-wrap">
            <Form
              name="register-form"
              onFinish={handleRegister}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <div className="form-section">
                <h3 className="section-title">Thông tin cá nhân</h3>
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập họ và tên!",
                        },
                        {
                          min: 2,
                          message: "Họ và tên phải có ít nhất 2 ký tự!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập họ và tên"
                        disabled={loading}
                        className="custom-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập email!",
                        },
                        {
                          type: "email",
                          message: "Vui lòng nhập địa chỉ email hợp lệ!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="example@email.com"
                        disabled={loading}
                        className="custom-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại!",
                        },
                        {
                          pattern: /^[0-9]{10,11}$/,
                          message: "Số điện thoại phải có 10-11 chữ số!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="0123456789"
                        disabled={loading}
                        className="custom-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Giới tính"
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn giới tính!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn giới tính"
                        disabled={loading}
                        className="custom-select"
                      >
                        <Option value="MALE">Nam</Option>
                        <Option value="FEMALE">Nữ</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="form-section">
                <h3 className="section-title">Bảo mật</h3>
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mật khẩu"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu!",
                        },
                        {
                          min: 6,
                          message: "Mật khẩu phải có ít nhất 6 ký tự!",
                        },
                        {
                          pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                          message:
                            "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số!",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Nhập mật khẩu"
                        disabled={loading}
                        className="custom-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng xác nhận mật khẩu!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Mật khẩu xác nhận không khớp!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Nhập lại mật khẩu"
                        disabled={loading}
                        className="custom-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="form-section">
                <h3 className="section-title">Thông tin bổ sung</h3>
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Ngày sinh" name="dateOfBirth">
                      <DatePicker
                        placeholder="Chọn ngày sinh"
                        style={{ width: "100%" }}
                        disabled={loading}
                        className="custom-input"
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Địa chỉ" name="address">
                      <Input
                        placeholder="Nhập địa chỉ (không bắt buộc)"
                        disabled={loading}
                        className="custom-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <Form.Item className="submit-button-item">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-button"
                  loading={loading}
                  size="large"
                  block
                >
                  {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
                </Button>
              </Form.Item>

              <div className="register-link-container">
                <span className="register-text">Đã có tài khoản? </span>
                <Link to="/login" className="register-link">
                  <span className="register-link-highlight">
                    Đăng nhập ngay
                  </span>
                </Link>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;