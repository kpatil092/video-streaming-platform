import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const ScrollablePanel = () => {
  const labels = [
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
    "Ketan Patil",
  ];

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center top-0 bg-gray-100 z-10 gap-3">
      <Button
        onClick={scrollLeft}
        className="bg-gray-100 hover:bg-gray-300 p-2 rounded-full focus:outline-none text-black cursor-pointer"
      >
        <KeyboardArrowLeftOutlinedIcon />
      </Button>
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto whitespace-nowrap py-4 flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {labels.map((label, index) => (
          <Badge
            variant="outline"
            key={index}
            className="inline-block text-sm px-4 py-2 mx-2 bg-gray-200 cursor-pointer hover:bg-gray-300"
          >
            {label}
          </Badge>
        ))}
      </div>
      <Button
        onClick={scrollLeft}
        className="bg-gray-100 hover:bg-gray-300 p-2 rounded-full focus:outline-none text-black cursor-pointer"
      >
        <KeyboardArrowRightOutlinedIcon />
      </Button>
    </div>
  );
};

export default ScrollablePanel;
