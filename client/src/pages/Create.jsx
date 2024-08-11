import React, { useCallback, useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "@/api/axios";

const Create = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [tagsValue, setTagsValue] = useState("");
  const [tags, setTags] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const titleWordLimit = 50,
    titleMaxLength = 250;

  const handleTitleLengthChange = (e) => {
    const inputValue = e.target.value;
    const words = inputValue.split(/\s+/).filter(Boolean); // Split by spaces and filter out empty strings
    if (words.length <= titleWordLimit && inputValue.length <= titleMaxLength) {
      setTitleValue(inputValue);
    } else if (inputValue.length > titleMaxLength) {
      const trimmedValue = inputValue.slice(0, titleMaxLength);
      setTitleValue(trimmedValue);
    } else {
      const trimmedValue = words.slice(0, titleWordLimit).join(" ");
      setTitleValue(trimmedValue);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescriptionValue(e.target.value);
  };

  const handleTagsChange = (e) => {
    const inputValue = e.target.value;
    const tagList = inputValue
      .split(/[,\s;]/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.startsWith("#") && tag.length <= 20)
      .map((tag) => tag.slice(1).toLowerCase());
    if (tagList.length <= 10) {
      setTagsValue(inputValue);
      setTags(tagList);
    }
  };

  const onDropVideo = useCallback((acceptedFiles) => {
    setVideoFile(acceptedFiles[0]);
  }, []);

  const onDropThumbnail = useCallback((acceptedFiles) => {
    setThumbnailFile(acceptedFiles[0]);
  }, []);

  useEffect(() => {
    setIsFormValid(
      titleValue.trim() &&
        descriptionValue &&
        tags.length > 0 &&
        videoFile &&
        thumbnailFile
    );
  }, [titleValue, descriptionValue, tags, videoFile, thumbnailFile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", titleValue);
    formData.append("description", descriptionValue);
    formData.append("tags", tags);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      const response = await postData("video/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.statusCode === 200) {
        // const data = await response.json();
        toast.success("Video uploaded successfully!");
        // Reset form fields after successful upload
        setTitleValue("");
        setDescriptionValue("");
        setTagsValue("");
        setTags([]);
        setVideoFile(null);
        setThumbnailFile(null);
      } else {
        const errorData = await response.json();
        toast.error(`Upload failed: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Error uploading data");
    } finally {
      setIsUploading(false);
    }

    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] flex flex-col h-screen p-10"
      >
        <div className="flex justify-center gap-5 flex-col-reverse lg:flex-row w-full">
          {/* Left Side */}
          <div className="flex flex-col gap-5 w-full lg:w-2/3 p-6 bg-gray-50 rounded-lg drop-shadow-lg">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <textarea
                id="title"
                rows="3"
                value={titleValue}
                onChange={handleTitleLengthChange}
                required
                className="resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
              ></textarea>
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="8"
                value={descriptionValue}
                onChange={handleDescriptionChange}
                className="resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="tags">
                <span className="text-sm font-bold mb-2">Tags</span>
                <span className="text-xs">
                  (Comma separated, max 10 tags, each starting with #, max
                  length 20)
                </span>
              </label>
              <input
                id="tags"
                type="text"
                value={tagsValue}
                onChange={handleTagsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                required
              />
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full md:w-3/4 lg:w-1/3 p-6 bg-gray-50 rounded-lg drop-shadow-lg flex flex-col justify-between">
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="video"
              >
                Upload Video
              </label>

              <FileUploader
                onDrop={onDropVideo}
                accept="video/*"
                file={videoFile}
                type="video"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="thumbnail"
              >
                Upload Thumbnail
              </label>
              <FileUploader
                onDrop={onDropThumbnail}
                accept="image/*"
                file={thumbnailFile}
                type="thumbnail"
              />
            </div>
          </div>
        </div>
        <div className="w-full mt-6 flex space-x-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-6 w-30 rounded-lg shadow-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 w-30 rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!isFormValid || isUploading}
          >
            {isUploading ? "Uploading..." : "Post"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Create;
