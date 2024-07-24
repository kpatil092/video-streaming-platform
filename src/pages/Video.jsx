import Comments from "@/components/Comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";

const Video = () => {
  const counts = 5;
  return (
    <div className="container flex gap-5 my-5">
      <main className="flex flex-col flex-[2] gap-3">
        <div className="video w-max">
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
        <div className="flex justify-between items-center">
          <div className="flex gap-5 items-center">
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
          <div className="flex gap-5 items-center">
            <div>
              <Button className="text-black bg-gray-100 hover:bg-gray-200 rounded-l-full rounded-r-none">
                <span>👍</span>
                <span>1.2K</span>
              </Button>
              <Button className="text-black bg-gray-100 hover:bg-gray-200 rounded-r-full rounded-l-none border-l-[0.5px] border-gray-300">
                <span>👎</span>
              </Button>
            </div>
            <Button className="flex gap-1 text-black bg-gray-100 hover:bg-gray-200 rounded-full ">
              <span>📩</span>
              <span>Share</span>
            </Button>
            <Button className="flex gap-1 text-black bg-gray-100 hover:bg-gray-200 rounded-full ">
              <span>⬇️</span>
              <span>Download</span>
            </Button>
            <Button className="flex gap-1 text-black bg-gray-100 hover:bg-gray-200 rounded-full ">
              <span>—</span>
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
            <Button className="text-s font-semibold bg-transparent p-0 h-auto hover:bg-transparent">
              ⫸ Sort by
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="flex space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Input
                placeholder="Add a comment..."
                className="border-x-0 border-t-0 rounded-none outline-none border-b-[1px] border-gray-300"
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
          {Array.from({ length: counts }, (_, index) => (
            <div key={index}>
              <Comments />
            </div>
          ))}
        </div>
      </main>
      <div className="flex-1 px-2">
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
