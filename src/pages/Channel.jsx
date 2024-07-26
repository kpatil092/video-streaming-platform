import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Channel = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col xl:w-[95%] mt-5 gap-3 px-4">
        <img
          src="https://via.placeholder.com/1100x175"
          alt="CoverImage"
          className="rounded-2xl"
        />
        <div className="flex gap-5">
          <Avatar className="h-[120px] w-[120px] lg:h-[150px] lg:w-[150px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 gap-2 flex-col">
            <h1 className="font-bold text-2xl lg:text-4xl">KP</h1>
            <span className="text-gray-600 text-sm lg:text-md">@itz_kp092</span>
            <p className="text-gray-600 text-xs lg:text-sm">More about this channel</p>
            <div className="flex flex-1 gap-5 items-center justify-start">
              <Button className="text-sm lg:text-md rounded-3xl bg-gray-200 hover:bg-gray-300 text-black">
                Customise channel
              </Button>
              <Button className="rounded-3xl bg-gray-200 hover:bg-gray-300 text-black">
                Manage videos
              </Button>
            </div>
          </div>
        </div>
        <div className="flex gap-5 items-center justify-start">
          <span className="p-2 font-semibold text-gray-700">Home</span>
          <span className="p-2 font-semibold text-gray-700">Playlist</span>
          <span className="p-2 font-semibold text-gray-700">Community</span>
        </div>
      </div>
      <Separator />
      <div className="h-[620px] w-[1100px] flex items-center justify-center">
        <div className="flex flex-col gap-5 items-center justify-center">
          <img
            src="https://via.placeholder.com/100x100"
            alt="Create"
            className="rounded-full mb-5"
          />
          <p className="text-md font-semibold">Create content on any device</p>
          <div className="flex flex-col items-center text-sm">
            <p>Upload and record at home or on the go.</p>
            <p>Everything that you make public will appear here.</p>
          </div>
          <Button className="rounded-3xl">Create</Button>
        </div>
      </div>
    </div>
  );
};

export default Channel;
