import React from "react";
import PlaylistCard from "@/components/PlaylistCard";
import { Separator } from "@/components/ui/separator";

const PlaylistsGrid = () => {
  const playlists = Array.from({ length: 22 }, (_, i) => ({
    images: [
      `https://via.placeholder.com/150?text=${i + 1}`,
      `https://via.placeholder.com/150?text=${i + 2}`,
      `https://via.placeholder.com/150?text=${i + 3}`,
    ],
    title: `Playlist ${i + 1}`,
    videoCount: Math.floor(Math.random() * 50) + 1,
  }));

  return (
    <div className="container mx-auto px-10 my-5">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <PlaylistCard
            images={playlists[0].images}
            title="Watch Later"
            videoCount={playlists[0].videoCount}
          />
          <PlaylistCard
            images={playlists[1].images}
            title="Liked Videos"
            videoCount={playlists[1].videoCount}
          />
        </div>
        <Separator className="rounded-full my-2 bg-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {playlists.map((playlist, index) => (
            <PlaylistCard
              key={index}
              images={playlist.images}
              title={playlist.title}
              videoCount={playlist.videoCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistsGrid;
