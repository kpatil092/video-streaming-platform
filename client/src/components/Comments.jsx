import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { format } from "timeago.js";

import { useAuth } from "@/contexts/AuthContext";

import { getData, postData } from "@/api/axios";

import { Button } from "./ui/button";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { TextareaAutosize } from "@mui/material";
import { Separator } from "@radix-ui/react-dropdown-menu";



// Single Comment
const SingleComment = ({ channelLogo, channelName, createdAt, content }) => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex gap-3">
      <div className="flex space-x-4">
        <img
          src={channelLogo || "https://via.placeholder.com/40/"}
          alt="Logo"
          className="rounded-full h-10 w-11 object-cover"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex gap-5 text-[0.85rem] md:text-sm items-center">
          <span className="font-semibold">{channelName || "Channel Name"}</span>
          <span className="text-gray-400 text-xs">
            {createdAt || "12 hours ago"}
          </span>
        </div>
        <p className="text-sm md:text-base">
          {content ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est suscipit recusandae, illum laborum soluta iste id perspiciatis repudiandae accusantium iure, fugiat aperiam asperiores?"}
        </p>

        <div className="flex gap-2">
          <Button
            className="rounded-full bg-gray-200 hover:bg-gray-300  text-black p-2 disabled:cursor-not-allowed"
            disabled={!isAuthenticated}
          >
            <ThumbUpOffAltIcon />
          </Button>
          <Button
            className="rounded-full bg-gray-200 hover:bg-gray-300 text-black p-2 disabled:cursor-not-allowed"
            disabled={!isAuthenticated}
          >
            <ThumbDownOffAltIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};




// Comments component
const Comments = ({ commentCount }) => {
  const [contentValue, setContentValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const observerElem = useRef(null);
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();

  const wordLimit = 300;
  const maxLen = 3000;

  // To fetch pages
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["comments"],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await getData(
          `/video/${id}/comments?page=${pageParam}&limit=3`
        );
        // console.log(response.data);
        return response.data;
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasNextPage ? pages.length + 1 : undefined;
      },
    });

  useEffect(() => {
    refetch();
  }, [id, isLoading]);

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

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const words = inputValue.split(/\s+/).filter(Boolean);
    if (words.length <= wordLimit && inputValue.length <= maxLen) {
      setContentValue(inputValue);
    } else if (inputValue.length > maxLen) {
      // Limit reached
      const trimmedValue = inputValue.slice(0, maxLen);
      setContentValue(trimmedValue);
    } else {
      // Limit reached
      const trimmedValue = words.slice(0, wordLimit).join(" ");
      setContentValue(trimmedValue);
    }
  };

  const handleCommentSubmit = async (e) => {
    setIsLoading(true);
    setErrorMessage("");
    e.preventDefault();

    try {
      const response = await postData(`/video/${id}/add-comment`, {
        content: contentValue,
      });
      console.log(response);
      if (response.statusCode === 200) {
        toast.success("Comment added to the video.");
      }
    } catch (error) {
      setErrorMessage("Unable to add comment.");
    } finally {
      setContentValue("");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full pt-3">
        <div className="flex gap-10">
          <h2 className="font-bold text-base md:text-xl">{commentCount || "No"} Comments</h2>
          {/* <Button className="text-s font-semibold bg-transparent p-0 h-auto hover:bg-transparent">
              ⫸ Sort by
            </Button> */}
        </div>
        {isAuthenticated && (
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
                value={contentValue}
                onChange={handleChange}
                className="text-sm md:text-base mt-1 p-2 border-t-0 border-x-0 border-b-[1.5px] bg-transparent border-gray-400 w-full focus:outline-none focus:border-gray-800 resize-none transition-colors"
              />
              <div className="flex justify-end gap-7">
                <Button
                  className="rounded-full h-auto text-sm text-black bg-gray-200 hover:bg-gray-300 border-gray-300 border-[0.5px]"
                  onClick={() => setContentValue("")}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-full h-auto text-white bg-gray-800 hover:bg-gray-700 border-gray-1000 border-[0.5px]"
                  onClick={handleCommentSubmit}
                  disabled={isLoading}
                >
                  Comment
                </Button>
              </div>
              {errorMessage.length > 0 && (
                <span className="h-10 flex items-center w-full bg-red-300 text-red-900 justify-center">
                  Cant't add comment right now.
                </span>
              )}
            </div>
          </div>
        )}
        <Separator />
        <div className="flex justify-center pt-2 flex-col gap-4">
          {data?.pages.map((page, pageIndex) =>
            page.docs.map((comment, index) => (
              <div key={index}>
                <SingleComment
                  channelLogo={
                    comment.avatar || "https://via.placeholder.com/40/"
                  }
                  channelName={comment.channelName || "Channel Name"}
                  createdAt={format(comment.createdAt) || "12 hours ago"}
                  content={
                    comment.content ||
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est suscipit recusandae, illum laborum soluta iste id perspiciatis repudiandae accusantium iure, fugiat aperiam asperiores?"
                  }
                />
              </div>
            ))
          )}
        </div>
        <div
          ref={observerElem}
          className="text-sm md:text-base h-10 flex justify-center items-center"
        >
          {isFetchingNextPage ? <span>Loading...</span> : null}
          {!commentCount ? (
            <span>No comments yet.</span>
          ) : !hasNextPage && !isFetchingNextPage ? (
            <span>No more comments to load.</span>
          ) : null}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default Comments;
