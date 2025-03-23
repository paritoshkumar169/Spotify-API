import React, { useState } from "react";

const HomePage = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {/* Title - Perfectly Centered at the Top */}
      <h1 className="text-5xl font-bold mb-8 text-center">Spotify Album Finder</h1>

      {/* Search Bar & Button - Centered Below Title */}
      <div className="flex items-center space-x-4 w-full max-w-lg">
        <input
          type="text"
          placeholder="Search for an artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 text-black rounded-lg focus:outline-none text-lg"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition text-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default HomePage;
