import { ShortsCard } from "@/components/ShortsCard";
import React from "react";

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
  // Add more Short objects as needed
];

export const Shorts = () => {
  return (
    <div className="w-full overflow-y-scroll h-screen flex flex-col items-center">
      {shorts.map((short, index) => (
        <div className="flex" key={index}>
          <ShortsCard short={short} />
        </div>
      ))}
    </div>
  );
};
