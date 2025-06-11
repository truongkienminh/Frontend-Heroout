import { Link } from "react-router-dom";
import HeroOutLogo from "../assets/heroout.jpg"; 
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={HeroOutLogo}
                alt="Heroout Logo"
                style={{ width: 100, height: 80, objectFit: "contain" }}
              />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Hệ thống hỗ trợ phòng ngừa sử dụng ma túy, mang đến giải pháp toàn
              diện cho cộng đồng.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 HEROOUT DrugPrevent. All rights reserved.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/courses"
                  className="hover:text-white transition-colors"
                >
                  Khóa học
                </Link>
              </li>
              <li>
                <Link
                  to="/event"
                  className="hover:text-white transition-colors"
                >
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link
                  to="/consultation"
                  className="hover:text-white transition-colors"
                >
                  Tư vấn
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors"
                >
                  Chính sách
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
