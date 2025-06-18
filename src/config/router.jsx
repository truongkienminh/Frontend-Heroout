import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Login from "../components/authentication/Login/Login";
import Register from "../components/authentication/Register";
import ForgotPassword from "../components/authentication/ForgotPassword";
import CoursesPage from "../pages/CoursesPage";
import BlogsPage from "../pages/BlogsPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import Layout from "../components/layout";
import CourseDetail from "../pages/CourseDetail";
import LearningCoursePage from "../pages/LearningCoursePage";
import EventPage from "../pages/EventPage";
import EventRegistration from "../components/Event/EventRegistration";
import ConsultationPage from "../pages/ConsultationPage";
import ConsultantDetailPage from "../pages/ConsultantDetailPage";
import BookingPage from "../pages/BookingPage";
import StaffLayout from "../components/layout/StaffLayout";
import StaffDashboard from "../components/staff/StaffDashBoard";
import StaffCourse from "../components/staff/StaffCourse";
import StaffMember from "../components/staff/StaffMember";
import StaffSurvey from "../components/staff/StaffSurvey";
import StaffReport from "../components/staff/StaffReport";
import StaffEvent from "../components/staff/StaffEvent";
import RiskSurvey from "../components/RiskSurvey";

// Protected route components (commented out for now)
// const ProtectedRouteAuth = ({ children }) => {
//   const user = useSelector(selectUser);
//   if (!user) {
//     alertFail("You need to login first!!");
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// const ProtectedRouteCreator = ({ children }) => {
//   const user = useSelector(selectUser);
//   if (user?.role === "AUDIENCE") {
//     alertFail("You do not have permissions to access");
//     return <Navigate to="/go-pro" replace />;
//   }
//   return children;
// };

// const ProtectedADMIN = ({ children }) => {
//   const user = useSelector(selectUser);
//   if (user?.role !== "ADMIN" && user?.role !== "MOD") {
//     alertFail("You do not have permissions to access");
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/blogs",
        element: <BlogsPage />,
      },
      {
        path: "/blogs/:id",
        element: <BlogDetailPage />,
      },
      {
        path: "/courses",
        element: <CoursesPage />,
      },
      {
        path: "/coursedetail/:courseId",
        element: <CourseDetail />,
      },
      {
        path: "/event",
        element: <EventPage />,
      },
      {
        path: "/eventregistration",
        element: <EventRegistration />,
      },
      {
        path: "/consultation",
        element: <ConsultationPage />,
      },
      {
        path: "/consultants/:id",
        element: <ConsultantDetailPage />,
      },
      {
        path: "/booking/",
        element: <BookingPage />,
      },
      {
        path: "/booking/:consultantId",
        element: <BookingPage />,
      },
      {
        path: "/risksurvey",
        element: <RiskSurvey />,
      },
    ],
  },
  {
    path: "learningcourse/:courseId",
    element: <LearningCoursePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <StaffDashboard />,
      },
      {
        path: "members",
        element: <StaffMember />,
      },
      {
        path: "courses",
        element: <StaffCourse />,
      },
      {
        path: "surveys",
        element: <StaffSurvey />,
      },
      {
        path: "reports",
        element: <StaffReport />,
      },
      {
        path: "events",
        element: <StaffEvent />,
      },
    ],
  },
]);