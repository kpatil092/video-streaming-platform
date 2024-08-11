// src/components/ActionButtons.js

import React from "react";
import PopoverMenu from "./PopoverMenu";
import { Button } from "./ui/button";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

const ShortsActionButtons = () => {
  return (
    <div className="flex flex-col items-center gap-4 h-max ">
      <div className="flex flex-col justify-center items-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          <ThumbUpOffAltIcon />
        </Button>
        <span className="ml-2">5.5K</span>
      </div>

      <div className="flex flex-col justify-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          <ThumbDownOffAltIcon />
        </Button>
        <span className="ml-2">Dislike</span>
      </div>
      <div className="flex flex-col justify-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          <MapsUgcOutlinedIcon />
        </Button>
        <span className="ml-2">2,424</span>
      </div>
      <div className="flex flex-col justify-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          <ShareOutlinedIcon />
        </Button>
        <span className="ml-2">Share</span>
      </div>
      <div className="flex flex-col justify-center">
        <span className="flex items-center justify-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          <PopoverMenu />
        </span>
      </div>
      <div className="">
        <img
          src="https://via.placeholder.com/40/"
          alt="Channel"
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default ShortsActionButtons;
