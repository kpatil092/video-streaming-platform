import React from "react";

const PlaylistCard = ({ images, title, videoCount }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative h-48">
        {/* Stack of images */}
        {images.slice(0, 3).map((image, index) => (
          <div className="border-2 border-black ">
            <img
              key={index}
              src={image || "https://via.placeholder.com/150"}
              alt={`Playlist ${title} thumbnail ${index + 1}`}
              className={`absolute top-${index * 2} left-${
                index * 2
              } w-full h-full object-cover rounded-md`}
              style={{
                zIndex: 3 - index,
                transform: `translateY(-${index * 5}px) translateX(-${
                  index * 5
                }px)`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-md truncate">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{videoCount} videos</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
