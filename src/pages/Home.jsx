import ScrollablePanel from "@/components/ScrollablePanel";
import { VideoCard } from "@/components/VideoCard";

const Home = () => (
  <div className="container">
    <div className="">
      <ScrollablePanel />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
);

export default Home;

import React from "react";
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
