import React from "react";
import { Button } from "./ui/button";

const ChannelCard = ({ channelId, channelName, logoUrl, isSubscribed, onSubscribe }) => {
  return (
    <div className="flex items-center gap-4 bg-gray-200 rounded-lg p-3 max-w-[300px]">
      <img
        className="w-20 h-20 rounded-full object-cover"
        src={logoUrl || "https://via.placeholder.com/48"}
        alt="Channel Logo"
      />
      <div className="flex-1 gap-5">
        <span className="font-semibold text-sm block truncate">
          {channelName}
        </span>
        <Button
          className="mt-1 text-xs whitespace-nowrap h-auto"
          onClick={() => onSubscribe(channelId)}
        >
          Unsubscribe
        </Button>
      </div>
    </div>
  );
};

export default ChannelCard;
