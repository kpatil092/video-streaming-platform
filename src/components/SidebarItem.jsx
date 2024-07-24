import React from "react";

const SidebarItem = ({ category }) => {
  return (
    <div className="flex gap-5 items-center px-3 py-2 hover:bg-gray-600 hover:rounded-sm">
      <img src="" alt="" height={20} width={20}/>
      <div className="text-white">{category.name}</div>
    </div>
  );
};

export default SidebarItem;
