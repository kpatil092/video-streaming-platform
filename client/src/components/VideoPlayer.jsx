import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoPlayer = ({ videoUrl, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoUrl) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const options = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: videoUrl,
            type: videoUrl.endsWith(".m3u8") ? "application/x-mpegURL" : "video/mp4",
          },
        ],
      };

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      videoElement.addEventListener("contextmenu", handleContextMenu);
    }
  }, [videoUrl, onReady]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center rounded-2xl">
      {/* <h2 className="text-xl font-bold mb-4">{title}</h2> */}
      <div ref={videoRef} className="w-full"></div>
    </div>
  );
};

export default VideoPlayer;
