import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PopoverMenu from "./PopoverMenu";

const VideoCard = ({
  thumbnail,
  channelLogo,
  title,
  channelName,
  views,
  uploadTime,
  videoLength,
  small,
  id = 1,
}) => {
  return (
    <div
      className={`flex gap-1 max-w-sm rounded overflow-hidden mb-5 shadow-md cursor-pointer ${
        small ? "w-full" : "flex-col"
      }`}
    >
      <Link to={`/video/${id}`} className={`relative ${small && "flex-[4]"}`}>
        <div className="relative w-full h-0 pb-[56.25%] bg-gray-800">
          <img
            className="absolute top-0 left-0 w-full h-full object-contain"
            src={thumbnail}
            alt="Video Thumbnail"
          />
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
            {videoLength}
          </div>
        </div>
      </Link>
      <div className={`flex p-1 ${small && "flex-[5]"}`}>
        {!small && (
          <img
            className="w-12 h-12 rounded-full mr-4 object-cover"
            src={channelLogo}
            alt="Channel Logo"
          />
        )}
        <div className="flex flex-col flex-1 ">
          <Link
            to={`/video/${id}`}
            className={`font-bold line-clamp-2 ${
              small ? "text-xs" : "text-sm"
            }`}
          >
            {title}
          </Link>
          <div className="text-gray-700 text-xs font-semibold">{channelName}</div>
          <div className="text-gray-500 text-xs">
            {views} views • {uploadTime}
          </div>
        </div>
        <PopoverMenu />
      </div>
    </div>
  );
};

export default VideoCard;
