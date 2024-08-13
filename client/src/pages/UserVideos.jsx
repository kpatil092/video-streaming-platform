import React, { useCallback, useEffect, useRef } from "react";
import VideoCard from "@/components/VideoCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getData } from "@/api/axios";
import { format } from "timeago.js";

const UserVideos = () => {
  const observerElem = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["videos"],
      queryFn: async ({ pageParam = 1 }) => {
        // console.log(currentUser);
        const response = await getData(`/users/c/videos`);
        console.log(response);
        return response.data;
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasNextPage ? pages.length + 1 : undefined;
      },
    });

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerElem.current;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

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
    <div className="px-2 md:container relative my-5">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 mx-auto">
          {data?.pages.map((page, pageIndex) =>
            page.docs.map((video, index) => (
              <VideoCard
                key={video._id || index}
                id={video._id || 1}
                thumbnail={
                  video.thumbnail || "https://via.placeholder.com/640x360"
                }
                channelLogo={video?.avatar || "https://via.placeholder.com/48"} //avatar
                title={
                  video.title ||
                  "Hey Guys! welcome to my Youtube Channel | By John Doe and friends | First Youtube video"
                }
                channelName={video.channelName || "Channel Name"}
                views={video.views || "3.5 lakh"}
                uploadTime={format(video.createdAt) || "1 year ago"}
                videoLength={formatTime(parseInt(video.duration)) || "3:00:00"}
                small={false}
              />
            ))
          )}
        </div>
      </div>
      <div ref={observerElem} className="h-10 flex justify-center items-center">
        {isFetchingNextPage ? <span>Loading...</span> : null}
        {!hasNextPage && !isFetchingNextPage ? (
          <span>No more videos to load.</span>
        ) : null}
      </div>
    </div>
  );
};

export default UserVideos;
