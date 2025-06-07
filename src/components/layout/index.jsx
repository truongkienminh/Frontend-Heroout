import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
function Layout() {
  return (
    <div>
      <Header />
      <div
        className="main-content"
        style={{
        
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
export default Layout;