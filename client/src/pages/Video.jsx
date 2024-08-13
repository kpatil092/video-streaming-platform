import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { format } from "timeago.js";

import { getData, postData } from "@/api/axios";
import { useAuth } from "@/contexts/AuthContext";

import VideoCard from "@/components/VideoCard";
import Comments from "@/components/Comments";

import VideoPlayer from "@/components/VideoPlayer";
import "video.js/dist/video-js.css";
import { Button } from "@/components/ui/button";

import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PopoverMenu from "@/components/PopoverMenu";

const Video = () => {
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [video, setVideo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [videoRes, recommendedVideoRes] = await Promise.all([
          isAuthenticated
            ? getData(`/video/${id}?userId=${currentUser._id}`)
            : getData(`/video/${id}`),
          getData("/video/videos"),
        ]);
        setVideo(videoRes.data);
        setRecommendedVideos(recommendedVideoRes.data.docs);
        setIsSubscribed(videoRes.data.isSubscribed); //
        // console.log(videoRes.data);
      } catch (error) {
        console.log("Error occur", error?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      const response = await postData(`/users/subscribe/${video.owner._id}`);
      if (response.statusCode === 200) {
        setIsSubscribed(true);
      }
      // console.log(response);
    } catch (error) {
      console.log("Subscription error", error?.message);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const response = await postData(`/users/unsubscribe/${video.owner._id}`);
      if (response.statusCode === 200) {
        setIsSubscribed(false);
      }
      // console.log(response);
    } catch (error) {
      console.log("Unsubscription error", error?.message);
    }
  };

  const formatTime = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;

    const fhr = h.toString().padStart(2, "0");
    const fmin = m.toString().padStart(2, "0");
    const fsec = s.toString().padStart(2, "0");

    return h > 0 ? `${fhr}:${fmin}:${fsec}` : `${fmin}:${fsec}`;
  };

  return (
    <div className="px-4 flex flex-col xl:flex-row gap-5 my-5 w-full">
      {/* Left Part */}
      <main className="flex flex-col flex-[2] gap-3">
        <div className="relative w-full pb-[56.25%] bg-gray-900 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {isLoading ? (
              <img src="https://via.placeholder.com/1000x700" />
            ) : (
              <VideoPlayer videoUrl={video.videoFile} />
            )}
          </div>
        </div>

        <h2 className="font-bold text-base md:text-lg lg:text-xl">
          {video.title ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam minus totam reprehenderit provident culpa impedit. Eaque."}
        </h2>
        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="flex gap-5 items-center justify-start w-full">
            <img
              src={
                isLoading
                  ? "https://via.placeholder.com/48"
                  : video?.owner?.avatar || "https://via.placeholder.com/48"
              }
              className="rounded-full h-10 w-10 md:h-14 md:w-14 object-cover"
            />
            <div>
              <h1 className="text-sm md:text-base font-semibold">
                {video?.owner?.channelName || "Channel Name CH1"}
              </h1>
              <p className="text-[0.65rem] md:text-xs">8.88 lakh subscriber</p>
            </div>
            <Button
              className="text-xs md:text-base h-8 md:h-auto rounded-full disabled:cursor-not-allowed"
              disabled={
                !isAuthenticated || video?.owner?._id === currentUser._id
              }
              onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 sm:items-center w-full">
            <div className="flex">
              <Button
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-l-full rounded-r-none p-2"
                disabled={!isAuthenticated}
              >
                <span>
                  <ThumbUpOffAltIcon className="font-extrathin text-sm" />
                </span>
                <span>{video.likesCount || "1.2K"}</span>
              </Button>
              <Button
                className="text-black bg-gray-200 hover:bg-gray-300 rounded-r-full rounded-l-none border-l-[0.5px] border-gray-300 p-2"
                disabled={!isAuthenticated}
              >
                <span>
                  <ThumbDownOffAltIcon className="font-extrathin text-sm" />
                </span>
              </Button>
            </div>
            <div className="flex gap-5 items-center w-full">
              <Button
                className="flex gap-1 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2 "
                disabled={!isAuthenticated}
              >
                <span>
                  <ShareIcon className="font-extrathin text-sm" />
                </span>
                <span>Share</span>
              </Button>
              <Button
                className="flex gap-1 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                disabled={!isAuthenticated}
              >
                <span>
                  <DownloadIcon className="font-extrathin text-sm" />
                </span>
                <span>Download</span>
              </Button>

              <span
                className="flex text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                disabled={!isAuthenticated}
              >
                <PopoverMenu />
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 rounded-2xl p-3 w-full">
          <p className="text-sm md:text-base font-semibold">
            {video?.view || "1.7 lakh"} views •{" "}
            {format(video?.createdAt) || "2 weeks ago"}
          </p>
          <div className="text-sm md:text-base">
            <div>{video?.description}</div>
            <div className="flex gap-x-2 flex-wrap">
              {video?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className=" italic text-blue-500 text-[0.8rem] md:text-sm"
                >
                  {"#" + tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Comments Section */}
        <div className="w-full">
          <Comments commentCount={video.commentCount} />
        </div>
      </main>

      {/* Right part */}
      <div
        className="flex-1 px-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 items-start"
        style={{ gridAutoRows: "min-content" }}
      >
        {isLoading ? (
          <h1 className="mx-auto text-base md:text-xl">Loading...</h1>
        ) : (
          recommendedVideos
            .filter((video) => video._id != id)
            .map((video, index) => (
              <VideoCard
                key={video._id || index}
                id={video._id || 1}
                thumbnail={
                  video.thumbnail || "https://via.placeholder.com/640x360"
                }
                channelLogo={video.avatar || "https://via.placeholder.com/48"} //avatar
                title={
                  video.title ||
                  "Hey Guys! welcome to my Youtube Channel | By John Doe and friends | First Youtube video"
                }
                channelName={video.channelName || "Channel Name"}
                views={video.views || "3.5 lakh"}
                uploadTime={format(video.createdAt) || "1 year ago"}
                videoLength={formatTime(parseInt(video.duration)) || "3:00:00"}
                small={true}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default Video;

{
  /* {Array.from({ length: 10 }, (_, index) => (
          <VideoCard
            key={index}
            thumbnail="https://via.placeholder.com/640x360"
            channelLogo="https://via.placeholder.com/48"
            title="Hey Guys! welcome to my Youtube Channel | By John Doe and friends | First Youtube video"
            channelName="Channel Name"
            views="3.5 lakh"
            uploadTime="1 year ago"
            videoLength="3:00:00"
            small={true}
          />
        ))} */
}
