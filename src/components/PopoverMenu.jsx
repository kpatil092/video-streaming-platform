import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./ui/separator";

const PopoverMenu = () => {
  return (
    <div className="flex">
      <Popover className="flex-1">
        <PopoverTrigger className="h-6 w-6">¦</PopoverTrigger>
        <PopoverContent className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-0 text-sm">
          <div>
            <div className="py-1">
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">▶</span> Add to queue
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">⏲</span> Save to Watch Later
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">📂</span> Save to playlist
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">⬇️</span> Download
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">🔗</span> Share
              </button>
              <Separator className="my-1" />
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">🚫</span> Not interested
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">⛔</span> Don't recommend channel
              </button>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100">
                <span className="mr-3">🚩</span> Report
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PopoverMenu;
