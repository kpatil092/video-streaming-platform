import React from "react";
import { Button } from "./ui/button";

const Comments = () => {
  return (
    <div className="flex gap-3">
      <div className="flex space-x-4">
        <img
          src="https://via.placeholder.com/40/"
          alt="Logo"
          className="rounded-full h-10 w-10"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex gap-5 text-sm items-center">
          <span className="font-semibold">Channel Name</span>
          <span className="text-gray-400 text-xs">12 hours ago</span>
        </div>
        <p className="text-md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
          suscipit recusandae, illum laborum soluta iste id perspiciatis
          repudiandae accusantium iure, fugiat aperiam asperiores?
        </p>

        <div className="flex gap-2">
          <Button className="rounded-full bg-transparent hover:bg-gray-200">
            👍
          </Button>
          <Button className="rounded-full bg-transparent hover:bg-gray-200">
            👎
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
