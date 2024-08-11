import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ShortsCard from "@/components/ShortsCard";

const shorts = [
  {
    thumbnail: "https://via.placeholder.com/350x600",
    channelLogo: "https://via.placeholder.com/40",
    channelName: "Channel 1",
    title:
      "💪C'mon! Learn How To Give CPR and Save Life - By Kishor Singh #shorts",
    views: "3.5K",
    timeAgo: "1 year ago",
  },
  {
    thumbnail: "https://via.placeholder.com/350x600",
    channelLogo: "https://via.placeholder.com/40",
    channelName: "Channel 2",
    title: "Short Title 2",
    views: "4.2K",
    timeAgo: "2 months ago",
  },
  {
    thumbnail: "https://via.placeholder.com/350x600",
    channelLogo: "https://via.placeholder.com/40",
    channelName: "Channel 4",
    title:
      "💪C'mon! Learn How To Give CPR and Save Life - By Kishor Singh #shorts",
    views: "3.5K",
    timeAgo: "1 year ago",
  },
  // Add more Short objects as needed
];

const Shorts = () => {

  return (
    <div className="w-full overflow-y-scroll h-full flex flex-col items-center">
      {shorts.map((short, index) => (
        <div className="flex" key={index}>
          <ShortsCard short={short} />
        </div>
      ))}
    </div>
  );
};

export default Shorts;
