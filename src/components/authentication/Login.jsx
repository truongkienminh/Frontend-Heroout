import React from "react";
import { Form, Input, Button, Checkbox, Typography, Card } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import HeroOutLogo from "../../assets/heroout.jpg"; 

const { Title, Text } = Typography;

function Login() {
  return (
    <>
      <style>{`
        
        *, *::before, *::after {
          margin: 0;
          padding: 0;

      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#009066",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card style={{ maxWidth: 400, width: "100%", borderRadius: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link to="/">
              <img
                src={HeroOutLogo}
                alt="Heroout Logo"
                style={{ height: 120 }}
              />
            </Link>
          </div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3}>Đăng nhập</Title>
            <Text type="secondary">Chào mừng bạn quay trở lại</Text>
          </div>

          <Form
            layout="vertical"
            onFinish={(values) => console.log("Success:", values)}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không đúng định dạng!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email của bạn"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Link to="/forgotpassword" style={{ color: "#009066" }}>
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ backgroundColor: "#009066", borderColor: "#009066" }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Text style={{ display: "block", textAlign: "center" }}>
              Chưa có tài khoản?{" "}
              <Link to="/register" style={{ color: "#009066" }}>
                Đăng ký ngay
              </Link>
            </Text>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Login;
