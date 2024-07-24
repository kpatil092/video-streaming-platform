import React, { useEffect, useState } from "react";
import PopoverMenu from "./PopoverMenu";

export const VideoCard = ({
  thumbnail,
  channelLogo,
  title,
  channelName,
  views,
  uploadTime,
  videoLength,
  small,
}) => {
  return (
    <div
      className={`flex gap-1 max-w-sm rounded overflow-hidden mb-5 shadow-md cursor-pointer ${
        small ? "w-full" : "flex-col"
      }`}
    >
      <div className={`relative ${small && "flex-[4]"}`}>
        <img className="w-full" src={thumbnail} alt="Video Thumbnail" />
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
          {videoLength}
        </div>
      </div>
      <div className={`flex p-1 ${small && "flex-[5]"}`}>
        {!small && (
          <img
            className="w-12 h-12 rounded-full mr-4"
            src={channelLogo}
            alt="Channel Logo"
          />
        )}
        <div className="flex flex-col flex-1 ">
          <div
            className={`font-bold line-clamp-2 ${
              small ? "text-xs" : "text-sm"
            }`}
          >
            {title}
          </div>
          <div className="text-gray-500 text-xs">{channelName}</div>
          <div className="text-gray-500 text-xs">
            {views} views • {uploadTime}
          </div>
        </div>
        <PopoverMenu />
      </div>
    </div>
  );
};
