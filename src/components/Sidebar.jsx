// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
// import axios from 'axios';
import { Separator } from "./ui/separator";
import SidebarItem from "./SidebarItem";

const categories = [
  { name: "Video", id: 1 },
  { name: "Video", id: 1 },
  { name: "Video", id: 1 },
  { name: "Video", id: 1 },
];

const Sidebar = () => {
  return (
    <div className="w-1/6 h-screen bg-gray-800 text-white overflow-y-auto p-4">
      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <SidebarItem key={category.id} category={category} />
        ))}
        <Separator />
        {categories.map((category) => (
          <SidebarItem key={category.id} category={category} />
        ))}
        <Separator />
        {categories.map((category) => (
          <SidebarItem key={category.id} category={category} />
        ))}
        <Separator />
        {categories.map((category) => (
          <SidebarItem key={category.id} category={category} />
        ))}
        <Separator />
        {categories.map((category) => (
          <SidebarItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
