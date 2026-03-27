import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import { attachTokenInterceptor } from "./config/axiosApi";
import { useAuth } from "@clerk/react";
import axiosApi from "./config/axiosApi";

function App() {
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !getToken) return;

    const interceptorId = attachTokenInterceptor(getToken)
    return () => {
      axiosApi.interceptors.request.eject(interceptorId);
    };

  }, [getToken, isLoaded])

  return (
    <>
      <ToastContainer />
      <div
        className="bg-background min-h-screen"
        style={{
          backgroundImage: `
      linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(#fdf7c4)
    `,
          backgroundSize: "100px 100px, 100px 100px, 100% 100%",
        }}
      >
        <Header />

        <div className="min-h-screen">
          <Outlet />
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
