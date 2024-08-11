import React, { useCallback, useEffect, useRef } from "react";
import ChannelCard from "@/components/ChannelCard";
import VideoCard from "@/components/VideoCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getData, postData } from "@/api/axios";
import { format } from "timeago.js";
import { Button } from "@/components/ui/button";

const Subscriptions = ({}) => {
  const navigate = useNavigate();
  const observerElem = useRef(null);
  const queryClient = useQueryClient();

  // Fetch subscribed channels
  const {
    data: channelsData,
    isLoading: isLoadingChannels,
    error: channelsError,
  } = useQuery({
    queryKey: ["subscribedChannels"],
    queryFn: async () => {
      const response = await getData("/users/subscriptions/channel");
      return response.data;
    },
  });

  // Fetch subscribed videos
  const {
    data: videosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["subscriptionVideos"],
    queryFn: async ({ pageParam = 1 }) => {
      const requestUrl = `/users/subscriptions/videos?page=${pageParam}&limit=6`;
      const response = await getData(requestUrl);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });

  // Mutation for unsubscribing from a channel
  const unsubscribeMutation = useMutation({
    mutationFn: async (channelId) => {
      await postData(`/users/unsubscribe/${channelId}`);
    },
    onSuccess: (_, channelId) => {
      // Invalidate the queries to update the data after successful unsubscription
      queryClient.invalidateQueries(["subscribedChannels"]);
      queryClient.invalidateQueries(["subscriptionVideos"]);

      // Optionally, remove the unsubscribed channel from the current state
      // or let the query refetch handle it.
    },
    onError: (error) => {
      console.error("Failed to unsubscribe:", error);
    },
  });

  const handleUnsubscribe = (channelId) => {
    unsubscribeMutation.mutate(channelId);
  };

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

  if (isLoadingChannels) {
    return <div>Loading channels...</div>;
  }

  if (channelsError) {
    return <div>Error loading channels: {channelsError.message}</div>;
  }

  return (
    <div className="md:container relative p-2">
      {/* Channel Cards - Horizontal Scroll */}
      <div className="relative mb-2">
        {channelsData?.length > 0 ? (
          <div
            className="overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-4 px-2 min-w-full mx-6">
              {channelsData.map((channel) => (
                <div key={channel._id} className="flex-shrink-0 shadow-lg">
                  <ChannelCard
                    channelName={channel.channelName}
                    logoUrl={channel.avatar}
                    isSubscribed={true}
                    onSubscribe={() => handleUnsubscribe(channel._id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              <p className="text-gray-600">No channels subscribed</p>
              <Button
                onClick={() => navigate("/home")}
                className="mt-4 px-4 py-2 text-white rounded-lg"
              >
                Go to Home Page
              </Button>
            </div>
          </div>
        )}

        {/* Fade effect on the edges */}
        {channelsData?.length > 0 && (
          <>
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none" />
          </>
        )}
      </div>

      {/* Video List - Vertical Scroll */}
      {channelsData?.length > 0 && (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 mx-auto">
              {videosData?.pages.map((page, pageIndex) =>
                page.docs.map((video, index) => (
                  <VideoCard
                    key={video._id || index}
                    id={video._id || 1}
                    thumbnail={
                      video.thumbnail || "https://via.placeholder.com/640x360"
                    }
                    channelLogo={
                      video?.avatar || "https://via.placeholder.com/48"
                    } //avatar
                    title={
                      video.title ||
                      "Hey Guys! welcome to my Youtube Channel | By John Doe and friends | First Youtube video"
                    }
                    channelName={video.channelName || "Channel Name"}
                    views={video.views || "3.5 lakh"}
                    uploadTime={format(video.createdAt) || "1 year ago"}
                    videoLength={
                      formatTime(parseInt(video.duration)) || "3:00:00"
                    }
                    small={false}
                  />
                ))
              )}
            </div>
          </div>
          <div
            ref={observerElem}
            className="h-10 flex justify-center items-center"
          >
            {isFetchingNextPage ? <span>Loading...</span> : null}
            {!hasNextPage && !isFetchingNextPage ? (
              <span>No more videos to load.</span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default Subscriptions;
