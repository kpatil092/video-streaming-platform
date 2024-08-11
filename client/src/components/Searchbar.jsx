import React, { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getData } from "@/api/axios";
import { useNavigate } from "react-router-dom";

const fetchSuggestions = async (query) => {
  const response = await getData(`/video/keyword?query=${query}`);
  return response.data.slice(0, 7);
};

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Separate debounced query
  const [suggestions, setSuggestions] = useState([]);
  const suggestionBoxRef = useRef(null);
  const navigate = useNavigate();

  // Debounce the query for API fetching
  const debouncedFetchSuggestions = useCallback(
    debounce((query) => {
      setDebouncedQuery(query);
    }, 300),
    []
  );

  const { data, refetch } = useQuery({
    queryKey: ["suggestions", debouncedQuery],
    queryFn: () => fetchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 2, 
  });

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      refetch();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, refetch]);

  useEffect(() => {
    if (data) {
      setSuggestions(data);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value); 
    debouncedFetchSuggestions(value); // Debounce API request
  };

  const handleSearch = () => {
    if (searchQuery.length > 2) {
      navigate(`/home?q=${searchQuery}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    navigate(`/home?q=${suggestion}`);
  };

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

  return (
    <div className="flex w-full">
      <input
        placeholder="Search"
        className="bg-transparent flex-[12] border-none outline-none w-full"
        value={searchQuery}
        onChange={handleInputChange}
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


