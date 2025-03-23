import React from "react";
import "./SearchBar.css";

const SearchBar = ({ searchInput, setSearchInput, suggestions, setSuggestions, onSelectSuggestion, onSearch }) => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for an artist..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <button onClick={onSearch}>Search</button>
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          <p className="recent-searches">Recent searches</p>
          {suggestions.map((artist) => (
            <div
              key={artist.id}
              className="suggestion-item"
              onClick={() => {
                onSelectSuggestion(artist); // Handle selection
                setSuggestions([]); // Clear suggestions to hide dropdown
                setSearchInput(""); // Clear input field (optional)
              }}
            >
              <img src={artist.images[0]?.url || "/default.jpg"} alt={artist.name} />
              <div className="suggestion-text">
                <p className="artist-name">{artist.name}</p>
                <p className="artist-type">Artist</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
