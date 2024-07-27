import React, { useEffect, useRef, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const dummyData = [
  "hello",
  "world",
  "how",
  "are",
  "you",
  "wanna",
  "be",
  "my",
  "friend",
];

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const suggestionBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      // Fetch suggestions based on searchQuery
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    // Replace with your API call
    // let data = "";
    // try {
    //   const response = await fetch(`/api/suggestions?q=${query}`);
    //   data = await response.json();
    // } catch (error) {
    //   console.log(error);
    // }
    setSuggestions(dummyData.slice(0, 7));
  };

  const handleSearch = () => {
    if (searchQuery.length > 0) {
      // && !suggestions.includes(searchQuery)
      // Perform search action
      console.log(`Searching for ${searchQuery}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    // Perform search action if needed
    console.log(`Selected suggestion ${suggestion}`);
  };

  return (
    <div className="flex w-full">
      <input
        placeholder="Search"
        className="bg-transparent flex-[12] border-none outline-none w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchOutlinedIcon
        className="flex-1 p-0 cursor-pointer"
        onClick={handleSearch}
      />
      {suggestions.length > 0 && (
        <ul
          className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20"
          ref={suggestionBoxRef}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchbar;
