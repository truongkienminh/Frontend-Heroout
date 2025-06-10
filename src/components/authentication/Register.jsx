import React from "react";
import { Button, Form, Input, Checkbox, Typography, message } from "antd"; // Added message
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import herooutLogo from "../../assets/heroout.jpg"; // Assuming this path is correct

// Define styles (styles from previous response remain the same)
const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#10ac84",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  },
  formCard: {
    backgroundColor: "#ffffff",
    padding: "30px 40px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    maxWidth: "460px",
    width: "100%",
    textAlign: "center",
  },
  logoImage: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    margin: "0 auto 24px auto",
    display: "block",
    borderRadius: "8px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#262626",
  },
  subtitle: {
    fontSize: "14px",
    color: "#595959",
    marginBottom: "32px",
    display: "block",
  },
  formItem: {
    marginBottom: "20px",
    textAlign: "left",
  },
  inputField: {
    height: "44px",
    borderRadius: "8px",
  },
  submitButton: {
    width: "100%",
    height: "48px",
    backgroundColor: "#10ac84",
    borderColor: "#10ac84",
    fontSize: "16px",
    fontWeight: "500",
    borderRadius: "8px",
    marginTop: "8px",
  },
  footerText: {
    marginTop: "24px",
    fontSize: "14px",
    color: "#595959",
    display: "block",
  },
  loginLink: {
    color: "#10ac84",
    fontWeight: "600",
  },
  checkboxLabel: {
    fontSize: "13px",
    color: "#595959",
  },
};

function Register() {
  const navigate = useNavigate();
  // const [form] = Form.useForm(); // Optional: if you want to reset form fields

  const handleRegister = async (values) => {
    // Tạo payload chỉ chứa các trường cần thiết cho backend
    const payload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };

    try {
      const response = await api.post("register", payload);
      // Nếu dòng trên không ném lỗi, nghĩa là API đã gọi thành công (ví dụ: status 200, 201)

      console.log("Registration successful. API Response:", response.data);
      message.success(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
      );

      const token = response.data?.token; // Lấy token một cách an toàn
      if (token) {
        localStorage.setItem("token", token);
      } else {
        // Trường hợp này vẫn ổn; đăng ký thành công nhưng có thể API không trả token ngay.
        // Người dùng sẽ được chuyển hướng đến trang đăng nhập.
        console.warn(
          "Đăng ký thành công, nhưng không có token trong phản hồi."
        );
      }

      // Tùy chọn: Reset các trường trong form sau khi đăng ký thành công
      // form.resetFields();

      // Chuyển hướng đến /login sau một khoảng trễ nhỏ để người dùng thấy thông báo
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Trễ 1.5 giây
    } catch (err) {
      console.error(
        "Registration failed:",
        err.response?.data || err.message || err
      );
      let errorMessage = "Đăng ký không thành công. Vui lòng thử lại.";
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data.message === "string"
      ) {
        errorMessage = err.response.data.message; // Sử dụng thông báo lỗi từ backend nếu có
      } else if (err.response && err.response.status) {
        // Xử lý các mã lỗi HTTP cụ thể nếu cần
        if (err.response.status === 409) {
          // Ví dụ: Xung đột (email/số điện thoại đã tồn tại)
          errorMessage = "Email hoặc số điện thoại đã được sử dụng.";
        } else if (err.response.status === 400) {
          // Ví dụ: Bad Request (lỗi validation)
          errorMessage = "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";
        }
      }
      message.error(errorMessage);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
    message.error("Vui lòng điền đầy đủ và đúng thông tin các trường.");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formCard}>
        <img src={herooutLogo} alt="HEROOUT Logo" style={styles.logoImage} />

        <Typography.Title level={3} style={styles.title}>
          Đăng ký tài khoản
        </Typography.Title>
        <Typography.Text style={styles.subtitle}>
          Tạo tài khoản để trải nghiệm đầy đủ dịch vụ
        </Typography.Text>

        <Form
          // form={form} // Optional: associate form instance if using form.resetFields()
          name="register_form"
          layout="vertical"
          onFinish={handleRegister}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên"
            name="fullName"
            style={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng nhập tên của bạn!" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự." },
              { max: 50, message: "Tên không được vượt quá 50 ký tự." },
            ]}
          >
            <Input placeholder="Nhập tên" style={styles.inputField} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            style={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" style={styles.inputField} />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            style={styles.formItem}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại của bạn!",
              },
              {
                pattern: /^\d{10}$/,
                message: "Số điện thoại phải có đúng 10 chữ số!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" style={styles.inputField} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            style={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
            ]}
          >
            <Input.Password
              placeholder="Tạo mật khẩu"
              style={styles.inputField}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            style={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Hai mật khẩu bạn nhập không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              style={styles.inputField}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật."
                        )
                      ),
              },
            ]}
            style={{ ...styles.formItem, marginBottom: "24px" }}
          >
            <Checkbox>
              <span style={styles.checkboxLabel}>
                Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={styles.submitButton}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Typography.Text style={styles.footerText}>
            Đã có tài khoản?{" "}
            <Typography.Link
              onClick={() => navigate("/login")}
              style={styles.loginLink}
            >
              Đăng nhập
            </Typography.Link>
          </Typography.Text>
        </Form>
      </div>
    </div>
  );
}

export default Register;
