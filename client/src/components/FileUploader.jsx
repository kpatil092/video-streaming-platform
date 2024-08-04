import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const FileUploader = ({ onDrop, accept, file, type, setVideoLink }) => {
  const [uploading, setUploading] = useState(false);
  const [videoLink, setLocalVideoLink] = useState(null);

  useEffect(() => {
    if (file && type === "video") {
      setUploading(true);
      const uploadTime = setTimeout(() => {
        setUploading(false);
        const generatedLink = URL.createObjectURL(file); // Simulate a video link
        setLocalVideoLink(generatedLink);
      }, 3000); // Simulate 3 seconds upload time

      return () => clearTimeout(uploadTime);
    }
  }, [file, type, setVideoLink]);

  return (
    <div>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center h-full w-full cursor-pointer"
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="w-full flex flex-col items-center justify-center h-full gap-2">
                {type === "video" ? (
                  uploading ? (
                    <div
                      className={`flex w-full items-center justify-center h-${
                        type === "video" ? "48" : "36"
                      } border-2 border-dashed border-gray-400 rounded-lg`}
                    >
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <video
                        src={videoLink || URL.createObjectURL(file)}
                        className="w-full object-cover rounded-sm"
                        controls
                      />
                      <div className="text-gray-500 mt-2 text-sm">{file.name}</div>
                    </>
                  )
                ) : (
                  <>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Uploaded file"
                      className="w-full object-cover rounded-sm"
                    />
                    <div className="text-gray-500 mt-2 text-sm">{file.name}</div>
                  </>
                )}
              </div>
            ) : (
              <div
                className={`flex flex-col w-full items-center justify-center h-${
                  type === "video" ? "48" : "36"
                } border-2 border-dashed border-gray-400 rounded-lg`}
              >
                <FileUploadIcon />
                <div className="text-center text-dark-600">
                  <p className="text-14-regular">
                    <span className="text-green-500">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default FileUploader;
