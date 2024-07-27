import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollablePanel from "@/components/ScrollablePanel";
import VideoCard from "@/components/VideoCard";

const Home = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return (
    <div className="px-2 md:container relative">
      <div className="sticky top-0 z-10">
        <ScrollablePanel />
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 mx-auto">
          {Array.from({ length: 50 }, (_, index) => (
            <VideoCard
              key={index}
              thumbnail="https://via.placeholder.com/640x360"
              channelLogo="https://via.placeholder.com/48"
              title="Hey Guys! welcome to my Youtube Channel | By John Doe and friends | First Youtube video"
              channelName="Channel Name"
              views="3.5 lakh"
              uploadTime="1 year ago"
              videoLength="3:00:00"
              small={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";
// import ScrollablePanel from "@/components/ScrollablePanel";
// // import Videos from "./Videos";

// const videos = Array.from({ length: 20 }, (_, index) => `Video ${index + 1}`);

// const App = () => {
//   return (
//     <div className="App">
//       <ScrollablePanel />
//       <div className="mt-4">
//         <div className="py-4">
//           {videos.map((video, index) => (
//             <div
//               key={index}
//               className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md"
//             >
//               {video}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
