import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  GraduationCap,
  FileText,
} from 'lucide-react';
import HeroOutLogo from '../../assets/heroout.jpg';

const StaffLayout = () => {
  const location = useLocation();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/staff/dashboard' },
    { icon: Users, label: 'Quản lý thành viên', path: '/staff/members' },
    { icon: GraduationCap, label: 'Quản lý khóa học', path: '/staff/courses' },
    { icon: FileText, label: 'Quản lý khảo sát', path: '/staff/surveys' }
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed top-0 bottom-0">
        {/* Logo */}
        <div className="flex justify-center items-center h-32 border-b border-gray-200">
          <Link to="/staff/dashboard">
            <img
              src={HeroOutLogo}
              alt="HeroOut Logo"
              className="h-24 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto mt-6">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors outline-none focus:outline-none ring-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">ST</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Staff User</p>
              <p className="text-xs text-gray-500">Staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 h-screen overflow-y-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default StaffLayout;
