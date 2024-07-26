// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarMessageProvider } from "@/contexts/SidebarContext";
import ScrollToTop from "./ScrollToTop";

const Layout = ({ children }) => {
  return (
    <SidebarMessageProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex items-center">
          <Header />
        </div>

        <div className="flex overflow-hidden">
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
  );
};

export default Layout;
