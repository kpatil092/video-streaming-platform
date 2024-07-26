// src/components/Header.jsx
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useSidebarMessage } from "@/contexts/SidebarContext";

const Header = () => {
  const { setSidebarToggle } = useSidebarMessage();
  return (
    <header className="bg-gray-100 text-black px-6 py-3 flex items-center justify-between border-b-[2px] w-full">
      {/* Logo */}
      <div className="flex gap-5">
        <div
          className="hidden lg:block cursor-pointer hover:bg-gray-300 rounded-full p-2"
          onClick={() => setSidebarToggle(toggle => !toggle)}
        >
          <MenuIcon />
        </div>

        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://via.placeholder.com/48"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-xl font-bold hidden sm:block">MyApp</span>
        </div>
      </div>
      {/* Search Bar */}
      <div className="w-[50%] md:w-[40%] flex border-gray-400 border-[1px] py-2 px-4 rounded-full">
        <input
          placeholder="Search"
          className="bg-transparent flex-[12] border-none outline-none w-full"
        />
        <SearchOutlinedIcon className="flex-1 p-0 cursor-pointer" />
      </div>
      {/* Profile Icon */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:block cursor-pointer">
          <NotificationsNoneIcon />
        </div>

        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
