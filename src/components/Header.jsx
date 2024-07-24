// src/components/Header.jsx
import React from "react";
import { SearchBar } from "./SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between border-b-[2px] border-b-gray-500">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/path/to/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-xl font-bold">MyApp</span>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Profile Icon */}
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        
      </div>
    </header>
  );
};

export default Header;
