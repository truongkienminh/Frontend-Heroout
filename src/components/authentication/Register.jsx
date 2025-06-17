import React from "react";
import {
  Button,
  Form,
  Input,
  Checkbox,
  Typography,
  message,
  Select, // Import Select component
} from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../services/axios"; // Ensure this path is correct
import herooutLogo from "../../assets/heroout.jpg"; // Assuming this path is correct

const { Option } = Select; // Destructure Option from Select

// Define styles (styles from previous response remain the same)
const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#10ac84", // Keep the green background
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
    width: "100%", // Ensure Select takes full width
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
    cursor: "pointer", // Add cursor pointer for better UX
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
      role: values.role, // Add role to payload
      gender: values.gender, // Add gender to payload
    };

    console.log("Registration Payload:", payload); // Log payload for debugging

    try {
      // Assuming your backend endpoint for registration is still '/register'
      const response = await api.post("register", payload);

      console.log("Registration successful. API Response:", response.data);
      message.success(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
      );

      // Although token is not typically returned on registration for security reasons,
      // the original code had this, so keeping it here, but it might be redundant
      const token = response.data?.token;
      if (token) {
        // It's more common to redirect to login after registration and let the user login
        // to get a token. Storing token directly after register might bypass email verification etc.
        // Consider removing this localStorage part unless your specific flow requires it.
        localStorage.setItem("token", token);
      } else {
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

      // Check for specific backend error messages
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data.message === "string"
      ) {
        errorMessage = err.response.data.message;
      } else if (err.response && err.response.status) {
        if (err.response.status === 409) {
          errorMessage = "Email hoặc số điện thoại đã được sử dụng.";
        } else if (err.response.status === 400) {
          // Bad Request - often due to invalid data format or missing required fields
          errorMessage =
            err.response.data?.error ||
            "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";
        } else if (err.response.status === 422) {
          // Unprocessable Entity - often used for validation errors
          errorMessage =
            err.response.data?.error || "Dữ liệu đăng ký không hợp lệ.";
        }
      }
      message.error(errorMessage);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
    message.error(
      "Vui lòng điền đầy đủ và đúng thông tin các trường bắt buộc."
    );
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formCard}>
        <Link to="/">
          <img src={herooutLogo} alt="HEROOUT Logo" style={styles.logoImage} />
        </Link>

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
          initialValues={{
            // Set default role here
            role: "MEMBER",
          }}
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
              // Regex for 10 digits, optionally starting with 0 or international code handler if needed
              // This regex checks for exactly 10 digits
              {
                pattern: /^\d{10}$/,
                message: "Số điện thoại phải có đúng 10 chữ số!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" style={styles.inputField} />
          </Form.Item>

          {/* New Form Item for Gender */}
          <Form.Item
            label="Giới tính"
            name="gender"
            style={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng chọn giới tính của bạn!" },
            ]}
          >
            <Select placeholder="Chọn giới tính" style={styles.inputField}>
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
              {/* Add other gender options if needed by backend, e.g., 'OTHER' */}
            </Select>
          </Form.Item>

          {/* New Form Item for Role (fixed to MEMBER, could be hidden or disabled) */}
          <Form.Item
            label="Vai trò"
            name="role"
            style={styles.formItem}
            // Since initialValue is set to MEMBER and it's the only option, required rule ensures it's included
            rules={[
              { required: true, message: "Vai trò không được bỏ trống!" },
            ]}
          >
            {/* We can just display the role, maybe disable the select */}
            <Select
              disabled
              placeholder="Chọn vai trò"
              style={styles.inputField}
            >
              {/* The value 'MEMBER' is set by initialValues */}
              <Option value="MEMBER">Thành viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            style={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
              // Add more complex password rules if needed (uppercase, number, symbol)
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
            hasFeedback // Provides feedback icon
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
            valuePropName="checked" // Checkbox uses 'checked' prop, not 'value'
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
