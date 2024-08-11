import React from "react";
import { DialogBoxPlaylist } from "./DialogBox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import GetAppIcon from "@mui/icons-material/GetApp";
import ShareIcon from "@mui/icons-material/Share";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import ReportIcon from "@mui/icons-material/Report";

const PopoverMenu = () => {
  return (
    <div className="flex">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreVertIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild>
              {/*Dialog for save to playlist*/}
              <DropdownMenuItem className="cursor-pointer disabled:cursor-not-allowed">
                <span className="mr-3">
                  <WatchLaterIcon />
                </span>
                Save to Watch later
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild>
              {/*Dialog for save to playlist*/}
              <DropdownMenuItem className="cursor-pointer disabled:cursor-not-allowed">
                <span className="mr-3">
                  <FolderSpecialIcon />
                </span>
                Save to playlist
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer disabled:cursor-not-allowed"
              disabled={1}
            >
              <span className="mr-3">
                <GetAppIcon />
              </span>
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer disabled:cursor-not-allowed"
              disabled={1}
            >
              <span className="mr-3">
                <ShareIcon />
              </span>
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer disabled:cursor-not-allowed"
              disabled={1}
            >
              <span className="mr-3">
                <NotInterestedIcon />
              </span>
              Not interested
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer disabled:cursor-not-allowed">
              <span className="mr-3">
                <ReportIcon />
              </span>
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogBoxPlaylist />
      </Dialog>
    </div>
  );
};

export default PopoverMenu;
