import React, { useState } from "react";

import { Button } from "./ui/button";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { TextareaAutosize } from "@mui/material";
import { Separator } from "@radix-ui/react-dropdown-menu";

const SingleComment = () => {
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est suscipit
          recusandae, illum laborum soluta iste id perspiciatis repudiandae
          accusantium iure, fugiat aperiam asperiores?
        </p>

        <div className="flex gap-2">
          <Button className="rounded-full bg-gray-200 hover:bg-gray-300  text-black p-2">
            <ThumbUpOffAltIcon />
          </Button>
          <Button className="rounded-full bg-gray-200 hover:bg-gray-300 text-black p-2">
            <ThumbDownOffAltIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Comments = () => {
  const wordLimit = 300;
  const maxLen = 3000;
  const [value, setValue] = useState("");
  const counts = 30;

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const words = inputValue.split(/\s+/).filter(Boolean); // Split by spaces and filter out empty strings
    if (words.length <= wordLimit && inputValue.length <= maxLen) {
      setValue(inputValue);
    } else if (inputValue.length > maxLen) {
      // Limit reached
      const trimmedValue = inputValue.slice(0, maxLen);
      setValue(trimmedValue);
    } else {
      // Limit reached
      const trimmedValue = words.slice(0, wordLimit).join(" ");
      setValue(trimmedValue);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full pt-3">
        <div className="flex gap-10">
          <h2 className="font-bold text-xl">{counts} Comments</h2>
          {/* <Button className="text-s font-semibold bg-transparent p-0 h-auto hover:bg-transparent">
              ⫸ Sort by
            </Button> */}
        </div>
        <div className="flex gap-2">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <TextareaAutosize
              id="autoResizingTextarea"
              placeholder="Add a comment..."
              maxRows={8}
              value={value}
              onChange={handleChange}
              className="mt-1 p-2 border-t-0 border-x-0 border-b-[1.5px] bg-transparent border-gray-400 w-full focus:outline-none focus:border-gray-800 resize-none transition-colors"
            />
            <div className="flex justify-end gap-7">
              <Button className="rounded-full h-auto text-sm text-black bg-gray-200 hover:bg-gray-300 border-gray-300 border-[0.5px] ">
                Cancel
              </Button>
              <Button className="rounded-full h-auto text-white bg-gray-800 hover:bg-gray-700 border-gray-1000 border-[0.5px]">
                Comment
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex justify-center pt-2 flex-col gap-4">
          {counts
            ? Array.from({ length: counts }, (_, index) => (
                <div key={index}>
                  <SingleComment />
                </div>
              ))
            : "No comments yet"}
        </div>
      </div>
    </>
  );
};

export default Comments;
