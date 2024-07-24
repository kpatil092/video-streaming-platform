// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Video from "@/pages/Video";

const watch = false;

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      {watch ? (
        <Video />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
};

export default Layout;
