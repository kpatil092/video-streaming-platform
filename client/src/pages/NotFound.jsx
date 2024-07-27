import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-full flex-col">
      <h1 className="text-base md:text-2xl">
        Sorry, the page you were looking for was not found.
      </h1>
      <div className="mt-5 text-base md:text-lg underline">
        <Link to="/">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
