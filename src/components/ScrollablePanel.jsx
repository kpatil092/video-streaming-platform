import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
    <div className="sticky flex items-center top-0 bg-white z-10 gap-3">
      <Button
        onClick={scrollLeft}
        className="bg-gray-600 p-2 rounded-l-md focus:outline-none"
      >
        &lt;
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
            className="inline-block text-sm px-4 py-2 mx-2 bg-gray-200 cursor-pointer"
          >
            {label}
          </Badge>
        ))}
      </div>
      <Button
        onClick={scrollRight}
        className="bg-gray-600 p-2 rounded-r-md focus:outline-none"
      >
        &gt;
      </Button>
    </div>
  );
};

export default ScrollablePanel;
