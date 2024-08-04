// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Separator } from "./ui/separator";
import { ScreenWidth } from "@/assets/Constant";
import { useSidebarMessage } from "@/contexts/SidebarContext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FilterCenterFocusOutlinedIcon from "@mui/icons-material/FilterCenterFocusOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import PortraitIcon from "@mui/icons-material/Portrait";
import HistoryIcon from "@mui/icons-material/History";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import TocIcon from "@mui/icons-material/Toc";
import SettingsIcon from "@mui/icons-material/Settings";
import FlagIcon from "@mui/icons-material/Flag";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  [
    { name: "Home", id: 1, path: "/", icon: () => <HomeOutlinedIcon /> },
    {
      name: "Shorts",
      id: 2,
      path: "/shorts/:id",
      icon: () => <FilterCenterFocusOutlinedIcon />,
    },
    {
      name: "Subscription",
      id: 3,
      path: "/subscription",
      icon: () => <SubscriptionsOutlinedIcon />,
    },
    {
      name: "Your Channel",
      id: 4,
      path: "/mychannel",
      icon: () => <PortraitIcon />,
    },
  ],
  [
    { name: "History", id: 5, path: "/history", icon: () => <HistoryIcon /> },
    {
      name: "Playlist",
      id: 6,
      path: "/playlist",
      icon: () => <PlaylistPlayIcon />,
    },
    {
      name: "Video",
      id: 7,
      path: "/videos",
      icon: () => <VideocamOutlinedIcon />,
    },
    {
      name: "Watch later",
      id: 8,
      path: "/watchlater",
      icon: () => <WatchLaterIcon />,
    },
  ],
  [
    {
      name: "Subscriptions",
      id: 9,
      path: "/subscriptions",
      icon: () => <TocIcon />,
    },
  ],
  [
    { name: "Setting", id: 10, path: "/setting", icon: () => <SettingsIcon /> },
    { name: "Report", id: 11, path: "/report", icon: () => <FlagIcon /> },
  ],
];

const SidebarItem = ({ category, size, authStatus }) => {
  const { sidebarToggle: toggle } = useSidebarMessage();
  const canBeAccessed =
    authStatus || category.name === "Home" || category.name === "Shorts";
  return (
    <NavLink
      to={canBeAccessed ? category.path : "/sign-in"}
      className={({ isActive }) =>
        `flex flex-col lg:gap-2 w-auto items-center px-2 sm:px-3 py-2 hover:bg-gray-200 hover:rounded-sm cursor-pointer ${
          toggle && "lg:flex-row lg:w-48 gap-2 lg:gap-5"
        } ${isActive && canBeAccessed ? "bg-gray-200" : ""}`
      }
    >
      {category.icon()}
      <div
        className={`hidden sm:block text-xs md:text-xs ${
          toggle ? "lg:text-base" : "lg:text-sm"
        }`}
      >
        {category.name}
      </div>
    </NavLink>
  );
};

const Sidebar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { isAuthenticated, currentUser } = useAuth();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);
  // !(parseInt(windowWidth) < ScreenWidth.lg);

  return (
    <div
      className={`h-full bg-gray-100 text-black overflow-y-auto mt-16 lg:mt-0 ml-2 lg:ml-0 lg:p-4`}
    >
      <div className="flex flex-col gap-5 lg:gap-2">
        {categories[0].map((category) => (
          <SidebarItem
            key={category.id}
            category={category}
            authStatus={isAuthenticated}
          />
        ))}
        {parseInt(windowWidth) >= ScreenWidth.md && (
          <>
            <Separator />
            {categories[1].map((category) => (
              <SidebarItem
                key={category.id}
                category={category}
                authStatus={isAuthenticated}
              />
            ))}
            <Separator />
            {categories[2].map((category) => (
              <SidebarItem
                key={category.id}
                category={category}
                authStatus={isAuthenticated}
              />
            ))}
            <Separator />
            {categories[3].map((category) => (
              <SidebarItem
                key={category.id}
                category={category}
                authStatus={isAuthenticated}
              />
            ))}
          </>
        )}
        {/* {size &
        (
          <SidebarItem
            category={{
              name: "Add",
              id: 5,
              icon: () => <AddCircleOutlineIcon />,
            }}
            size="small"
          />
        )} */}
      </div>
    </div>
  );
};

export default Sidebar;
