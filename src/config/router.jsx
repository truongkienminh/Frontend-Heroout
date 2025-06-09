import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Login from "../components/authentication/Login";
import Register from "../components/authentication/Register";
import ForgotPassword from "../components/authentication/ForgotPassword";
import CoursesPage from "../pages/CoursesPage";
import BlogsPage from "../pages/BlogsPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import Layout from "../components/layout";
import CourseDetail from "../pages/CourseDetail";
import LearningCoursePage from "../pages/LearningCoursePage";
import Event from "../components/Event/Event";
import EventRegistrationPage from "../components/Event/EventRegistrationPage";

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
        element: <Event />,
      },
      {
        path: "/eventregistration",
        element: <EventRegistrationPage />,
      },
    ],
  },
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/learningcourse/:courseId",
        element: <LearningCoursePage />,
      },
    ],
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
]);
