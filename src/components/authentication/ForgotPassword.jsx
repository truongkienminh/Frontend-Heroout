import React from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import HeroOutLogo from "../../assets/heroout.jpg"; 

const { Title, Text, Link } = Typography;

function ForgotPassword() {
  return (
    <>
      <style>{`
                *, *::before, *::after {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
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
            <img
              src={HeroOutLogo}
              alt="Heroout Logo"
              style={{ height: 120}}
            />
          </div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3}>Quên mật khẩu</Title>
            <Text type="secondary">Nhập email để khôi phục mật khẩu</Text>
          </div>

          <Form
            layout="vertical"
            onFinish={(values) =>
              console.log("Forgot Password Submit:", values)
            }
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ backgroundColor: "#009066", borderColor: "#009066" }}
              >
                Gửi liên kết đặt lại mật khẩu
              </Button>
            </Form.Item>

            <Text style={{ display: "block", textAlign: "center" }}>
              Quay lại{" "}
              <Link href="/login" style={{ color: "#009066" }}>
                Đăng nhập
              </Link>
            </Text>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default ForgotPassword;
