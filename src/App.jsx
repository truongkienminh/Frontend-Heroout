import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import { Provider } from "react-redux";
import { persistor, store } from "./store/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { StateProvider } from "./contexts/StateProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
AOS.init({
  duration: 1000,
});
function App() {
  // useRealtime((data) => {
  //   console.log(data);
  // });
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <StateProvider>
                <RouterProvider router={router} />
              </StateProvider>
            </AuthProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
