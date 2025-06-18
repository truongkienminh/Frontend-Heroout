import { Navigate, createBrowserRouter } from "react-router-dom";

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
import ProtectedRoute from "../components/ProtectedRoute";

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
        element: (
          <ProtectedRoute>
            <EventRegistration />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/booking/:consultantId",
        element: (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "learningcourse/:courseId",
    element: (
      <ProtectedRoute>
        <LearningCoursePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Register />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgotpassword",
    element: (
      <ProtectedRoute requireAuth={false}>
        <ForgotPassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute>
        <StaffLayout />
      </ProtectedRoute>
    ),
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
      }
    ],
  },
]);
