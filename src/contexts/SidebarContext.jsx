import React, { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

export const SidebarMessageProvider = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarToggle, setSidebarToggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarMessage = () => useContext(SidebarContext);
