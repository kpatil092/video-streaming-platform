// src/components/ActionButtons.js

import React from "react";
import { Button } from "./ui/button";
import PopoverMenu from "./PopoverMenu";

export const ShortsActionButtons = () => {
  return (
    <div className="flex flex-col items-center gap-4 h-max ">
      <div className="flex flex-col justify-center items-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          👍
        </Button>
        <span className="ml-2">5.5K</span>
      </div>

      <div className="flex flex-col justify-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          👎
        </Button>
        <span className="ml-2">Dislike</span>
      </div>
      <div className="flex flex-col justify-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          💬
        </Button>
        <span className="ml-2">2,424</span>
      </div>
      <div className="flex flex-col justify-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          📩
        </Button>
        <span className="ml-2">Share</span>
      </div>
      <div className="flex flex-col justify-center">
        <Button className="flex items-center rounded-full w-12 h-12 bg-gray-100 text-black hover:bg-gray-300">
          <PopoverMenu />
        </Button>
      </div>
      <div className="">
        <img src="https://via.placeholder.com/40/" alt="Channel" className="rounded-md"/>
      </div>
    </div>
  );
};
