import React, { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    // Simulate fetching data
    const simulatedResults = [
      "Apple",
      "Banana",
      "Cherry",
      "Date",
      "Elderberry",
      "Fig",
      "Grape",
      "Honeydew",
    ].filter((item) => item.toLowerCase().includes(value.toLowerCase()));

    setResults(simulatedResults);
  };

  return (
    <div className="relative">
      <Command>
        <CommandInput
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          className="text-black w-full p-2 border border-gray-300 rounded"
        />
        {query && (
          <CommandList className="absolute left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-10">
            {results.map((result, index) => (
              <CommandItem
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {result}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

// export default SearchBar;
