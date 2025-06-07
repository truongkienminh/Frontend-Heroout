import { Link } from "react-router-dom";
import HeroOutLogo from "../assets/heroout.jpg";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/">
            <img
              src={HeroOutLogo}
              alt="Herodout Logo"
              style={{ width: 100, height: 80, objectFit: "contain" }}
            />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/blogs"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/courses"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Khóa học
            </Link>
            <Link
              to="/events"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sự kiện
            </Link>
            <Link
              to="/consultation"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Tư vấn
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-md font-medium transition-colors"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
