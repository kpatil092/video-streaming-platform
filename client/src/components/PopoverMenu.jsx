import React, { useEffect, useRef } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./ui/separator";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import QueueIcon from "@mui/icons-material/Queue";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import GetAppIcon from "@mui/icons-material/GetApp";
import ShareIcon from "@mui/icons-material/Share";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ReportIcon from "@mui/icons-material/Report";

const PopoverMenu = () => {
  const popoverMenuRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       popoverMenuRef.current && !popoverMenuRef.current.contains(event.target)
  //     ) {
  //       setSuggestions([]);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   document.addEventListener("scrolldown", handleClickOutside);
  //   document;
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //     document.removeEventListener("scroll", handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="flex" ref={popoverMenuRef}>
      <Popover className="flex-1">
        <PopoverTrigger className="h-6 w-6">
          <MoreVertIcon />
        </PopoverTrigger>
        <PopoverContent className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-0 text-sm">
          <div>
            <div className="text-sm">
              <button className="flex items-center px-4 py-1 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <QueueIcon />
                </span>
                Add to queue
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <WatchLaterIcon />
                </span>
                Save to Watch Later
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <FolderSpecialIcon />
                </span>
                Save to playlist
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <GetAppIcon />
                </span>
                Download
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <ShareIcon />
                </span>
                Share
              </button>
              <Separator className="my-1" />
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <NotInterestedIcon />
                </span>
                Not interested
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <RemoveCircleOutlineIcon />
                </span>
                Don't recommend channel
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">
                  <ReportIcon />
                </span>
                Report
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PopoverMenu;
