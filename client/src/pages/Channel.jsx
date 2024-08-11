import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const Channel = () => {
  const { currentUser } = useAuth();
  // console.log(currentUser);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col xl:w-[95%] mt-5 gap-3 px-4">
        {/* Cover Image */}
        <div className="flex items-center w-full h-auto max-h-[200px] overflow-hidden bg-gray-200 rounded-2xl">
          <img
            src={
              currentUser?.coverImage || "https://via.placeholder.com/1100x175"
            }
            alt="CoverImage"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-5">
          <Avatar className="h-[120px] w-[120px] lg:h-[150px] lg:w-[150px]">
            <AvatarImage
              src={currentUser?.avatar || "https://github.com/shadcn.png"}
              className="object-cover"
            />
            <AvatarFallback>{currentUser?.fullName?.[0] || "A"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 gap-2 flex-col">
            <h1 className="font-bold text-2xl lg:text-4xl">
              {currentUser?.fullName || "User"}
            </h1>
            <span className="text-gray-600 text-sm lg:text-md">
              {"@" + currentUser?.channelName || "!@#"}
            </span>
            <p className="text-gray-600 text-xs lg:text-sm">
              More about this channel
            </p>
            <div className="hidden sm:flex flex-1 gap-5 items-center justify-start">
              <Button className="text-xs sm:text-sm lg:text-md rounded-3xl bg-gray-200 hover:bg-gray-300 text-black">
                Customise channel
              </Button>
              <Button className="text-xs sm:text-sm lg:text-md rounded-3xl bg-gray-200 hover:bg-gray-300 text-black">
                Manage videos
              </Button>
            </div>
          </div>
        </div>
        <div className="flex sm:hidden flex-1 gap-5 items-center justify-start">
          <Button className="text-xs sm:text-sm lg:text-md rounded-3xl bg-gray-200 hover:bg-gray-300 text-black">
            Customise channel
          </Button>
          <Button className="text-xs sm:text-sm lg:text-md rounded-3xl bg-gray-200 hover:bg-gray-300 text-black">
            Manage videos
          </Button>
        </div>
        <div className="flex gap-5 items-center justify-start">
          <span className="p-2 font-semibold text-gray-700">Home</span>
          <span className="p-2 font-semibold text-gray-700">Playlist</span>
          <span className="p-2 font-semibold text-gray-700">Community</span>
        </div>
      </div>
      <Separator />
      <div className="h-[620px] w-full flex items-center justify-center">
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
          <Link to={"./upload"}>
            <Button className="rounded-3xl">Create</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Channel;
