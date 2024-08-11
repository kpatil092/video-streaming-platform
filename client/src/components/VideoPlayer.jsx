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
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'remainingTimeDisplay',
            'playbackRateMenuButton',
            'fullscreenToggle'
          ]
        },
        playbackRates: [0.5, 1, 1.5, 2],
      };

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      player.on('loadedmetadata', () => {
        const videoHeight = player.videoHeight();
        const videoWidth = player.videoWidth();
        if (videoHeight > videoWidth) {
          player.aspectRatio('9:16'); // Switch to portrait aspect ratio
        } else {
          player.aspectRatio('16:9'); // Default to landscape aspect ratio
        }
      });

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
    // <div className=""></div>
    <div className="w-full" ref={videoRef}></div>
  );
};

export default VideoPlayer;
