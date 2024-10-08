import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ScrollToTop from "./ScrollToTop";

import { SidebarMessageProvider } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";

const Layout = ({ children }) => {
  const { authLoading } = useAuth();
  return (
    <>
      {/* {!authLoading && ( */}
        <SidebarMessageProvider>
          <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex items-center">
              <Header />
            </div>

            <div className="flex overflow-hidden h-full">
              <div className="flex-[1]">
                <Sidebar />
              </div>
              <main className="flex-[30] overflow-y-auto bg-slate-100">
                <ScrollToTop />
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarMessageProvider>
      {/* )} */}
    </>
  );
};

export default Layout;
