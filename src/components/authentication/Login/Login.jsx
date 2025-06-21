import { useState } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/AuthContext";
import "./login.css";

import logo from "../../../assets/heroout.jpg";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);

      if (result.success) {
        toast.success("Đăng nhập thành công!");

        if (result.user && result.user.role === "STAFF") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        toast.error(
          result.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/">
            <img src={logo} alt="Heroout Logo" className="login-logo" />
          </Link>
          <h2 className="login-title">Đăng nhập</h2>
          <p className="login-subtitle">Chào mừng bạn quay trở lại</p>
        </div>
        <div className="login-form-wrap">
          <Form
            name="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={handleLogin}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn!",
                },
                {
                  type: "email",
                  message: "Vui lòng nhập địa chỉ email hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập email của bạn" disabled={loading} />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu của bạn!",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" disabled={loading} />
            </Form.Item>

            <div className="form-actions">
              <a
                className="forgot-password-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgotpassword");
                }}
              >
                Quên mật khẩu?
              </a>
            </div>

            <Form.Item className="submit-button-item">
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>

            <div className="register-link-container">
              <a href="/Register" className="register-link">
                Chưa có tài khoản?
                <span className="register-link-highlight">Đăng ký ngay</span>
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
