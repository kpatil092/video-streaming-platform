import Comments from "@/components/Comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const Video = () => {
  const counts = 7;

  // const { pathname } = useLocation();
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: "instant",
  //   });
  // }, [pathname]);

  const [value, setValue] = useState("");
  const wordLimit = 300; // Set your word limit here
  const maxLen = 3000;

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
    <div className="px-4 flex flex-col xl:flex-row gap-5 my-5 w-full">
      <main className="flex flex-col flex-[2] gap-3">
        <div className="flex justify-center w-full">
          <img
            src="https://via.placeholder.com/900x500"
            alt="Video"
            className="rounded-2xl"
          />
        </div>
        <h2 className="font-bold text-xl line-clamp-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          minus totam reprehenderit provident culpa impedit. Eaque.
        </h2>
        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="flex gap-5 items-center justify-start w-full">
            <img
              src="https://via.placeholder.com/48"
              alt="Logo"
              className="rounded-full"
            />
            <div>
              <h1 className="text-md font-semibold">Channel Name CH1</h1>
              <p className="text-xs">8.88 lakh subscriber</p>
            </div>
            <Button className="rounded-3xl">Subscribe</Button>
          </div>
          <div className="flex gap-5 items-center w-full">
            <div>
              <Button className="text-black bg-gray-200 hover:bg-gray-300 rounded-l-full rounded-r-none p-2">
                <span>
                  <ThumbUpOffAltIcon className="font-extrathin text-sm" />
                </span>
                <span>1.2K</span>
              </Button>
              <Button className="text-black bg-gray-200 hover:bg-gray-300 rounded-r-full rounded-l-none border-l-[0.5px] border-gray-300 p-2">
                <span>
                  <ThumbDownOffAltIcon className="font-extrathin text-sm" />
                </span>
              </Button>
            </div>
            <Button className="flex gap-1 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2 ">
              <span>
                <ShareIcon className="font-extrathin text-sm" />
              </span>
              <span>Share</span>
            </Button>
            <Button className="flex gap-1 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2">
              <span>
                <DownloadIcon className="font-extrathin text-sm" />
              </span>
              <span>Download</span>
            </Button>
            <Button className="flex gap-1 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2">
              <span>
                <MoreHorizIcon className="text-xs" />
              </span>
            </Button>
          </div>
        </div>
        <div className="bg-gray-200 rounded-2xl p-3">
          <p className="font-semibold">1.7 lakh views • 2 weeks ago</p>
          <div className="text-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            ducimus dolores, nihil earum repellendus placeat iste. Similique
            libero aliquam debitis dolorum perspiciatis ad officiis quia aut
            blanditiis hic, adipisci aperiam nesciunt possimus reprehenderit
            deserunt maxime illum expedita, inventore, totam laboriosam commodi
            in earum. Odio voluptates, illum possimus deleniti rem cumque eaque
            vel quisquam consectetur fugiat nam voluptate, reiciendis quae
            veritatis dolorum perferendis. Excepturi laboriosam eos natus ipsa
            quod est neque labore atque vero nobis unde ex minima quae quisquam
            corrupti deserunt eaque odio quidem cupiditate sed, nihil quam
            laborum. Facilis tenetur corporis, in qui fugiat est temporibus
            alias ad ea? 1. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Earum autem labore deserunt est sapiente quas sint a eligendi
            in necessitatibus iure fugit, aperiam officiis. 1. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Earum autem labore deserunt
            est sapiente quas sint a eligendi in necessitatibus iure fugit,
            aperiam officiis. 1. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Earum autem labore deserunt est sapiente quas sint
            a eligendi in necessitatibus iure fugit, aperiam officiis. 1. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Earum autem
            labore deserunt est sapiente quas sint a eligendi in necessitatibus
            iure fugit, aperiam officiis. 1. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Earum autem labore deserunt est
            sapiente quas sint a eligendi in necessitatibus iure fugit, aperiam
            officiis. 1. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Earum autem labore deserunt est sapiente quas sint a eligendi
            in necessitatibus iure fugit, aperiam officiis. 1. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Earum autem labore deserunt
            est sapiente quas sint a eligendi in necessitatibus iure fugit,
            aperiam officiis. 1. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Earum autem labore deserunt est sapiente quas sint
            a eligendi in necessitatibus iure fugit, aperiam officiis. 1. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Earum autem
            labore deserunt est sapiente quas sint a eligendi in necessitatibus
            iure fugit, aperiam officiis. 1. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Earum autem labore deserunt est
            sapiente quas sint a eligendi in necessitatibus iure fugit, aperiam
            officiis. 1. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Earum autem labore deserunt est sapiente quas sint a eligendi
            in necessitatibus iure fugit, aperiam officiis. 1. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Earum autem labore deserunt
            est sapiente quas sint a eligendi in necessitatibus iure fugit,
            aperiam officiis.
          </div>
        </div>
        {/* Comments Section */}
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
                <Button className="rounded-full h-auto text-sm">Cancel</Button>
                <Button className="rounded-full h-auto " disabled>
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
                    <Comments />
                  </div>
                ))
              : "No comments yet"}
          </div>
        </div>
      </main>
      <div className="flex-1 px-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {Array.from({ length: 20 }, (_, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default Video;
