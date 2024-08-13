import React from "react";
import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();

  return (
    <div className="flex flex-col gap-5 justify-center items-center h-screen">
      <h1 className="p-4 rounded-sm bg-red-200 text-red-600">
        Error: {error.message}
      </h1>
      <pre className="p-1 rounded-sm bg-blue-200 text-blue-600">
        {error.status} - {error.statusText}
      </pre>
    </div>
  );
}
