// src/components/Header.jsx
import React, { useState } from "react";

import { useSidebarMessage } from "@/contexts/SidebarContext";

import Searchbar from "./Searchbar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Button } from "./ui/button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PersonIcon from "@mui/icons-material/Person";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FlagIcon from "@mui/icons-material/Flag";
import { postData } from "@/api/axios";

const Header = () => {
  const { setSidebarToggle } = useSidebarMessage();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    setLoading(true);
    setError("");

    try {
      const response = await postData("/users/logout");
      // console.log(response);
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError("Fail to logout");
      console.log("Fail to logout", error);
    } finally {
      setLoading(false);
    }
  };

  const { isAuthenticated, currentUser } = useAuth();
  // console.log(currentUser);
  // const isAuthenticated = true;
  // console.log(isAuthenticated);

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <header className="bg-gray-100 text-black px-6 py-3 flex items-center justify-between border-b-[2px] w-full">
      {/* Logo */}
      <div className="flex gap-5">
        <div
          className="hidden lg:block cursor-pointer hover:bg-gray-300 rounded-full p-2"
          onClick={() => setSidebarToggle((toggle) => !toggle)}
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
      <div className="relative w-[50%] md:w-[40%] flex border-gray-400 border-[1px] py-2 px-4 rounded-full">
        <Searchbar />
      </div>
      {/* Profile Icon */}
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <div className="hidden sm:block cursor-pointer">
              <NotificationsNoneIcon />
            </div>

            <DropdownMenu className="flex flex-row-reverse">
              <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={currentUser.avatar || "https://github.com/shadcn.png"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {currentUser.fullName?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-1 flex flex-col w-full">
                <DropdownMenuLabel className="text-base font-bold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-3 text-base">
                  <PersonIcon /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-3 text-base">
                  <LiveTvIcon />
                  My Channel
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-3 text-base">
                  <CreateIcon />
                  Create
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-3 text-base">
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-3 text-base">
                  <FlagIcon />
                  Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex gap-3 text-base"
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                  Sign-out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          !isAuthPage && (
            <>
              <NavLink to="/sign-in">
                <Button className="rounded-full w-20 text-xs h-auto p-3 border-gray-800 shadow-md bg-gray-800 hover:bg:700">
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/sign-up">
                <Button className="hidden md:block rounded-full w-20 text-xs h-auto p-3 border-gray-800 shadow-md bg-gray-800 hover:bg:700">
                  Sign Up
                </Button>
              </NavLink>
            </>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
