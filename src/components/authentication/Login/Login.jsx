import React from "react";

import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../../services/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { login } from "../../../store/redux/features/counterSlice";
import "./login.css";

import logo from "../../../assets/heroout.jpg";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const response = await api.post("login", values);

      toast.success("Success");
      dispatch(login(response.data));
      const { role, token } = response.data;
      localStorage.setItem("token", token);

      if (role === "MEMBER") {
        navigate("/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
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
              <Input placeholder="Nhập email của bạn" />
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
              <Input.Password placeholder="Nhập mật khẩu" />
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
              <Button type="primary" htmlType="submit" className="login-button">
                Đăng nhập
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
