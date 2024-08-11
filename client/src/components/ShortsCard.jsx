import React from "react";
import ShortsActionButtons from "./ShortsActionButton";
import { Button } from "./ui/button";

const ShortsCard = ({ short }) => {
  return (
    // <div className="flex flex-2my-4 "> </div>
      <div className="w-full flex justify-center items-end my-4 gap-4">
        <div className="relative max-w-md mx-auto overflow-hidden rounded-lg shadow-lg ">
          <img src={short.thumbnail} alt={short.title} className="w-full " />
          <div className="absolute bottom-0 left-0 p-4 w-full flex items-center">
            <div>
              <div className="flex gap-2 items-center mb-1">
                <img
                  src={short.channelLogo}
                  alt={short.channelName}
                  className="w-10 h-10 rounded-full border-[1px] border-black"
                />
                <p className="font-bold">{short.channelName}</p>
                <Button className="text-[0.75rem] p-4 rounded-[20px] bg-white text-black h-0 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
              <p className="text-[0.9rem] font-[500] line-clamp-2">
                {short.title}
              </p>
            </div>
          </div>
        </div>
      <ShortsActionButtons />
      </div>
    
  );
};

export default ShortsCard;